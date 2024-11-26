export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 6) return formatDateFull(timestamp);
  // if (days > 0) return `${days} giorni fa`;
  if (hours > 0) return `${hours} ore fa`;
  if (minutes > 0) return `${minutes} minuti fa`;
  return 'pochi secondi fa';
}; 

export const formatDateFull = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-GB', {
    day: '2-digit',
  month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');
};