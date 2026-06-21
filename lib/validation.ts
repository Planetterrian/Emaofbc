import { ValidationError } from './errors';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function validateEmail(email: string): void {
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new ValidationError('Invalid email format');
  }
  if (email.length > 255) {
    throw new ValidationError('Email is too long (max 255 characters)');
  }
}

export function validatePassword(password: string): void {
  if (!password) {
    throw new ValidationError('Password is required');
  }
  if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters');
  }
  if (password.length > 128) {
    throw new ValidationError('Password is too long (max 128 characters)');
  }
}

export function validateUUID(id: string): void {
  if (!id || !UUID_REGEX.test(id)) {
    throw new ValidationError('Invalid ID format');
  }
}

export function validateString(
  value: unknown,
  fieldName: string,
  options?: { min?: number; max?: number }
): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${fieldName} must be a string`);
  }

  if (!value.trim()) {
    throw new ValidationError(`${fieldName} cannot be empty`);
  }

  const trimmed = value.trim();

  if (options?.min && trimmed.length < options.min) {
    throw new ValidationError(
      `${fieldName} must be at least ${options.min} characters`
    );
  }

  if (options?.max && trimmed.length > options.max) {
    throw new ValidationError(
      `${fieldName} must not exceed ${options.max} characters`
    );
  }

  return trimmed;
}

export function validateEmail_Safe(value: unknown): string {
  const email = validateString(value, 'Email', { max: 255 });
  validateEmail(email);
  return email;
}

export function validateRequired<T>(
  value: T | null | undefined,
  fieldName: string
): T {
  if (value === null || value === undefined) {
    throw new ValidationError(`${fieldName} is required`);
  }
  return value;
}

export function validateNumber(
  value: unknown,
  fieldName: string,
  options?: { min?: number; max?: number }
): number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${fieldName} must be a number`);
  }

  if (options?.min !== undefined && value < options.min) {
    throw new ValidationError(`${fieldName} must be at least ${options.min}`);
  }

  if (options?.max !== undefined && value > options.max) {
    throw new ValidationError(`${fieldName} must not exceed ${options.max}`);
  }

  return value;
}

export function validateEnum<T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[]
): T {
  if (!allowedValues.includes(value as T)) {
    throw new ValidationError(
      `${fieldName} must be one of: ${allowedValues.join(', ')}`
    );
  }
  return value as T;
}

export function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters but allow common text
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}
