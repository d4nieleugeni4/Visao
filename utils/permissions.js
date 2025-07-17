module.exports = {
  /**
   * Verifica o status do participante no grupo
   * @param {Object} groupMetadata - Metadados do grupo
   * @param {String} participantId - ID do participante
   * @returns {String} - 'member', 'admin' ou 'owner'
   */
  getParticipantRole: (groupMetadata, participantId) => {
    const participant = groupMetadata.participants.find(p => p.id === participantId);
    if (!participant) return 'member';
    return participant.admin || 'member';
  },

  /**
   * Verifica se o usuário é admin ou dono do grupo
   * @param {Object} sock - Instância do socket
   * @param {Object} msg - Objeto da mensagem
   * @returns {Promise<Boolean>}
   */
  isGroupAdmin: async (sock, msg) => {
    try {
      const from = msg.key.remoteJid;
      if (!from.endsWith('@g.us')) return false;
      
      const groupMetadata = await sock.groupMetadata(from);
      const participant = msg.key.participant || msg.key.remoteJid;
      const role = module.exports.getParticipantRole(groupMetadata, participant);
      
      return role === 'admin' || role === 'owner';
    } catch (error) {
      console.error('Erro ao verificar admin:', error);
      return false;
    }
  }
};
