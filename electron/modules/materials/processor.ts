import * as fs from 'fs';
import * as path from 'path';
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const officeparser = require('officeparser');

export class DocumentProcessor {
  public static async extractText(filePath: string, fileType: string): Promise<{ text: string; pageCount?: number }> {
    if (!fs.existsSync(filePath)) throw new Error(`File not found: ${filePath}`);

    try {
      if (fileType === 'application/pdf' || filePath.toLowerCase().endsWith('.pdf')) {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return { text: data.text, pageCount: data.numpages };
      } 
      if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || filePath.toLowerCase().endsWith('.docx')) {
        const result = await mammoth.extractRawText({ path: filePath });
        return { text: result.value };
      }
      if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || filePath.toLowerCase().endsWith('.pptx')) {
        return new Promise((resolve, reject) => {
          officeparser.parseOffice(filePath, ((data: string, err: any) => {
            if (err) reject(err);
            else resolve({ text: data });
          }) as any);
        });
      }
      if (filePath.toLowerCase().endsWith('.txt') || filePath.toLowerCase().endsWith('.md')) {
        return { text: fs.readFileSync(filePath, 'utf-8') };
      }
      throw new Error(`Unsupported file type: ${fileType}`);
    } catch (error) {
      console.error('Error extracting text:', error);
      throw error;
    }
  }

  public static cleanText(text: string): string {
    return text.replace(/\u0000/g, '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
  }
}
