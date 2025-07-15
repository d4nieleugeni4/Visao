const config = require('../../config/config');

module.exports = {
  name: "hidetag",
  description: "Marca todos ocultamente",
  aliases: ["tag"], // Permite usar tanto .hidetag quanto .tag
  adminOnly: true,
  async execute(sock, from, msg, args) {
    try {
      const groupMetadata = await sock.groupMetadata(from);
      const participants = groupMetadata.participants.map(p => p.id);
      const message = args.join(" ") || config.messages.defaultTagMessage;

      // Verifica se é administrador
      const isAdmin = groupMetadata.participants.find(
        p => p.id === msg.key.participant || p.id === msg.key.remoteJid
      )?.admin === "admin";

      if (!isAdmin) {
        return sock.sendMessage(from, { text: config.messages.ownerOnly });
      }

      // Envia a marcação oculta ou visível
      if (msg.message.conversation.startsWith(`${config.bot.prefix}hidetag`)) {
        await sock.sendMessage(from, {
          text: message,
          mentions: participants,
          ephemeralMessage: {
            parameters: {
              expireAfter: 86400 // 24 horas
            }
          }
        });
      } else {
        await sock.sendMessage(from, {
          text: `@everyone\n${message}`,
          mentions: participants
        });
      }
    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: config.messages.error });
    }
  }
};
