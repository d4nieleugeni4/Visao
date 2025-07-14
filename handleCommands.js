const pingCommand = require("./comandos/membro/ping.js");

module.exports.handleCommands = (sock) => {
  sock.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages[0];
    if (!m?.message || m.key.fromMe) return;

    const from = m.key.remoteJid;
    const messageType = Object.keys(m.message)[0];
    const text = m.message.conversation || m.message[messageType]?.text || "";

    if (text.startsWith(`.${pingCommand.name}`)) {
      await pingCommand.execute(sock, from);
    }
  });
};
