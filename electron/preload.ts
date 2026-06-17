import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getSystemInfo: () => ipcRenderer.invoke('system:get-info'),
  createProfile: (profileData: any) => ipcRenderer.invoke('db:create-profile', profileData),
  getActiveProfile: () => ipcRenderer.invoke('db:get-active-profile'),
  aiChat: (message: string, history: any[]) => ipcRenderer.invoke('ai:chat', message, history),
});
