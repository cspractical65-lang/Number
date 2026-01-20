/**
 * LEGIT OTP SELL BOT - Production Server
 * Token: 8555304401:AAFrE-7qGm9i5cio4IWGxftynZQx0zEbHbA
 */

const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const axios = require('axios');

const TOKEN = '8555304401:AAFrE-7qGm9i5cio4IWGxftynZQx0zEbHbA';
const bot = new Telegraf(TOKEN);
const app = express();

const SERVER_URL = process.env.SERVER_URL || 'https://your-app-name.onrender.com'; 
const WEBHOOK_PATH = `/webhook/${TOKEN}`;

const regions = [
  { id: 'tg-us', name: 'USA', price: 0.50, flag: '🇺🇸' },
  { id: 'tg-uk', name: 'UK', price: 0.45, flag: '🇬🇧' },
  { id: 'tg-ru', name: 'Russia', price: 0.20, flag: '🇷🇺' },
  { id: 'tg-id', name: 'Indonesia', price: 0.25, flag: '🇮🇩' },
];

bot.start((ctx) => {
  const welcomeText = `
👋 *Welcome to Legit OTP Sell Bot!*
Get instant virtual numbers 24/7.
`;
  return ctx.replyWithMarkdown(welcomeText, Markup.inlineKeyboard([
    [Markup.button.callback('🛒 Buy Number', 'menu_buy'), Markup.button.callback('👤 Profile', 'menu_profile')],
    [Markup.button.callback('💳 Add Funds', 'menu_deposit')]
  ]));
});

bot.action('menu_buy', (ctx) => {
  const buttons = regions.map(r => [
    Markup.button.callback(`${r.flag} ${r.name} - $${r.price.toFixed(2)}`, `buy_${r.id}`)
  ]);
  return ctx.editMessageText('🌍 *Select Region:*', { parse_mode: 'Markdown', ...Markup.inlineKeyboard(buttons) });
});

app.use(express.json());
app.use(bot.webhookCallback(WEBHOOK_PATH));
app.listen(process.env.PORT || 3000, async () => {
  const webhookUrl = `${SERVER_URL}${WEBHOOK_PATH}`;
  await axios.get(`https://api.telegram.org/bot${TOKEN}/setWebhook?url=${webhookUrl}`);
  console.log('Bot Live!');
});
