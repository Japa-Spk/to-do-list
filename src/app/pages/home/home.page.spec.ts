import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HomePage } from './home.page';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';
//Services
import { TaskService } from 'src/app/services/task.service';
import { CategoryService } from 'src/app/services/category.service';
//Model
import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  let taskServiceSpy: jasmine.SpyObj<TaskService>;
  let formBuilder: FormBuilder;

  // Subjects para controlar los observables
  let tasksSubject: BehaviorSubject<Task[]>;
  let statsSubject: BehaviorSubject<{ completed: number; total: number }>;

  let categoriesSubject: BehaviorSubject<Category[]>;
  // Fecha fija para consistencia en las pruebas
  const fixedDate = new Date(2025, 6, 5, 10, 7, 3);

  beforeEach(async () => {
    // 1. Crear Subjects controlables
    tasksSubject = new BehaviorSubject<Task[]>([]);
    statsSubject = new BehaviorSubject<{ completed: number; total: number }>({ completed: 0, total: 0 });
    //Spy TaskService
    const spy = jasmine.createSpyObj('TaskService', [
      'addTask',
      'toggleTask',
      'deleteTask',
      'getTaskStats'
    ], {
      tasks$: tasksSubject.asObservable()
    });
    categoriesSubject = new BehaviorSubject<Category[]>([]);
    //Spy CategoryService
    const spyC = jasmine.createSpyObj('CategoryService', [
      'getCategories',
      'getCategoryById',
      'categories$'
    ], {
      categories$: tasksSubject.asObservable()
    });

    spy.getTaskStats.and.returnValue(of({ completed: 0, total: 0 }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HomePage],
      providers: [
        { provide: TaskService, useValue: spy },
        { provide: CategoryService, useValue: spyC },
        FormBuilder
      ]
    }).compileComponents();

    taskServiceSpy = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    formBuilder = TestBed.inject(FormBuilder);

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize taskForm with validators', () => {
    // Verificar que el formulario tiene validación requerida y minLength
    const titleControl = component.taskForm.get('title');
    expect(titleControl).toBeTruthy();
    // Verificar validadores
    expect(titleControl?.hasValidator(Validators.required)).toBeTrue();
    // Probar estado inicial
    expect(titleControl?.value).toBe('');
    expect(component.taskForm.valid).toBeFalse();
    // Probar con valor válido
    titleControl?.setValue('Valid task');
    expect(titleControl?.valid).toBeTrue();
    // Probar con valor inválido (vacío)
    titleControl?.setValue('');
    expect(titleControl?.hasError('required')).toBeTrue();
    // Probar con valor valido
    titleControl?.setValue('   ');
    expect(titleControl?.hasError('minlength')).toBeFalse();
  });

  it('should subscribe to tasks$ on ngOnInit', fakeAsync(() => {
    // Comprobar que se suscribe al observable de tareas
    //Crear datos mock
    const mockTasks: Task[] = [
      { id: '1', title: 'Task 1', completed: false, createdAt: fixedDate, categoryId: 'default' },
      { id: '2', title: 'Task 2', completed: false, createdAt: fixedDate, categoryId: 'default' }
    ];
    //Emitir nuevos datos
    tasksSubject.next(mockTasks);
    tick(); // Procesar operaciones asíncronas
    //Verificar resultados
    expect(component.tasks).toEqual(mockTasks);
    expect(component.tasks.length).toBe(2);
    //Verificar cada tarea individualmente
    expect(component.tasks[0]).toEqual(jasmine.objectContaining({
      id: '1',
      title: 'Task 1',
      completed: false
    }));
    expect(component.tasks[1]).toEqual(jasmine.objectContaining({
      id: '2',
      title: 'Task 2',
      completed: false
    }));
    // Verificar que el loading se actualizó correctamente
    expect(component.loading).toBeFalse();
  }));


  it('should subscribe to task stats on ngOnInit', fakeAsync(() => {
    // Verificar que se suscribe a las estadísticas
    // Configurar mock para getTaskStats
    const statsSubject = new BehaviorSubject({ completed: 0, total: 0 });
    taskServiceSpy.getTaskStats.and.returnValue(statsSubject.asObservable());
    // Llamar ngOnInit
    component.ngOnInit();
    // Emitir valores
    statsSubject.next({ completed: 3, total: 5 });
    tick();
    // Verificar que se actualizan los contadores
    expect(component.completedCount).toBe(3);
    expect(component.totalCount).toBe(5);
    // Verificar cálculo de porcentaje
    expect(component.progressPercentage).toBe(60);
    // Probar con 0 tareas
    statsSubject.next({ completed: 0, total: 0 });
    tick();
    expect(component.completedCount).toBe(0);
    expect(component.totalCount).toBe(0);
    expect(component.progressPercentage).toBe(0);
  }));

});
