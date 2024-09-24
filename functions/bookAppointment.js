const { Client, fql } = require('fauna');

exports.handler = async (event, context) => {
  console.log('Function invoked with body:', event.body);

  let Mailjet;
  if (process.env.NODE_ENV !== 'development') {
    try {
      Mailjet = await import('node-mailjet');
    } catch (error) {
      console.error('Failed to import node-mailjet:', error);
    }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const client = new Client({
      secret: process.env.FAUNA_SECRET,
    });

    const data = JSON.parse(event.body);

    // Ensure services is an array
    if (!Array.isArray(data.services)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Services must be an array' }),
      };
    }

    // Check for required fields
    const requiredFields = ['name', 'phone', 'address', 'services', 'budget', 'event_date', 'event_location'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: `${field} is required` }),
        };
      }
    }

    const result = await client.query(fql`
      let appointment = Collection("Appointments").create({
        name: ${data.name},
        email: ${data.email || null},
        phone: ${data.phone},
        address: ${data.address},
        services: ${data.services},
        other_service: ${data.other_service || null},
        budget: ${data.budget},
        event_date: ${data.event_date},
        event_location: ${data.event_location},
        createdAt: Time.now()
      })
    
      {
        id: appointment.id,
        name: appointment.name,
        email: appointment.email,
        phone: appointment.phone,
        address: appointment.address,
        services: appointment.services,
        other_service: appointment.other_service,
        budget: appointment.budget,
        event_date: appointment.event_date,
        event_location: appointment.event_location,
        createdAt: appointment.createdAt
      }
    `);

    let servicesText = data.services.join(', ');
    if (data.services.includes('Other') && data.other_service) {
      servicesText += ` (${data.other_service})`;
    }

    if (Mailjet) {
      const mailjet = Mailjet.apiConnect(
        process.env.MAILJET_API_KEY,
        process.env.MAILJET_API_SECRET
      );

      const messages = [
        {
          From: {
            Email: 'ayiwareignsclothing@gmail.com',
            Name: 'ARCLOTHING',
          },
          To: [
            {
              Email: data.email || 'default-email@example.com', // Use default email if not provided
              Name: data.name,
            },
          ],
          Subject: 'Appointment Confirmation',
          TextPart: `Dear ${data.name}, your appointment for ${servicesText} on ${data.event_date} has been booked.`,
          HTMLPart: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e04141; text-align: center;">Appointment Booked!</h2>
          <p>Dear ${data.name},</p>
          <p>Thank you for choosing AYIWA REIGNS CLOTHING. We're excited to create something beautiful for you!</p>
           <p>We will give you a call very soon to begin the process and discuss your dream outfit.</p>
           <p>Get ready for a journey of style and elegance!</p>
            <h3>Appointment Details:</h3>
          <ul>
            <li><strong>Services:</strong> ${servicesText}</li>
            <li><strong>Event Date:</strong> ${data.event_date}</li>
            <li><strong>Event Location:</strong> ${data.event_location}</li>
            <li><strong>Budget:</strong> ${data.budget}</li>
          </ul>
          <img src="https://imgur.com/wtbfRCu.png" alt="AYIWA REIGNS CLOTHING Logo" style="display: block; margin: 20px auto 0; max-width: 200px;">
        </div>
        `,
        },
        {
          From: {
            Email: 'ayiwareignsclothing@gmail.com',
            Name: 'ARCLOTHING',
          },
          To: [
            {
              Email: 'ayiwareignsclothing@gmail.com', // Replace with your admin email
              Name: 'Admin',
            },
          ],
          Subject: 'New Appointment Booked',
          TextPart: `A new appointment has been booked by ${data.name} for ${servicesText} on ${data.event_date}.
          Details:
          Name: ${data.name}
          Email: ${data.email}
          Phone: ${data.phone}
          Address: ${data.address}
          Services: ${servicesText}
          Budget: ${data.budget}
          Event Date: ${data.event_date}
          Event Location: ${data.event_location}`,
          HTMLPart: `<h3>New Appointment Booked</h3>
          <p>A new appointment has been booked by ${data.name} for ${servicesText} on ${data.event_date}.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Address:</strong> ${data.address}</li>
            <li><strong>Services:</strong> ${servicesText}</li>
            <li><strong>Budget:</strong> ${data.budget}</li>
            <li><strong>Event Date:</strong> ${data.event_date}</li>
            <li><strong>Event Location:</strong> ${data.event_location}</li>
          </ul>`,
        },
      ];

      await mailjet.post('send', { version: 'v3.1' }).request({ Messages: messages });
      console.log('Emails sent successfully');
    } else {
      console.log('Emails would be sent in production environment');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Appointment booked successfully', data: result }),
    };
  } catch (error) {
    console.error('Error booking appointment:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to book appointment', details: error.message }),
    };
  }
};