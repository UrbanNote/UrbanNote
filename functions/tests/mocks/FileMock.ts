export class FileMock {
  private readonly fileName: string;

  constructor(nameFile: string) {
    this.fileName = nameFile;
  }

  getFileName(): string {
    return this.fileName;
  }
}
