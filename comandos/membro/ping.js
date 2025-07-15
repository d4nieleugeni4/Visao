const config = require('../../config/config');

module.exports = {
  name: "ping",
  description: "Responde com pong!",
  emoji: "🏓",
  execute: async (sock, from, msg) => {
    try {
      await sock.sendMessage(from, { 
        text: `${config.bot.emoji} *${config.bot.name}* ${config.bot.emoji}\n\n` +
              `🏓 *Pong!*\n` +
              `⚡ Versão: ${config.bot.version}`
      });
      
      // Adiciona reação de sucesso
      await sock.sendMessage(from, {
        react: {
          text: config.reactions.success,
          key: msg.key
        }
      });
    } catch (error) {
      console.error(error);
      // Adiciona reação de erro
      await sock.sendMessage(from, {
        react: {
          text: config.reactions.error,
          key: msg.key
        }
      });
    }
  }
};
