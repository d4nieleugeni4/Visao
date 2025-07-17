const path = require('path');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const config = require('./config/config');

// Importação dos comandos
const pingCommand = require('./comandos/membro/ping');
const hidetagCommand = require('./comandos/adm/hidetag');
const onlyadmsCommand = require('./comandos/adm/onlyadms');

const WhatsAppBot = {
  async connect() {
    const { state, saveCreds } = await useMultiFileAuthState(
      path.resolve(__dirname, 'auth')
    );

    const sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }),
      browser: config.whatsapp.browser,
      markOnlineOnConnect: true,
      // Removido printQRInTerminal
    });

    // Configuração dos eventos
    this.setupEvents(sock, saveCreds);
    return sock;
  },

  setupEvents(sock, saveCreds) {
    // Evento de mensagens
    sock.ev.on('messages.upsert', async ({ messages }) => {
      try {
        const m = messages[0];
        if (!m?.message || m.key.fromMe) return;

        const from = m.key.remoteJid;
        const messageType = Object.keys(m.message)[0];
        const text = m.message.conversation || m.message[messageType]?.text || "";
        
        if (!text.startsWith(config.bot.prefix)) return;

        const args = text.slice(config.bot.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        switch (command) {
          case pingCommand.name:
            await pingCommand.execute(sock, from, m);
            break;
            
          case hidetagCommand.name:
            await hidetagCommand.execute(sock, m, from);
            break;
            
          case onlyadmsCommand.name:
            await onlyadmsCommand.execute(sock, m, from, args);
            break;
            
          default:
            await sock.sendMessage(from, {
              text: `❌ Comando desconhecido. Use ${config.bot.prefix}help para ver os comandos.`
            });
        }
      } catch (error) {
        console.error('Erro no handler de comandos:', error);
      }
    });

    // Evento de conexão
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect } = update;
      
      if (connection === 'open') {
        console.log(`✅ ${config.bot.name} conectado!`);
      }
      
      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
        console.log(`Conexão fechada. ${shouldReconnect ? 'Reconectando...' : 'Encerrando.'}`);
        if (shouldReconnect) setTimeout(() => WhatsAppBot.connect(), 5000);
      }
    });

    // Evento de credenciais
    sock.ev.on('creds.update', saveCreds);
  }
};

module.exports = WhatsAppBot;
