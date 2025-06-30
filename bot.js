// bot.js
const TelegramBot = require('node-telegram-bot-api');

const token ="7814244698:AAHyE2tsIxl7Xwhg2l65rhqF8Mt2zLdOT34";
//process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const name = msg.from.first_name || "বন্ধু";
  bot.sendMessage(msg.chat.id, `👋 হ্যালো ${name}, আমি Render-এ হোস্টকৃত একটি টেলিগ্রাম বট!`);
});

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, `🛠 কমান্ডসমূহ:\n/start - শুরু করুন\n/help - সহায়তা দেখুন`);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text.startsWith("/")) {
    bot.sendMessage(chatId, `আপনি লিখেছেন: "${text}"`);
  }
});
