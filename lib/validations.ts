export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Email address is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address.';
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters.';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) return `${fieldName} is required.`;
  return null;
}

export function validateComplaintForm(data: {
  category: string;
  stationName: string;
  description: string;
}): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.category) errors.category = 'Please select a grievance category.';
  if (!data.stationName) errors.stationName = 'Station is required.';
  if (!data.description || data.description.trim().length < 15) {
    errors.description = 'Please describe your grievance in at least 15 characters.';
  }
  return errors;
}
