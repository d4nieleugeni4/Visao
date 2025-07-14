const config = require('../../config/config');

module.exports = {
  name: "ping",
  description: "Responde com pong!",
  emoji: "🏓",
  execute: async (sock, from) => {
    await sock.sendMessage(from, { 
      text: `${config.bot.emoji} *${config.bot.name}* ${config.bot.emoji}\n\n` +
            `🏓 *Pong!*\n` +
            `⚡ Versão: ${config.bot.version}`
    });
  }
};
