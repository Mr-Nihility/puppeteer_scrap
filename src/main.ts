import { createWriteStream } from 'node:fs';
import https from 'node:https';
import { CatalogueService } from './CatalogueService/catalogue-service';
import { FileManager } from './FileManager/fs-service';
import { getFileNameWithTimestamp, parseUrl } from './utils/helpers';
class Entry {
  readonly TARGET_URL = 'https://www.tus.si/#s2';

  constructor(
    private fm: FileManager,
    private catalogService: CatalogueService,
  ) {
    this.start();
  }

  private start = async () => {
    const catalogueList = await this.catalogService.fetchProductsCatalogs(
      this.TARGET_URL,
    );

    await this.fm.createFile(
      `${getFileNameWithTimestamp()}${parseUrl(this.TARGET_URL)}.json`,
      JSON.stringify(catalogueList),
    );

    for (let i = 0; i < catalogueList.length; i++) {
      await this.downLoadPdf(catalogueList[i].url);
    }
  };

  private async downLoadPdf(path: string) {
    https.get(path, (res) => {
      const splittedPath = path.split('/');
      const fileName = splittedPath[splittedPath.length - 1];
      const stream = createWriteStream(`download/${fileName}`);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
      });
    });
  }
}

new Entry(new FileManager(), new CatalogueService());
