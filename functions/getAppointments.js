const { Client, fql } = require('fauna');

exports.handler = async (event, context) => {
  const client = new Client({
    secret: process.env.FAUNA_SECRET,
  });

  try {
    const result = await client.query(fql`
      Collection("Appointments").all().map(appointment => {
        {
          id: appointment.id,
          name: appointment.name,
          email: appointment.email,
          phone: appointment.phone,
          address: appointment.address,
          service: appointment.service,
          budget: appointment.budget,
          event_date: appointment.event_date,
          event_location: appointment.event_location
        }
      })
    `);

    return {
      statusCode: 200,
      body: JSON.stringify(result.data)
    };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch appointments', details: error.message })
    };
  }
};