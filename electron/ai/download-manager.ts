import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { app } from 'electron';

export class DownloadManager {
  private static modelsDir = path.join(app.getPath('userData'), 'models');

  static {
    if (!fs.existsSync(this.modelsDir)) {
      fs.mkdirSync(this.modelsDir, { recursive: true });
    }
  }

  public static getModelPath(filename: string): string {
    return path.join(this.modelsDir, filename);
  }

  public static async download(repo: string, file: string, onProgress: (percent: number) => void): Promise<string> {
    const dest = this.getModelPath(file);
    if (fs.existsSync(dest)) return dest;

    const url = `https://huggingface.co/${repo}/resolve/main/${file}`;

    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(dest + '.tmp');
      const request = (reqUrl: string) => {
        https.get(reqUrl, (response) => {
          if (response.statusCode === 302 && response.headers.location) {
            request(response.headers.location);
          } else if (response.statusCode !== 200) {
            reject(new Error(`Failed to download: ${response.statusCode}`));
          } else {
            const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
            let downloadedBytes = 0;

            response.on('data', (chunk: Buffer) => {
              downloadedBytes += chunk.length;
              fileStream.write(chunk);
              if (totalBytes > 0) {
                onProgress((downloadedBytes / totalBytes) * 100);
              }
            });

            response.on('end', () => {
              fileStream.end();
              fs.renameSync(dest + '.tmp', dest);
              resolve(dest);
            });

            response.on('error', (err: any) => {
              fileStream.end();
              reject(err);
            });
          }
        }).on('error', reject);
      };
      request(url);
    });
  }
}
