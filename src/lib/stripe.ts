import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2026-04-22.dahlia',
  typescript: true,
});

export const STRIPE_PRICES = {
  starter: process.env.STRIPE_PRICE_STARTER || 'price_starter_mock',
  pro: process.env.STRIPE_PRICE_PRO || 'price_pro_mock',
};
