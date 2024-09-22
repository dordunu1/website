const { Client, fql } = require('fauna');
const Mailjet = require('node-mailjet');

exports.handler = async (event, context) => {
  console.log('Function invoked with body:', event.body);
  
  const client = new Client({
    secret: process.env.FAUNA_SECRET,
  });
  
  const mailjet = new Mailjet({
    apiKey: process.env.MAILJET_API_KEY,
    apiSecret: process.env.MAILJET_API_SECRET
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
    
    // Send email notification
    const emailData = {
      Messages: [
        {
          From: {
            Email: "ayiwareignsclothing@gmail.com",
            Name: "ARClothing"
          },
          To: [
            {
              Email: "ayiwareignsclothing@gmail.com",
              Name: "ARClothing"
            }
          ],
          Subject: "New Appointment Booked",
          TextPart: `
            New appointment booked:
            Name: ${data.name}
            Email: ${data.email}
            Phone: ${data.phone}
            Address: ${data.address}
            Service: ${data.service}
            Budget: ${data.budget}
            Event Date: ${data.event_date}
            Event Location: ${data.event_location}
          `
        }
      ]
    };

    await mailjet.post("send", { version: "v3.1" }).request(emailData);

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