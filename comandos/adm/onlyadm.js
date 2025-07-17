const { isGroupAdmin } = require('../../utils/permissions');
const config = require('../../config/config');

module.exports = {
  name: "onlyadm",
  description: "Restringe o grupo para apenas administradores enviarem mensagens",
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

      // Atualiza as configurações do grupo
      await sock.groupSettingUpdate(
        from,
        'announcement' // Modo 'announcement' = apenas admins podem enviar mensagens
      );

      // Confirmação
      await sock.sendMessage(from, {
        text: "🔒 Grupo restrito! Agora apenas administradores podem enviar mensagens.",
        mentions: members
      });

      await sock.sendMessage(from, {
        react: {
          text: "✅",
          key: msg.key
        }
      });

    } catch (error) {
      console.error('Erro no onlyadm:', error);
      await sock.sendMessage(from, { 
        text: "❌ Erro ao restringir o grupo!",
        mentions: [msg.key.participant || msg.key.remoteJid]
      });
      
      await sock.sendMessage(from, {
        react: {
          text: "❌",
          key: msg.key
        }
      });
    }
  }
};
