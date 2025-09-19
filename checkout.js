const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('.Stonehood./models/Order');

const {
  PAYFAST_MERCHANT_ID,
  PAYFAST_MERCHANT_KEY,
  CLIENT_URL,
} = process.env;

function generateSignature(data) {
  const dataString = Object.keys(data)
    .sort()
    .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
    .join('&');

  return crypto.createHash('md5').update(dataString + PAYFAST_MERCHANT_KEY).digest('hex');
}

// Create a payment request and redirect user
router.post('/create-payment', async (req, res) => {
  try {
    const { cartItems, customerInfo } = req.body;

    const amount = (cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) / 100).toFixed(2);

    const order = await Order.create({
      items: cartItems,
      amount: amount * 100,
      status: 'pending-payfast',
      paymentMethod: 'PayFast',
      customerInfo,
    });

    const paymentData = {
      merchant_id: PAYFAST_MERCHANT_ID,
      merchant_key: PAYFAST_MERCHANT_KEY,
      return_url: `${CLIENT_URL}/success.html`,
      cancel_url: `${CLIENT_URL}/cancel.html`,
      notify_url: `http://localhost:${process.env.PORT}/api/payfast/ipn`,
      m_payment_id: order._id.toString(),
      amount: amount,
      item_name: `Hoodie Order #${order._id}`,
    };

    paymentData.signature = generateSignature(paymentData);

    const queryString = Object.keys(paymentData)
      .map(key => `${key}=${encodeURIComponent(paymentData[key])}`)
      .join('&');

    const payfastUrl = `https://sandbox.payfast.co.za/eng/process?${queryString}`;

    res.json({ url: payfastUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Handle IPN from PayFast (called by PayFast server)
router.post('/ipn', express.urlencoded({ extended: false }), async (req, res) => {
  const data = req.body;
  const receivedSignature = data.signature;
  delete data.signature;

  const computedSignature = generateSignature(data);

  if (receivedSignature !== computedSignature) {
    console.error('❌ Signature mismatch');
    return res.status(400).send('Invalid signature');
  }

  if (data.payment_status === 'COMPLETE') {
    try {
      await Order.findByIdAndUpdate(data.m_payment_id, { status: 'paid' });
      return res.status(200).send('OK');
    } catch (error) {
      console.error('Failed to update order:', error);
      return res.status(500).send('Server error');
    }
  }

  res.status(200).send('OK');
});

module.exports = router;