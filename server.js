const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
app.use(cors());

const app = express();
const port = process.env.PORT || 3000;

const PAYSTACK_SECRET_KEY = 'pk_test_5cfca3319e17ddb0315d10669c2239a4a56f770c';

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// API endpoint to save appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/bookAppointment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get all appointments
app.get('/api/appointments', async (req, res) => {
  console.log('GET request received for /api/appointments');
  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/getAppointments');
    const data = await response.json();
    console.log('Sending appointments:', data);
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/check', async (req, res) => {
  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/getAppointments');
    const data = await response.json();
    res.json({ count: data.length, appointments: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// New API endpoint for Paystack payment verification
app.post('/verify-payment', async (req, res) => {
  const { reference } = req.body;
  
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );
    
    if (response.data.data.status === 'success') {
      // Payment verified, process the order
      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.json({ success: false, message: 'Payment failed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});