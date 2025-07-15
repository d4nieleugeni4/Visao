const config = require('../../config/config');
const { isAdminOrOwner } = require('../../utils/permissions');

module.exports = {
  name: "hidetag",
  description: "Marca todos ocultamente (apenas admins)",
  category: "admin",
  async execute(sock, from, msg, args) {
    try {
      // Verifica se é um grupo
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { 
          text: "⚠️ Este comando só funciona em grupos!",
          mentions: [msg.key.participant || msg.key.remoteJid]
        });
        await this.sendReaction(sock, from, msg, config.reactions.error);
        return;
      }

      const groupMetadata = await sock.groupMetadata(from);
      const participant = msg.key.participant || msg.key.remoteJid;

      // Verifica permissão usando o utils
      if (!isAdminOrOwner(groupMetadata, participant)) {
        await sock.sendMessage(from, { 
          text: "🚫 Apenas administradores podem usar este comando!",
          mentions: [participant]
        });
        await this.sendReaction(sock, from, msg, config.reactions.error);
        return;
      }

      const participants = groupMetadata.participants.map(p => p.id);
      const message = args.join(" ") || config.messages.defaultTagMessage;

      await sock.sendMessage(from, {
        text: message,
        mentions: participants,
        ephemeralMessage: {
          parameters: {
            expireAfter: 86400 // 24 horas
          }
        }
      });

      await this.sendReaction(sock, from, msg, config.reactions.success);

    } catch (error) {
      console.error("Erro no hidetag:", error);
      await sock.sendMessage(from, { 
        text: "❌ Ocorreu um erro ao executar o comando",
        mentions: [msg.key.participant || msg.key.remoteJid]
      });
      await this.sendReaction(sock, from, msg, config.reactions.error);
    }
  },

  // Helper para enviar reações
  async sendReaction(sock, from, msg, reaction) {
    try {
      await sock.sendMessage(from, {
        react: {
          text: reaction,
          key: msg.key
        }
      });
    } catch (e) {
      console.error("Erro ao enviar reação:", e);
    }
  }
};
