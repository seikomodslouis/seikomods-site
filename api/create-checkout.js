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
    const { items, shippingMethod } = req.body;

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

    // Livraison standard : -10€ sur la commande · livraison accélérée : +8€
    let discounts;
    if (shippingMethod === 'accelerated') {
      line_items.push({
        price_data: {
          currency: 'eur',
          product_data: { name: 'Livraison accélérée (10 à 12 jours)' },
          unit_amount: 800, // 8€
        },
        quantity: 1,
      });
    } else {
      // Réduction de 10€ par montre pour la livraison standard (coupon réutilisable par quantité)
      const amountOff = 1000 * items.length; // 10€ par montre, en centimes
      const couponId = `LIVRAISON_STANDARD_${items.length}`;
      try {
        try {
          await stripe.coupons.retrieve(couponId);
        } catch (e) {
          await stripe.coupons.create({
            id: couponId,
            amount_off: amountOff,
            currency: 'eur',
            duration: 'once',
            name: `Réduction livraison standard (${items.length} montre${items.length > 1 ? 's' : ''})`,
          });
        }
        discounts = [{ coupon: couponId }];
      } catch (e) {
        console.error('Coupon error:', e);
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://seikomods-louis.fr'}/merci.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || 'https://seikomods-louis.fr'}/panier.html`,
      // allow_promotion_codes et discounts sont mutuellement exclusifs côté Stripe
      ...(discounts ? { discounts } : { allow_promotion_codes: true }),
      locale: 'fr',
      shipping_address_collection: {
        allowed_countries: ['FR'],
      },
      phone_number_collection: { enabled: true },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};
