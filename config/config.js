module.exports = {
  // Informações básicas do bot
  bot: {
    name: "VISAO",
    version: "1.0.0",
    emoji: "🤖",
    prefix: ".",
    imagePath: "./assets/images/bot-profile.jpg"
  },

  // Números importantes
  numbers: {
    owner: "5524981321901", // Número do dono com DDI e DDD
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
  },

  hidetag: {
    defaultMessage: "🔔", // Mensagem padrão quando não for especificada
    notificationEmoji: "📢", // Emoji que será adicionado à mensagem
    reactionEmoji: "📣" // Emoji que reagirá à mensagem do comando
  }
};
