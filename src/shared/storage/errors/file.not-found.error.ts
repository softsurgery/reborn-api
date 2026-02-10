export class FileNotFoundException extends Error {
  constructor(error: Error) {
    super('File not found : ' + error.message);
  }
}
