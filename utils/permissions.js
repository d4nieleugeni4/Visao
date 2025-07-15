module.exports = {
  /**
   * Verifica o nível de permissão do usuário
   * @param {Object} groupMetadata - Metadados do grupo
   * @param {String} participantId - ID do participante
   * @returns {String} - 'member', 'admin' ou 'superadmin'
   */
  getParticipantStatus: (groupMetadata, participantId) => {
    const participant = groupMetadata.participants.find(
      p => p.id === participantId
    );
    return participant?.admin || 'member';
  },

  /**
   * Verifica se o usuário tem permissão para executar comandos de admin
   * @param {Object} groupMetadata - Metadados do grupo
   * @param {String} participantId - ID do participante
   * @returns {Boolean} - True se for admin ou dono
   */
  isAdminOrOwner: (groupMetadata, participantId) => {
    const status = this.getParticipantStatus(groupMetadata, participantId);
    return status === 'admin' || status === 'superadmin';
  }
};
