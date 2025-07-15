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
    const args = text.slice(config.bot.prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Comandos normais
    if (command === pingCommand.name) {
      await pingCommand.execute(sock, from);
    } 
    // Comandos de admin
    else if (command === hidetagCommand.name || command === 'tag') {
      await hidetagCommand.execute(sock, from, m, args);
    }

    if (command === pingCommand.name) {
      await pingCommand.execute(sock, from, m); // Passa o objeto da mensagem
    } 
    else if (command === hidetagCommand.name || command === 'tag') {
       await hidetagCommand.execute(sock, from, m, args);
   }
    
  });
};
