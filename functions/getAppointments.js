const { Client, fql } = require('fauna');

exports.handler = async (event, context) => {
  const client = new Client({
    secret: process.env.FAUNA_SECRET,
  });

  const page = parseInt(event.queryStringParameters?.page || '1');
  const pageSize = 10;
  const sortField = event.queryStringParameters?.sortField || 'createdAt';
  const sortOrder = event.queryStringParameters?.sortOrder || 'desc';

  try {
    const result = await client.query(fql`
      let appointments = Collection("Appointments").all().map(appointment => {
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
      });
      
      let sortedAppointments = 
        if (${sortField} == "createdAt") {
          if (${sortOrder} == "asc") appointments.order(a => a.createdAt) else appointments.order(a => a.createdAt, "desc")
        } else if (${sortField} == "event_date") {
          if (${sortOrder} == "asc") appointments.order(a => a.event_date) else appointments.order(a => a.event_date, "desc")
        } else if (${sortField} == "services") {
          if (${sortOrder} == "asc") appointments.order(a => a.services.join(", ")) else appointments.order(a => a.services.join(", "), "desc")
        } else if (${sortField} == "name") {
          if (${sortOrder} == "asc") appointments.order(a => a.name) else appointments.order(a => a.name, "desc")
        } else if (${sortField} == "email") {
          if (${sortOrder} == "asc") appointments.order(a => a.email) else appointments.order(a => a.email, "desc")
        } else if (${sortField} == "phone") {
          if (${sortOrder} == "asc") appointments.order(a => a.phone) else appointments.order(a => a.phone, "desc")
        } else if (${sortField} == "address") {
          if (${sortOrder} == "asc") appointments.order(a => a.address) else appointments.order(a => a.address, "desc")
        } else if (${sortField} == "budget") {
          if (${sortOrder} == "asc") appointments.order(a => a.budget) else appointments.order(a => a.budget, "desc")
        } else if (${sortField} == "event_location") {
          if (${sortOrder} == "asc") appointments.order(a => a.event_location) else appointments.order(a => a.event_location, "desc")
        } else {
          appointments
        };
      
      let totalCount = sortedAppointments.count();
      let paginatedAppointments = sortedAppointments.drop(${(page - 1) * pageSize}).take(${pageSize});
      
      {
        data: paginatedAppointments,
        totalCount: totalCount,
        currentPage: ${page},
        pageSize: ${pageSize}
      }
    `);

    console.log('Fauna query result:', JSON.stringify(result, null, 2));

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: result.data.data,
        totalCount: result.data.totalCount,
        currentPage: page,
        pageSize: pageSize
      })
    };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch appointments', details: error.message })
    };
  }
};