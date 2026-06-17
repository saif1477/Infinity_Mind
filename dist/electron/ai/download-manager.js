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
exports.DownloadManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const https = __importStar(require("https"));
const electron_1 = require("electron");
class DownloadManager {
    static modelsDir = path.join(electron_1.app.getPath('userData'), 'models');
    static {
        if (!fs.existsSync(this.modelsDir)) {
            fs.mkdirSync(this.modelsDir, { recursive: true });
        }
    }
    static getModelPath(filename) {
        return path.join(this.modelsDir, filename);
    }
    static async download(repo, file, onProgress) {
        const dest = this.getModelPath(file);
        if (fs.existsSync(dest))
            return dest;
        const url = `https://huggingface.co/${repo}/resolve/main/${file}`;
        return new Promise((resolve, reject) => {
            const fileStream = fs.createWriteStream(dest + '.tmp');
            const request = (reqUrl) => {
                https.get(reqUrl, (response) => {
                    if (response.statusCode === 302 && response.headers.location) {
                        request(response.headers.location);
                    }
                    else if (response.statusCode !== 200) {
                        reject(new Error(`Failed to download: ${response.statusCode}`));
                    }
                    else {
                        const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
                        let downloadedBytes = 0;
                        response.on('data', (chunk) => {
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
                        response.on('error', (err) => {
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
exports.DownloadManager = DownloadManager;
