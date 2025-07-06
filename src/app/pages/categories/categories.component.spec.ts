import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BehaviorSubject } from 'rxjs';

import { CategoriesComponent } from './categories.component';
//Services
import { CategoryService } from 'src/app/services/category.service';
//Model
import { Category } from 'src/app/models/category.model';

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  // Subjects para controlar los observables
  let categoriesSubject: BehaviorSubject<Category[]>;

  beforeEach(waitForAsync(() => {
    categoriesSubject = new BehaviorSubject<Category[]>([]);
    //spy CategoryService
    const spy = jasmine.createSpyObj('CategoryService', [
      'getCategories',
      'getCategoryById',
      'categories$'
    ], {
      categories$: categoriesSubject.asObservable()
    });

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), CategoriesComponent]
      , providers: [
        { provide: CategoryService, useValue: spy }
      ]
    }).compileComponents();

    categoryServiceSpy = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
