import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, Subject, BehaviorSubject, Observable } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
//Modules
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
//Ionic
import { IonHeader, IonFooter, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonProgressBar, IonFabButton, IonModal, IonLabel, IonItem, IonFab, IonButtons, IonInput, IonSelect, IonSelectOption, IonChip } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipseOutline, checkmarkCircle, trashOutline, add, close, settingsOutline } from 'ionicons/icons';
//Components
import { TaskCardComponent } from 'src/app/components/task-card/task-card.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
//Models
import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';
//Services
import { TaskService } from 'src/app/services/task.service';
import { CategoryService } from 'src/app/services/category.service';
import { RemoteConfigService } from 'src/app/services/remote-config.service';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    TaskCardComponent, LoadingComponent,
    IonHeader, IonFooter, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonFab, IonFabButton, IonProgressBar, IonModal, IonLabel, IonItem, IonInput, IonSelect, IonSelectOption, IonChip
  ],
})
export class HomePage implements OnInit, OnDestroy {

  tasks: Task[] = []

  completedCount = 0;
  totalCount = 0;

  taskForm!: FormGroup

  isModalOpen = false
  loading = true

  // Categories
  categories: Category[] = []
  selectedCategoryFilter$ = new BehaviorSubject("all");
  categoriesEnabled = false;

  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private remoteConfigService: RemoteConfigService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.taskForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(1)]],
      categoryId: ["default"]
    })
    addIcons({
      ellipseOutline, checkmarkCircle, trashOutline, add, close, settingsOutline
    });
  }

  async ngOnInit() {
    await this.remoteConfigService.load();
    this.categoriesEnabled = await this.remoteConfigService.getFeatureFlagValue('enable_categories');
    console.log('Categories enabled:', this.categoriesEnabled);
    // Carga tareas, estadísticas y categorías
    combineLatest([
      this.taskService.tasks$,
      this.taskService.getTaskStats(),
      this.categoryService.categories$,
      this.selectedCategoryFilter$
    ]).pipe(
      takeUntil(this.destroy$),
      map(([tasks, stats, categories, filter]) => {
        // Filtrar tareas por categoría seleccionada
        console.log('Selected category filter:', filter);
        if (filter !== "all") {
          tasks = tasks.filter(task => task.categoryId === filter);
        }
        return {tasks, stats, categories};
      })
    )
      .subscribe(({tasks, stats, categories}) => {
        this.tasks = tasks;
        this.completedCount = stats.completed;
        this.totalCount = stats.total;
        this.categories = categories;
        this.loading = false;
        console.log('Data loaded:', { tasks, stats, categories });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  get progressPercentage(): number {
    return this.totalCount > 0 ? Math.round((this.completedCount / this.totalCount) * 100) : 0
  }

  openModal() {
    this.isModalOpen = true
  }

  closeModal() {
    this.isModalOpen = false
    this.taskForm.reset()
  }

  addTask() {
    if (this.taskForm.valid) {
      const { title, categoryId } = this.taskForm.value
      this.taskService.addTask(title, categoryId)
      this.closeModal()
    }
  }

  toggleTask(id: string) {
    this.taskService.toggleTask(id)
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id)
  }

  getCategory(categoryId: string): Category {
    const category = this.categories.find(c => c.id === categoryId);
    if (!category) {
      return { id: 'default', name: 'Sin categoria', color: '#6B7280', createdAt: new Date() };
    }
    return category
  }

  selectCategoryFilter(categoryId: string) {
    this.selectedCategoryFilter$.next(categoryId);
  }
  
  getTaskCountByCategory(categoryId: string): Observable<number> {
    return this.taskService.tasks$.pipe(
      map(tasks => tasks.filter(task => task.categoryId === categoryId).length)
    );
  }

  goToCategories() {
    this.router.navigate(["/categories"])
  }
}
