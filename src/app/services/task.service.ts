import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//Services
import { StorageService } from './storage.service';
//Models
import { Task } from '../models/task.model';
@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private TASKS_KEY = 'tasks';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private storage: StorageService) {
    this.loadTasks();
  }

  /** Carga inicial de tareas desde storage */
  private async loadTasks(): Promise<void> {
    try {
      const tasks = await this.storage.get<Task[]>(this.TASKS_KEY) || [];
      this.tasksSubject.next(tasks);
    } catch (err) {
      console.error('Error cargando tareas:', err);
      this.tasksSubject.next([]);
    }
  }

  /** Agrega una nueva tarea */
  async addTask(title: string): Promise<Task> {
    const newTask: Task = {
      id: this.generateId(),
      title,
      completed: false,
      createdAt: new Date()
    };

    const tasks = this.tasksSubject.value;
    const updated = [...tasks, newTask];

    await this.updateStorage(updated);
    return newTask;
  }

  /** Activa/desactiva estado completado */
  async toggleTask(id: string): Promise<void> {
    const tasks = this.tasksSubject.value;
    const updated = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );

    await this.updateStorage(updated);
  }

  /** Elimina una tarea por ID */
  async deleteTask(id: string): Promise<void> {
    const tasks = this.tasksSubject.value;
    const updated = tasks.filter(task => task.id !== id);

    await this.updateStorage(updated);
  }

  /** Obtiene el stream de tareas */
  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  /** Estadísticas: total y completadas */
  getTaskStats(): Observable<{ total: number; completed: number }> {
    return this.tasks$.pipe(
      map(tasks => ({
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length
      }))
    );
  }

  /** Persiste tareas y actualiza el BehaviorSubject */
  private async updateStorage(tasks: Task[]): Promise<void> {
    try {
      await this.storage.set(this.TASKS_KEY, tasks);
      this.tasksSubject.next(tasks);
    } catch (err) {
      console.error('Error guardando tareas:', err);
      throw err;
    }
  }
  
  /** Genera un ID único */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

}
