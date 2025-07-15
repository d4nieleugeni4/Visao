const config = require('../../config/config');

module.exports = {
  name: "hidetag",
  description: "Marca todos ocultamente (apenas admins)",
  adminOnly: true,
  async execute(sock, from, msg, args) {
    try {
      // Verifica se é um grupo
      if (!from.endsWith('@g.us')) {
        await sock.sendMessage(from, { 
          text: "⚠️ Este comando só funciona em grupos!",
          mentions: [msg.key.participant || msg.key.remoteJid]
        });
        await sock.sendMessage(from, {
          react: {
            text: config.reactions.error,
            key: msg.key
          }
        });
        return;
      }

      const groupMetadata = await sock.groupMetadata(from);
      const participant = msg.key.participant || msg.key.remoteJid;
      const botNumber = `${config.numbers.bot}@s.whatsapp.net`;
      
      // Verificação hierárquica
      const userStatus = getParticipantStatus(groupMetadata, participant);
      const botStatus = getParticipantStatus(groupMetadata, botNumber);

      // Se o bot não for admin
      if (botStatus !== 'admin') {
        await sock.sendMessage(from, { 
          text: "❌ Eu preciso ser administrador para isso!",
          mentions: [participant]
        });
        return;
      }

      // Se usuário não for admin/dono
      if (userStatus !== 'admin' && userStatus !== 'superadmin') {
        await sock.sendMessage(from, { 
          text: "🚫 Apenas administradores podem usar este comando!",
          mentions: [participant]
        });
        await sock.sendMessage(from, {
          react: {
            text: config.reactions.error,
            key: msg.key
          }
        });
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

      // Reação de sucesso
      await sock.sendMessage(from, {
        react: {
          text: config.reactions.success,
          key: msg.key
        }
      });

    } catch (error) {
      console.error("Erro no hidetag:", error);
      await sock.sendMessage(from, { 
        text: "❌ Ocorreu um erro ao executar o comando",
        mentions: [msg.key.participant || msg.key.remoteJid]
      });
      await sock.sendMessage(from, {
        react: {
          text: config.reactions.error,
          key: msg.key
        }
      });
    }
  }
};

// Função para verificar status do participante
function getParticipantStatus(groupMetadata, participantId) {
  const participant = groupMetadata.participants.find(
    p => p.id === participantId
  );
  return participant?.admin || 'member';
}
