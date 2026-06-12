const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const allowedOrigins = [
    'https://seikomods-louis.fr',
    'http://seikomods-louis.fr',
    'https://www.seikomods-louis.fr',
    'http://www.seikomods-louis.fr',
    'https://seikomods-site.vercel.app',
  ];
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const payments = await stripe.paymentIntents.list({ limit: 100 });
    const paidCount = payments.data.filter(p => p.status === 'succeeded').length;
    const freeShipping = paidCount < 10;
    const ordersLeft = Math.max(0, 10 - paidCount);
    res.status(200).json({ freeShipping, ordersLeft });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
