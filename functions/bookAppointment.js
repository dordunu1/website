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

    const result = await client.query(fql`
      let appointment = Collection("Appointments").create({
        name: ${data.name},
        email: ${data.email || null},
        phone: ${data.phone},
        address: ${data.address},
        service: ${data.service},
        budget: ${data.budget},
        event_date: ${data.event_date},
        event_location: ${data.event_location},
        createdAt: Time.now() // Add this line to set the creation time
      })

      {
        id: appointment.id,
        name: appointment.name,
        email: appointment.email,
        phone: appointment.phone,
        address: appointment.address,
        service: appointment.service,
        budget: appointment.budget,
        event_date: appointment.event_date,
        event_location: appointment.event_location,
        createdAt: appointment.createdAt // Add this line to include createdAt in the response
      }
    `);

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
              Email: data.email,
              Name: data.name,
            },
          ],
          Subject: 'Appointment Confirmation',
          TextPart: `Dear ${data.name}, your appointment for ${data.service} on ${data.event_date} has been booked.`,
          HTMLPart: `<h3>Dear ${data.name},</h3><p>Your appointment for ${data.service} on ${data.event_date} has been booked.</p>`,
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
          TextPart: `A new appointment has been booked by ${data.name} for ${data.service} on ${data.event_date}.
          Details:
          Name: ${data.name}
          Email: ${data.email}
          Phone: ${data.phone}
          Address: ${data.address}
          Service: ${data.service}
          Budget: ${data.budget}
          Event Date: ${data.event_date}
          Event Location: ${data.event_location}`,
          HTMLPart: `<h3>New Appointment Booked</h3>
          <p>A new appointment has been booked by ${data.name} for ${data.service} on ${data.event_date}.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Address:</strong> ${data.address}</li>
            <li><strong>Service:</strong> ${data.service}</li>
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