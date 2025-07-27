export class MigrationChecksumValidationException extends Error {
  constructor(message: string) {
    super(`Checksum mismatch for  '${message}`);
  }
}
