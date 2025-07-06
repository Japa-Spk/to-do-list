import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//Services
import { StorageService } from './storage.service';
//Models
import { Category } from '../models/category.model';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private CATEGORIES_KEY = 'categories';
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor(private storage: StorageService) {
    this.loadCategories();
  }
  /** Carga inicial de categorías desde storage */
  private async loadCategories(): Promise<void> {
    try {
      const categories = await this.storage.get<Category[]>(this.CATEGORIES_KEY) || [];
      this.categoriesSubject.next(categories);
    } catch (err) {
      console.error('Error cargando categorías:', err);
      this.categoriesSubject.next([]);
    }
  }

  /** Agrega una nueva categoría */
  async addCategory(name: string, color: string): Promise<Category> {
    const newCategory: Category = {
      id: this.generateId(),
      name,
      color,
      createdAt: new Date()
    };

    const categories = this.categoriesSubject.value;
    const updated = [...categories, newCategory];

    await this.updateStorage(updated);
    return newCategory;
  }

  /** Actualiza una categoría */
  async updateCategory(id: string, name: string, color: string): Promise<void> {
    const categories = this.categoriesSubject.value;
    const updated = categories.map(category =>
      category.id === id ? { ...category, name, color } : category
    );

    await this.updateStorage(updated);
  }

  /** Elimina una categoría por ID */
  async deleteCategory(id: string): Promise<void> {
    const categories = this.categoriesSubject.value;
    const updated = categories.filter(category => category.id !== id);

    await this.updateStorage(updated);
  }

  /** Obtiene el stream de categorias */
  getCategories(): Observable<Category[]> {
    return this.categoriesSubject.asObservable();
  }

  /** Persiste categorias y actualiza el BehaviorSubject */
  private async updateStorage(categories: Category[]): Promise<void> {
    try {
      await this.storage.set(this.CATEGORIES_KEY, categories);
      this.categoriesSubject.next(categories);
    } catch (err) {
      console.error('Error actualizando categorías:', err);
    }
  }

  /** Genera un ID único para la categoría */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

}
