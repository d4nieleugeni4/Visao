const path = require("path");
const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const readline = require("readline");
const pino = require("pino");
const { handleCommands } = require("./handleCommands");
const { participantsUpdate } = require("./participantsUpdate");
const config = require("/config/config");

const question = (string) => {
  const rl = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout 
  });
  return new Promise((resolve) => rl.question(string, (ans) => {
    rl.close();
    resolve(ans);
  }));
};

exports.connect = async () => {
  console.log(`⚡ Iniciando ${config.bot.name} ${config.bot.version}...`);

  const { state, saveCreds } = await useMultiFileAuthState(
    path.resolve(__dirname, "assets", "auth", "creds")
  );

  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    printQRInTerminal: true,
    version,
    logger: pino({ level: "silent" }),
    auth: state,
    browser: config.whatsapp.browser,
    markOnlineOnConnect: config.whatsapp.markOnlineOnConnect,
    getMessage: async (key) => {
      return {
        conversation: `${config.bot.name} ${config.bot.version}`
      };
    }
  });

  if (!sock.authState.creds.registered) {
    let phoneNumber = await question("Informe o número do bot (com DDI e DDD): ");
    phoneNumber = phoneNumber.replace(/[^0-9]/g, "");

    if (!phoneNumber) {
      throw new Error("Número inválido!");
    }

    const code = await sock.requestPairingCode(phoneNumber);
    console.log(`🔑 Código de pareamento: ${code}`);
  }

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("🔌 Conexão encerrada:", lastDisconnect.error);
      
      if (shouldReconnect) {
        console.log("⚡ Tentando reconectar...");
        setTimeout(() => this.connect(), 5000);
      }
    } else if (connection === "open") {
      console.log(`✅ ${config.bot.name} conectado com sucesso!`);
      console.log(`🆔 Número: ${config.numbers.bot}`);
      console.log(`👑 Dono: ${config.numbers.owner}`);
    }
  });

  sock.ev.on("creds.update", saveCreds);

  handleCommands(sock);
  participantsUpdate(sock);
  return sock;
};

this.connect().catch(err => {
  console.error("❌ Erro ao iniciar o bot:", err);
  process.exit(1);
});
