const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  const allowedOrigins = [
    'https://seikomods-louis.fr',
    'http://seikomods-louis.fr',
    'https://www.seikomods-louis.fr',
    'https://seikomods-site.vercel.app',
  ];
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'session_id manquant' });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items', 'line_items.data.price.product'],
    });

    res.status(200).json({
      email: session.customer_details?.email || '',
      name: session.customer_details?.name || '',
      phone: session.customer_details?.phone || '',
      address: session.shipping_details?.address || session.customer_details?.address || {},
      items: session.line_items?.data?.map(i => i.description || i.price?.product?.name || i.description) || [],
      total: (session.amount_total / 100).toFixed(2) + ' €',
      commande: session.line_items?.data?.map(i => {
        const desc = i.price?.product?.description || i.description || '';
        return i.description ? `${i.description}${desc ? ' ('+desc+')' : ''}` : (desc || 'SeikoMod custom');
      }).filter(Boolean).join(' | ') || 'SeikoMod custom',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
