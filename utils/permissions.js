// Funções independentes (não usa this)
function getParticipantStatus(groupMetadata, participantId) {
  const participant = groupMetadata.participants.find(
    p => p.id === participantId
  );
  return participant?.admin || 'member';
}

function isAdminOrOwner(groupMetadata, participantId) {
  const status = getParticipantStatus(groupMetadata, participantId);
  return status === 'admin' || status === 'superadmin';
}

module.exports = {
  getParticipantStatus,
  isAdminOrOwner
};
