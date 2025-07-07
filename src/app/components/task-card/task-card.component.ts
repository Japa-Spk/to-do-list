import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
//Ionic
import { IonCard, IonCardContent, IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { ellipseOutline, trashOutline, checkmarkCircle } from 'ionicons/icons';
//Model
import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';
@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  imports: [
    IonCard, IonCardContent, IonButton, IonIcon
  ]
})
export class TaskCardComponent implements OnInit {
  @Input() task: Task = { id: '', title: '', categoryId: 'default', completed: false, createdAt: new Date() };
  @Input() category: Category = { id: 'default', name: 'Sin categoria', color: '#6B7280', createdAt: new Date() };
  @Input() featureCategory = false;

  @Output() toggle = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  constructor() {
    addIcons({
      ellipseOutline, trashOutline, checkmarkCircle
    });
  }

  ngOnInit() { }

  toggleTask(id: string) {
    this.toggle.emit(id);
  }

  deleteTask(id: string) {
    this.delete.emit(id);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

}
