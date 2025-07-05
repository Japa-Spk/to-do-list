import { TestBed } from '@angular/core/testing';
import { Storage } from '@ionic/storage-angular';
import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskService,
        // 3. Provee los mocks necesarios
        { provide: Storage },
      ]
    });
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
