// bot.js
const TelegramBot = require('node-telegram-bot-api');
const db = require('./db');
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const { Keyboard } = require('telegram-keyboard');
const { getUserById, registerUser, updateUser, deleteUser, setStatus, getUserStatus } = require('./dbUtils');

const menu = (status) => {
  if (!status) return [["📋 Register"]];
  if (status === "deactivated") return [["♻️ Reactivate Account"]];
  return [
    ["🔐 My Account"],
    ["🗑️ Delete Account", "🚫 Deactivate Account"],
    ["✏️ Edit Account", "🔑 Change Password"],
    ["🔙 Back to Menu"]
  ];
};

bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  const name = msg.from.first_name || "User";
  const status = await getUserStatus(userId);
  bot.sendMessage(userId, `👋 স্বাগতম, ${name}!

নিচের মেনু থেকে অপশন বেছে নিন ⬇️`, {
    reply_markup: {
      keyboard: menu(status),
      resize_keyboard: true
    }
  });
});

bot.on('message', async (msg) => {
  const userId = msg.from.id;
  const text = msg.text;
  const name = msg.from.first_name || "";
  const lname = msg.from.last_name || "";
  const fullName = (name + " " + lname).trim();
  const username = msg.from.username || `user_${Math.floor(Math.random()*9999)}`;

  const user = await getUserById(userId);

  if (text === "📋 Register") {
    if (user) {
      return bot.sendMessage(userId, "🔁 আপনি ইতিমধ্যেই রেজিস্টার করেছেন।");
    }
    const password = Math.random().toString(36).slice(-8);
    await registerUser(userId, username, fullName, password);
    bot.sendMessage(userId, `✅ একাউন্ট তৈরি হয়েছে!
🆔 User ID: <code>${userId}</code>
👤 Username: <b>${username}</b>
📛 Name: <b>${fullName}</b>
🔐 Password: <code>${password}</code>
🔘 Status: <b>active</b>`, { parse_mode: "HTML" });
    return bot.sendMessage(userId, "🔁 মেনু আপডেট হচ্ছে...", {
      reply_markup: {
        keyboard: menu("active"),
        resize_keyboard: true
      }
    });
  }

  if (!user && text !== "📋 Register") {
    return bot.sendMessage(userId, "❌ অনুগ্রহ করে প্রথমে রেজিস্টার করুন।");
  }

  if (text === "🔐 My Account") {
    const { username, name, password, status } = user;
    return bot.sendMessage(userId, `🗂️ আপনার একাউন্ট তথ্য:
🆔 User ID: <code>${userId}</code>
👤 Username: <b>${username}</b>
📛 Name: <b>${name}</b>
🔐 Password: <code>${password}</code>
🔘 Status: <b>${status}</b>`, { parse_mode: "HTML" });
  }

  if (text === "✏️ Edit Account") {
    bot.sendMessage(userId, "✏️ নতুন নাম লিখুন:");
    bot.once('message', async (msg) => {
      const newName = msg.text;
      await updateUser(userId, "name", newName);
      bot.sendMessage(userId, "✅ নাম আপডেট হয়েছে।");
    });
  }

  if (text === "🔑 Change Password") {
    bot.sendMessage(userId, "🔐 নতুন পাসওয়ার্ড দিন:");
    bot.once('message', async (msg) => {
      const newPass = msg.text;
      await updateUser(userId, "password", newPass);
      bot.sendMessage(userId, "✅ পাসওয়ার্ড আপডেট হয়েছে।");
    });
  }

  if (text === "🗑️ Delete Account") {
    await deleteUser(userId);
    bot.sendMessage(userId, "🗑️ একাউন্ট ডিলিট হয়েছে।");
    return bot.sendMessage(userId, "🔁 মেনু আপডেট হচ্ছে...", {
      reply_markup: {
        keyboard: menu(null),
        resize_keyboard: true
      }
    });
  }

  if (text === "🚫 Deactivate Account") {
    await setStatus(userId, "deactivated");
    bot.sendMessage(userId, "🚫 একাউন্ট নিষ্ক্রিয় করা হয়েছে।");
    return bot.sendMessage(userId, "🔁 মেনু আপডেট হচ্ছে...", {
      reply_markup: {
        keyboard: menu("deactivated"),
        resize_keyboard: true
      }
    });
  }

  if (text === "♻️ Reactivate Account") {
    await setStatus(userId, "active");
    bot.sendMessage(userId, "✅ একাউন্ট পুনরায় চালু হয়েছে।");
    return bot.sendMessage(userId, "🔁 মেনু আপডেট হচ্ছে...", {
      reply_markup: {
        keyboard: menu("active"),
        resize_keyboard: true
      }
    });
  }

  if (text === "🔙 Back to Menu") {
    const status = await getUserStatus(userId);
    return bot.sendMessage(userId, "🔁 মেনু আপডেট হচ্ছে...", {
      reply_markup: {
        keyboard: menu(status),
        resize_keyboard: true
      }
    });
  }
});
