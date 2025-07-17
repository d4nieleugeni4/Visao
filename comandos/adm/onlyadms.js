const { isGroupAdmin } = require('../../utils/permissions');
const config = require('../../config/config');

module.exports = {
  name: "onlyadms",
  description: "Ativa/desativa o modo apenas administradores",
  category: "admin",
  usage: "<on/off>",
  async execute(sock, msg, from, args) {
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

      // Obtém ação (on/off)
      const action = args[0]?.toLowerCase();
      const groupMetadata = await sock.groupMetadata(from);
      const members = groupMetadata.participants.map(p => p.id);

      if (action === 'on') {
        // Ativa modo apenas admins
        await sock.groupSettingUpdate(from, 'announcement');
        
        await sock.sendMessage(from, {
          text: "🔒 *MODO APENAS ADMS ATIVADO!*\nAgora só administradores podem enviar mensagens.",
          mentions: members
        });
        
      } else if (action === 'off') {
        // Desativa modo apenas admins
        await sock.groupSettingUpdate(from, 'not_announcement');
        
        await sock.sendMessage(from, {
          text: "🔓 *MODO APENAS ADMS DESATIVADO!*\nTodos os membros podem enviar mensagens novamente.",
          mentions: members
        });
        
      } else {
        // Mostra ajuda se não especificar on/off
        await sock.sendMessage(from, {
          text: `❌ Uso incorreto!\nExemplos:\n• *${config.bot.prefix}onlyadms on* - Ativa modo apenas admins\n• *${config.bot.prefix}onlyadms off* - Desativa modo apenas admins`
        });
        return;
      }

      // Confirmação visual
      await sock.sendMessage(from, {
        react: {
          text: action === 'on' ? '🔒' : '🔓',
          key: msg.key
        }
      });

    } catch (error) {
      console.error('Erro no onlyadms:', error);
      await sock.sendMessage(from, { 
        text: "❌ Erro ao alterar configurações do grupo!",
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
