import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { useralreadyloggedGuard } from './user-already-logged.guard';

describe('useralreadyloggedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => useralreadyloggedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
