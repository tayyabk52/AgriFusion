export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return phone.length === 10 && /^\d+$/.test(phone);
};

export const validatePassword = (password: string): {
  valid: boolean;
  errors: string[]
} => {
  const errors: string[] = [];

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  return { valid: errors.length === 0, errors };
};
