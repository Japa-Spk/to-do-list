import { Injectable } from '@angular/core';
import { from, Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteConfig } from '@angular/fire/remote-config';
import { fetchAndActivate, getBoolean } from 'firebase/remote-config';

@Injectable({
  providedIn: 'root'
})
export class RemoteConfigService {

  constructor(
    private remoteConfig: RemoteConfig
  ) {

  }

  async load(): Promise<void> {
    try {
      await firstValueFrom(from(fetchAndActivate(this.remoteConfig)));
      console.log('Remote Config activado');
    } catch (err) {
      console.error('Error al activar Remote Config', err);
    }
  }

  fetchRemoteConfig() {
    return from(fetchAndActivate(this.remoteConfig));
  }

  getFeatureFlag(flagName: string): Observable<boolean> {
    return from(this.fetchRemoteConfig()).pipe(
      map(() => getBoolean(this.remoteConfig, flagName))
    );
  }

  async getFeatureFlagValue(flagName: string): Promise<boolean> {
    await this.fetchRemoteConfig();
    return getBoolean(this.remoteConfig, flagName);
  }


}
