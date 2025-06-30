/*// bot.js
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
*/

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
  bot.sendMessage(msg.chat.id, `🛠 কমান্ডসমূহ:\n/start - শুরু করুন\n/help - সহায়তা দেখুন\n/menu - মেনু দেখুন`);
});

// Add a /menu command with Register and My Account options
bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "👇 অপশনসমূহ থেকে নির্বাচন করুন:", {
    reply_markup: {
      keyboard: [
        [{ text: "📝 Register" }, { text: "👤 My Account" }],
        [{ text: "❌ Close Menu" }]
      ],
      resize_keyboard: true,
      one_time_keyboard: true
    }
  });
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore commands
  if (text.startsWith("/")) {
    return;
  }

  // Handle menu options
  if (text === "📝 Register") {
    bot.sendMessage(chatId, "রেজিস্ট্রেশন করার জন্য আপনার নাম লিখুন:");
    // You can add more logic here to handle the registration process
  } else if (text === "👤 My Account") {
    bot.sendMessage(chatId, "এটি আপনার অ্যাকাউন্ট সংক্রান্ত তথ্য দেখানোর জায়গা।");
    // You can add logic here to show account information
  } else if (text === "❌ Close Menu") {
    bot.sendMessage(chatId, "মেনু বন্ধ করা হয়েছে।", {
      reply_markup: {
        remove_keyboard: true
      }
    });
  } else {
    bot.sendMessage(chatId, `আপনি লিখেছেন: "${text}"`);
  }
});
