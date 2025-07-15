const pingCommand = require('./comandos/membro/ping');
const hidetagCommand = require('./comandos/adm/hidetag');
const config = require('./config/config');

module.exports.handleCommands = (sock) => {
  sock.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages[0];
    if (!m?.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const messageType = Object.keys(m.message)[0];
    const text = m.message.conversation || m.message[messageType]?.text || "";
    
    if (!text.startsWith(config.bot.prefix)) return;

    const args = text.slice(config.bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    try {
      if (command === pingCommand.name) {
        await pingCommand.execute(sock, from, m);
      } 
      else if (command === hidetagCommand.name || command === 'tag') {
        await hidetagCommand.execute(sock, from, m, args);
      }
    } catch (error) {
      console.error("Erro ao executar comando:", error);
      // Reação de erro genérico
      await sock.sendMessage(from, {
        react: {
          text: config.reactions.error,
          key: m.key
        }
      });
    }
  });
};
