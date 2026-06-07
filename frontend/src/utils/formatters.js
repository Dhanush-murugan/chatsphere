// Formatting utilities

export const formatTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};

export const formatDate = (date) => {
  if (!date) return '';
  
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateStr = formatDate(date);
  const timeStr = new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${dateStr} ${timeStr}`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatUsername = (name) => {
  return '@' + (name || '').toLowerCase().replace(/\s+/g, '');
};

export const truncateText = (text, maxLength = 50) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const highlightMentions = (text) => {
  return text.replace(/@(\w+)/g, '<a href="/profile/$1" class="text-blue-500">@$1</a>');
};
