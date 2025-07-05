import { Component, OnInit } from '@angular/core';
//Modules
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
//Ionic
import { IonBackButton, IonHeader, IonFooter, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonFabButton, IonModal, IonLabel, IonItem, IonFab, IonButtons, IonInput, IonGrid, IonRow, IonCol, IonCard, IonCardContent } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { trashOutline, add, createOutline } from 'ionicons/icons';
//Components
import { LoadingComponent } from 'src/app/components/loading/loading.component';
//Models
import { Category } from 'src/app/models/category.model';
//Services
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  imports: [IonCol, IonRow,
    CommonModule, ReactiveFormsModule,
    LoadingComponent,
    IonBackButton, IonHeader, IonFooter, IonToolbar, IonTitle, IonContent, IonIcon, IonButton, IonButtons, IonFab, IonFabButton, IonModal, IonLabel, IonItem, IonInput, IonGrid, IonRow, IonCard, IonCardContent
  ],
})
export class CategoriesComponent implements OnInit {

  defaultColors = [
    "#3B82F6", // blue
    "#10B981", // green
    "#F59E0B", // orange
    "#EF4444", // red
    "#8B5CF6", // purple
    "#6B7280", // gray
    "#EC4899", // pink
    "#14B8A6", // teal
  ]

  defaultCategory: Category = { id: "default", name: "Sin categoria", color: "#6B7280", createdAt: new Date() };

  categories: Category[] = [];
  categoryForm!: FormGroup;
  editingCategory = false;
  editingCategoryId: string | null = null;

  isModalOpen = false;
  loading = true;

  constructor(private categoryService: CategoryService, private formBuilder: FormBuilder) {
    this.categoryForm = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(1)]],
      color: ["#ffffff", [Validators.required]]
    });
    addIcons({
      trashOutline, add, createOutline
    });
  }

  ngOnInit() {
    this.categoryService.categories$.subscribe(categories => {
      console.log('Categories updated:', categories);
      //Categoria por defecto
      this.categories = [this.defaultCategory ,...categories];
      this.loading = false;
    });
  }



  openModal() {
    this.isModalOpen = true
  }

  closeModal() {
    this.isModalOpen = false
    this.editingCategoryId = null
    this.editingCategory = false
    this.categoryForm.reset()
  }

  selectColor(color: string) {
    console.log('Selected color:', color);
    this.categoryForm.patchValue({ color: color });
  }

  addCategory() {
    if (this.categoryForm.valid) {
      const { name, color } = this.categoryForm.value
      this.categoryService.addCategory(name, color)
      this.closeModal()
    }
  }

  editCategory(category: Category) {
    if (category) {
      this.categoryForm.patchValue({
        name: category.name,
        color: category.color
      });
      this.editingCategoryId = category.id;
      this.editingCategory = true;
      this.isModalOpen = true;
    }
  }

  updateCategory() {
    if (this.categoryForm.valid && this.editingCategoryId) {
      const { name, color } = this.categoryForm.value
      this.categoryService.updateCategory(this.editingCategoryId, name, color)
      this.closeModal()
    }
  }

  deleteCategory(id: string) {
    this.categoryService.deleteCategory(id)
  }


}
