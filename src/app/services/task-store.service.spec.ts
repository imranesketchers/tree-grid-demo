import { TestBed } from '@angular/core/testing';

import { TaskStoreService } from './task-store.service';

describe('TaskStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TaskStoreService = TestBed.inject(TaskStoreService);
    expect(service).toBeTruthy();
  });
});
