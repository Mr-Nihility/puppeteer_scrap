import { access, mkdir, writeFile } from 'fs/promises';
import path from 'path';

export class FileManager {
  DOWNLOAD_PATH = path.resolve('./download');
  constructor() {
    access(this.DOWNLOAD_PATH)
      .then(() => {
        console.log(`Directory ${this.DOWNLOAD_PATH} already exists.`);
      })
      .catch(async () => {
        try {
          await mkdir(this.DOWNLOAD_PATH, { recursive: true });
          console.log(`Directory ${this.DOWNLOAD_PATH} created successfully.`);
        } catch (error) {
          console.error('Error creating directory:', error);
        }
      });
  }

  async createFile(fileName: string, data: any) {
    try {
      await writeFile(`${this.DOWNLOAD_PATH}/${fileName}`, data);
      console.log('File created successfully.');
    } catch (error) {
      console.error('Error creating file:', error);
    }
  }
}
