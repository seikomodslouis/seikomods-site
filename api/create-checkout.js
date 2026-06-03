const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  // CORS
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://seikomods-louis.fr',
    'http://seikomods-louis.fr',
    'https://www.seikomods-louis.fr',
    'http://www.seikomods-louis.fr',
    'https://seikomods-site.vercel.app',
  ];
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Panier vide' });
    }

    // Construire les line_items Stripe depuis le panier
    const line_items = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          description: [
            item.opts?.finition  ? `Finition: ${item.opts.finition}`   : '',
            item.opts?.bracelet  ? `Bracelet: ${item.opts.bracelet}`   : '',
            item.opts?.cadran    ? `Cadran: ${item.opts.cadran}`       : '',
            item.opts?.aiguilles ? `Aiguilles: ${item.opts.aiguilles}` : '',
          ].filter(Boolean).join(' · ') || undefined,
        },
        unit_amount: Math.round(item.price * 100), // centimes
      },
      quantity: 1,
    }));

    // Frais de livraison (offerts à partir de 2 articles)
    if (items.length < 2) {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Livraison' },
          unit_amount: 1000, // 10€
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://seikomods-louis.fr'}/merci.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://seikomods-louis.fr'}/panier.html`,
      allow_promotion_codes: true,
      locale: 'fr',
      shipping_address_collection: {
        allowed_countries: ['FR', 'BE', 'CH', 'LU', 'MC'],
      },
      phone_number_collection: { enabled: true },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};
