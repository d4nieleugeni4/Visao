module.exports = {
  // Informações básicas do bot
  bot: {
    name: "MeuBot",
    version: "1.0.0",
    emoji: "🤖",
    prefix: ".",
    imagePath: "./assets/images/bot-profile.jpg" // Caminho para a imagem de perfil

    reactions: {
    success: "✅", // Emoji de confirmação
    error: "❌",   // Emoji de erro
    warning: "⚠️"  // Emoji de aviso
  }
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
    defaultTagMessage: "📢 Mensagem importante!",
    ownerOnly: "⚠️ Apenas administradores podem usar este comando!",
    error: "❌ Ocorreu um erro ao executar o comando!"
  }
};
