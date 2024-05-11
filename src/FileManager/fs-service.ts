import { access, mkdir, writeFile } from 'fs/promises';
import { createWriteStream } from 'node:fs';
import https from 'node:https';
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

  public async downLoadPdf(path: string) {
    https.get(path, (res) => {
      const splittedPath = path.split('/');
      const fileName = splittedPath[splittedPath.length - 1];
      const stream = createWriteStream(`${this.DOWNLOAD_PATH}/${fileName}`);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
      });
    });
  }
}
