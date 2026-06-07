// Validation utilities

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/;
  return regex.test(username);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateDisplayName = (name) => {
  return name.length >= 2 && name.length <= 100;
};

export const validateBio = (bio) => {
  return bio.length <= 150;
};

export const validateImageSize = (file, maxSizeInMB = 5) => {
  const maxBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxBytes;
};

export const validateImageType = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};
