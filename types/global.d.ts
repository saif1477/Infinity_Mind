export {};

declare global {
  interface Window {
    electronAPI: {
      getSystemInfo: () => Promise<any>;
      createProfile: (profileData: any) => Promise<any>;
      getActiveProfile: () => Promise<any>;
      aiChat: (message: string, history: any[]) => Promise<string>;
    };
  }
}
