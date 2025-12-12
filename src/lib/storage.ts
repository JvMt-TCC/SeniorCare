import { Preferences } from '@capacitor/preferences';

// Storage adapter compatível com Capacitor e Web
// Usa Preferences API do Capacitor para persistência em apps nativos

class CapacitorStorage {
  async getItem(key: string): Promise<string | null> {
    try {
      const { value } = await Preferences.get({ key });
      return value;
    } catch {
      // Fallback para localStorage em caso de erro
      return localStorage.getItem(key);
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await Preferences.set({ key, value });
    } catch {
      // Fallback para localStorage em caso de erro
      localStorage.setItem(key, value);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await Preferences.remove({ key });
    } catch {
      // Fallback para localStorage em caso de erro
      localStorage.removeItem(key);
    }
  }
}

// Adaptador síncrono que o Supabase espera
// Usa localStorage como cache síncrono mas sincroniza com Preferences em background
class SyncStorageAdapter {
  private asyncStorage = new CapacitorStorage();

  getItem(key: string): string | null {
    // Retorna do localStorage para resposta síncrona
    const value = localStorage.getItem(key);
    return value;
  }

  setItem(key: string, value: string): void {
    // Salva no localStorage para resposta síncrona
    localStorage.setItem(key, value);
    // Sincroniza com Preferences em background
    this.asyncStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    // Remove do localStorage para resposta síncrona
    localStorage.removeItem(key);
    // Sincroniza com Preferences em background
    this.asyncStorage.removeItem(key);
  }
}

// Inicialização: sincroniza dados do Preferences para localStorage
export async function initializeStorage(): Promise<void> {
  const keys = ['sb-alxuaxrykccielfsmyye-auth-token', 'rememberedUsername', 'rememberMe'];
  
  for (const key of keys) {
    try {
      const { value } = await Preferences.get({ key });
      if (value && !localStorage.getItem(key)) {
        localStorage.setItem(key, value);
      }
    } catch {
      // Ignora erros na inicialização
    }
  }
}

export const capacitorStorage = new CapacitorStorage();
export const syncStorage = new SyncStorageAdapter();
