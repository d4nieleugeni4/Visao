module.exports = {
  // Informações básicas do bot
  bot: {
    name: "VISAO"
    version: "1.0.0",
    emoji: "🤖",
    prefix: ".",
    imagePath: "./assets/images/bot-profile.jpg", // Caminho para a imagem de perfil
  },

  // Números importantes
  numbers: {
    owner: "5524981321901", // Número do dono com DDI e DDD
    bot: "5511963546094",   // Número do bot com DDI e DDD
  },

  // Configurações do WhatsApp
  whatsapp: {
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    markOnlineOnConnect: true,
  },

  // Mensagens padrão
  messages: {
    welcome: "Olá! Bem-vindo ao bot! 🤖",
    error: "❌ Ocorreu um erro!",
    ownerOnly: "⚠️ Este comando é apenas para o dono!",
  }
};
