import { Component, OnInit } from '@angular/core';
//Modules
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
//Ionic
import { IonHeader, IonFooter, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonProgressBar, IonFabButton, IonModal, IonLabel, IonItem, IonFab, IonButtons, IonInput } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { ellipseOutline, checkmarkCircle, trashOutline, add, close } from 'ionicons/icons';
//Components
import { TaskCardComponent } from 'src/app/components/task-card/task-card.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
//Models
import { Task } from 'src/app/models/task.model';
//Services
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule,
    TaskCardComponent, LoadingComponent,
    IonHeader, IonFooter, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonFab, IonFabButton, IonProgressBar, IonModal, IonLabel, IonItem, IonInput
  ],
})
export class HomePage implements OnInit {

  tasks: Task[] = []

  completedCount = 0;
  totalCount = 0;

  taskForm!: FormGroup

  isModalOpen = false
  loading = true

  constructor(
    private taskService: TaskService,
    private formBuilder: FormBuilder,
  ) {
    this.taskForm = this.formBuilder.group({
      title: ["", [Validators.required, Validators.minLength(1)]]
    })
    addIcons({
      ellipseOutline, checkmarkCircle, trashOutline, add, close
    });
  }

  ngOnInit() {
    this.taskService.tasks$.subscribe(tasks => {
      console.log('Tasks updated:', tasks);
      this.tasks = tasks;
      this.loading = false;
    });
    this.taskService.getTaskStats().subscribe(stats => {
      this.completedCount = stats.completed;
      this.totalCount = stats.total;
      console.log('Task stats updated:', stats);
    })
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
      const { title } = this.taskForm.value
      this.taskService.addTask(title)
      this.closeModal()
    }
  }

  toggleTask(id: string) {
    this.taskService.toggleTask(id)
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id)
  }
}
