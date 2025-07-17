const { isGroupAdmin } = require('../../utils/permissions');
const config = require('../../config/config');

module.exports = {
  name: "hidetag",
  description: "Marca todos os membros do grupo (apenas admins)",
  category: "admin",
  async execute(sock, msg, from) {
    try {
      // Verifica se é grupo
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { 
          text: "🚫 Este comando só funciona em grupos!",
          mentions: [msg.key.participant || msg.key.remoteJid]
        });
        return;
      }

      // Verifica permissão
      const isAdmin = await isGroupAdmin(sock, msg);
      if (!isAdmin) {
        await sock.sendMessage(from, { 
          text: "❌ Apenas administradores podem usar este comando!",
          mentions: [msg.key.participant || msg.key.remoteJid]
        });
        return;
      }

      // Obtém membros e mensagem
      const groupMetadata = await sock.groupMetadata(from);
      const members = groupMetadata.participants.map(p => p.id);
      
      const messageType = Object.keys(msg.message)[0];
      const text = msg.message.conversation || msg.message[messageType]?.text || "";
      const args = text.split(' ').slice(1);
      const customMessage = args.join(' ');
      
      // Monta a mensagem final com emoji de notificação
      const finalMessage = customMessage 
        ? `${config.hidetag.notificationEmoji} ${customMessage}`
        : config.hidetag.defaultMessage;

      // Envia a marcação
      await sock.sendMessage(from, {
        text: finalMessage,
        mentions: members,
        ephemeralMessage: {
          parameters: {
            expireAfter: 86400 // 24 horas
          }
        }
      });

      // Adiciona reação de destaque à mensagem original do comando
      await sock.sendMessage(from, {
        react: {
          text: config.hidetag.reactionEmoji,
          key: msg.key
        }
      });

    } catch (error) {
      console.error('Erro no hidetag:', error);
      await sock.sendMessage(from, { 
        text: "❌ Erro ao marcar membros!",
        mentions: [msg.key.participant || msg.key.remoteJid]
      });
      
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
