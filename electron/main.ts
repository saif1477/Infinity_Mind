import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    // titleBarStyle: 'hidden', // Add custom frame later if needed
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../out/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

import { DBClient } from './database/client';

// Simple IPC setup for scaffolding
ipcMain.handle('system:get-info', () => {
  return {
    platform: process.platform,
    arch: process.arch,
    version: app.getVersion()
  };
});

ipcMain.handle('db:create-profile', async (event, profileData) => {
  const db = DBClient.getInstance();
  // Deactivate all other profiles
  db.prepare('UPDATE profiles SET is_active = 0').run();
  
  const stmt = db.prepare(`
    INSERT INTO profiles (display_name, education_level, degree, study_goals, subjects, is_active)
    VALUES (@name, @education, @degree, @goal, @subjects, 1)
  `);
  
  const info = stmt.run({
    name: profileData.name,
    education: profileData.education,
    degree: profileData.degree,
    goal: profileData.goal,
    subjects: profileData.subjects
  });
  
  return info.lastInsertRowid;
});

ipcMain.handle('db:get-active-profile', async () => {
  const db = DBClient.getInstance();
  const profile = db.prepare('SELECT * FROM profiles WHERE is_active = 1 LIMIT 1').get();
  return profile || null;
});

ipcMain.handle('ai:chat', async (event, message, history) => {
  // Temporary mock implementation until the local LLM is hooked up
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate latency
  return `This is a mock AI response to: "${message}". I see you have ${history.length} previous messages. The local Gemma engine will be connected here soon!`;
});
