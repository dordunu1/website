const { Client, fql } = require('fauna');

exports.handler = async (event, context) => {
  console.log('Function invoked with body:', event.body);
  
  const client = new Client({
    secret: process.env.FAUNA_SECRET,
  });
  
  if (event.httpMethod !== 'POST') {
    console.log('Method not allowed:', event.httpMethod);
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('Parsed data:', data);
    
    const result = await client.query(fql`
      Collection("Appointments").create({
        name: ${data.name},
        email: ${data.email},
        phone: ${data.phone},
        address: ${data.address},
        service: ${data.service},
        budget: ${data.budget},
        event_date: ${data.event_date},
        event_location: ${data.event_location}
      })
    `);
    
    console.log('Successfully created appointment:', result);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Appointment booked successfully', id: result.id })
    };
  } catch (error) {
    console.error('Error booking appointment:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Failed to book appointment', details: error.message }) 
    };
  }
};