const { Client, fql } = require('fauna');

exports.handler = async (event, context) => {
  const client = new Client({
    secret: process.env.FAUNA_SECRET, // Note: Changed from FAUNADB_SECRET
  });
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const result = await client.query(fql`
      Appointments.create({
        data: ${data}
      })
    `);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Appointment booked successfully', id: result.id })
    };
  } catch (error) {
    console.error('Error booking appointment:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Failed to book appointment' }) };
  }
};