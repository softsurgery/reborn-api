import * as bcrypt from 'bcrypt';

/**
 * Hashes a plain text password.
 * @param password - Plain text password.
 * @param saltRounds - Number of salt rounds. Defaults to 10.
 */
export async function hashPassword(
  password: string,
  saltRounds = 10,
): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain text password with a hashed password.
 * @param password - Plain text password.
 * @param hashedPassword - Previously hashed password.
 */
export async function comparePasswords(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
