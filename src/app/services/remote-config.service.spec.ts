import { TestBed } from '@angular/core/testing';
import { RemoteConfig } from '@angular/fire/remote-config';
import { RemoteConfigService } from './remote-config.service';

describe('RemoteConfigService', () => {
  let service: RemoteConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: RemoteConfig, useValue: {} }
      ]
    });
    service = TestBed.inject(RemoteConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
