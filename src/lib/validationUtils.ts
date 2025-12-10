export const validateEmail = (email: string): boolean => {
  // Robust email validation regex:
  // - Local part: letters, numbers, and common special chars (. _ % -)
  // - Domain: letters, numbers, dots, and hyphens
  // - TLD: minimum 2 letters (blocks single-char TLDs like .c)
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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

export const validateSpecialization = (specialization: string): {
  valid: boolean;
  error?: string;
} => {
  const trimmed = specialization.trim();

  // Check if empty
  if (!trimmed) {
    return { valid: false, error: 'Specialization cannot be empty' };
  }

  // Check minimum length (at least 2 characters)
  if (trimmed.length < 2) {
    return { valid: false, error: 'Specialization must be at least 2 characters' };
  }

  // Check maximum length (max 50 characters)
  if (trimmed.length > 50) {
    return { valid: false, error: 'Specialization must be less than 50 characters' };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  // This allows: "Crop Management", "Agro-Forestry", "Farmer's Market"
  // Blocks: "Crop123", "Soil@Health", emojis, etc.
  const validPattern = /^[A-Za-z\s\-']+$/;
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      error: 'Specialization can only contain letters, spaces, hyphens, and apostrophes'
    };
  }

  // Check for excessive consecutive spaces or hyphens
  if (/\s{2,}/.test(trimmed) || /-{2,}/.test(trimmed)) {
    return { valid: false, error: 'Avoid multiple consecutive spaces or hyphens' };
  }

  // Check that it starts and ends with a letter
  if (!/^[A-Za-z].*[A-Za-z]$|^[A-Za-z]$/.test(trimmed)) {
    return { valid: false, error: 'Specialization must start and end with a letter' };
  }

  return { valid: true };
};

export const validateFullName = (name: string): {
  valid: boolean;
  error?: string;
} => {
  const trimmed = name.trim();

  // Check if empty
  if (!trimmed) {
    return { valid: false, error: 'Full name is required' };
  }

  // Check minimum length (at least 2 characters)
  if (trimmed.length < 2) {
    return { valid: false, error: 'Full name must be at least 2 characters' };
  }

  // Check maximum length (max 100 characters)
  if (trimmed.length > 100) {
    return { valid: false, error: 'Full name must be less than 100 characters' };
  }

  // Only allow letters, spaces, hyphens, and apostrophes
  // Allows: "John Doe", "Mary-Jane O'Brien", "José García"
  // Blocks: "John123", "Jane@Doe", emojis, numbers
  const validPattern = /^[A-Za-zÀ-ÿ\s\-'\.]+$/;
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      error: 'Name can only contain letters, spaces, hyphens, apostrophes, and periods'
    };
  }

  // Check for excessive consecutive spaces or hyphens
  if (/\s{2,}/.test(trimmed) || /-{2,}/.test(trimmed)) {
    return { valid: false, error: 'Avoid multiple consecutive spaces or hyphens' };
  }

  // Check that it starts and ends with a letter
  if (!/^[A-Za-zÀ-ÿ].*[A-Za-zÀ-ÿ\.]$|^[A-Za-zÀ-ÿ]$/.test(trimmed)) {
    return { valid: false, error: 'Name must start and end with a letter' };
  }

  return { valid: true };
};

export const validateQualification = (qualification: string): {
  valid: boolean;
  error?: string;
} => {
  const trimmed = qualification.trim();

  // Check if empty
  if (!trimmed) {
    return { valid: false, error: 'Qualification is required' };
  }

  // Check minimum length (at least 2 characters)
  if (trimmed.length < 2) {
    return { valid: false, error: 'Qualification must be at least 2 characters' };
  }

  // Check maximum length (max 100 characters)
  if (trimmed.length > 100) {
    return { valid: false, error: 'Qualification must be less than 100 characters' };
  }

  // Allow letters, numbers, spaces, hyphens, apostrophes, periods, and parentheses
  // Allows: "MSc Agriculture", "B.Sc. (Hons)", "Ph.D.", "MBA 2020"
  const validPattern = /^[A-Za-zÀ-ÿ0-9\s\-'\.(),]+$/;
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      error: 'Qualification contains invalid characters'
    };
  }

  // Check for excessive consecutive spaces
  if (/\s{2,}/.test(trimmed)) {
    return { valid: false, error: 'Avoid multiple consecutive spaces' };
  }

  return { valid: true };
};
