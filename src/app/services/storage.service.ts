import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private ready: Promise<Storage>;

  constructor(private storage: Storage) {
    this.ready = this.storage.create().catch(err => {
      console.error('Error inicializando Ionic Storage:', err);
      throw new Error('No se pudo inicializar el almacenamiento');
    });
  }

  private async ensureReady(): Promise<void> {
    await this.ready;
  }

  /** Guarda un valor genérico */
  async set<T>(key: string, value: T): Promise<void> {
    await this.ensureReady();
    try {
      await this.storage.set(key, value);
    } catch (err) {
      console.error(`Error guardando "${key}":`, err);
      throw new Error(`No se pudo guardar "${key}"`);
    }
  }

  /** Obtiene un valor o null si no existe */
  async get<T>(key: string): Promise<T | null> {
    await this.ensureReady();
    try {
      const data = await this.storage.get(key);
      return data as T | null;
    } catch (err) {
      console.error(`Error leyendo "${key}":`, err);
      throw new Error(`No se pudo leer "${key}"`);
    }
  }

  /** Elimina un valor por clave */
  async remove(key: string): Promise<void> {
    await this.ensureReady();
    try {
      await this.storage.remove(key);
    } catch (err) {
      console.error(`Error eliminando "${key}":`, err);
      throw new Error(`No se pudo eliminar "${key}"`);
    }
  }

  /** Limpia todo el storage */
  async clear(): Promise<void> {
    await this.ensureReady();
    try {
      await this.storage.clear();
    } catch (err) {
      console.error(`Error limpiando storage:`, err);
      throw new Error(`No se pudo limpiar el storage`);
    }
  }

}
