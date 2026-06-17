"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentProcessor = void 0;
const fs = __importStar(require("fs"));
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const officeparser = require('officeparser');
class DocumentProcessor {
    static async extractText(filePath, fileType) {
        if (!fs.existsSync(filePath))
            throw new Error(`File not found: ${filePath}`);
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
                    officeparser.parseOffice(filePath, ((data, err) => {
                        if (err)
                            reject(err);
                        else
                            resolve({ text: data });
                    }));
                });
            }
            if (filePath.toLowerCase().endsWith('.txt') || filePath.toLowerCase().endsWith('.md')) {
                return { text: fs.readFileSync(filePath, 'utf-8') };
            }
            throw new Error(`Unsupported file type: ${fileType}`);
        }
        catch (error) {
            console.error('Error extracting text:', error);
            throw error;
        }
    }
    static cleanText(text) {
        return text.replace(/\u0000/g, '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
    }
}
exports.DocumentProcessor = DocumentProcessor;
