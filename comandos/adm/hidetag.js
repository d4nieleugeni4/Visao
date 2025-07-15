const config = require('../../config/config');

module.exports = {
  name: "hidetag",
  description: "Marca todos ocultamente",
  aliases: ["tag"],
  adminOnly: true,
  async execute(sock, from, msg, args) {
    try {
      const groupMetadata = await sock.groupMetadata(from);
      const participants = groupMetadata.participants.map(p => p.id);
      const message = args.join(" ") || config.messages.defaultTagMessage;

      // Verifica se é administrador
      const isAdmin = groupMetadata.participants.find(
        p => p.id === (msg.key.participant || msg.key.remoteJid)
      )?.admin === "admin";

      if (!isAdmin) {
        await sock.sendMessage(from, { 
          text: config.messages.ownerOnly 
        });
        
        // Reação de aviso para não-admin
        await sock.sendMessage(from, {
          react: {
            text: config.reactions.warning,
            key: msg.key
          }
        });
        return;
      }

      if (msg.message.conversation.startsWith(`${config.bot.prefix}hidetag`)) {
        await sock.sendMessage(from, {
          text: message,
          mentions: participants,
          ephemeralMessage: {
            parameters: {
              expireAfter: 86400
            }
          }
        });
      } else {
        await sock.sendMessage(from, {
          text: `@everyone\n${message}`,
          mentions: participants
        });
      }

      // Reação de sucesso
      await sock.sendMessage(from, {
        react: {
          text: config.reactions.success,
          key: msg.key
        }
      });
      
    } catch (error) {
      console.error(error);
      await sock.sendMessage(from, { text: config.messages.error });
      
      // Reação de erro
      await sock.sendMessage(from, {
        react: {
          text: config.reactions.error,
          key: msg.key
        }
      });
    }
  }
};
