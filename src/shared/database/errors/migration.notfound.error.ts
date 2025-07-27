export class MigrationNotFoundException extends Error {
  constructor() {
    super('Migration not found');
  }
}
