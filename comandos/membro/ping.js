module.exports = {
  name: "ping",
  description: "Responde com pong!",
  execute: async (sock, from) => {
    await sock.sendMessage(from, { text: "pong!" });
  }
};
