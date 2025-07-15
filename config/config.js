module.exports = {
  // Informações básicas do bot
  bot: {
    name: "MeuBot",
    version: "1.0.0",
    emoji: "🤖",
    prefix: ".",
    imagePath: "./assets/images/bot-profile.jpg"
  },

  // Números importantes
  numbers: {
    owner: "5511999999999", // Número do dono com DDI e DDD
    bot: "5511888888888"    // Número do bot com DDI e DDD
  },

  // Configurações do WhatsApp
  whatsapp: {
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    markOnlineOnConnect: true
  },

  // Mensagens padrão
  messages: {
    welcome: "Olá! Bem-vindo ao bot! 🤖",
    error: "❌ Ocorreu um erro!",
    ownerOnly: "⚠️ Este comando é apenas para o dono!",
    defaultTagMessage: "📢 Mensagem importante!"
  },

  // Reações de emoji
  reactions: {
    success: "✅",
    error: "❌",
    warning: "⚠️"
  }
};
