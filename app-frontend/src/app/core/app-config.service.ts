import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private cfg: any = {};

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async load(): Promise<void> {
    if (isPlatformServer(this.platformId)) {
      this.cfg = { apiUrl: 'http://72.60.52.112:3000/api' };
      return;
    }

    try {
      const res = await fetch('assets/config.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo cargar config.json');
      this.cfg = await res.json();
      console.log('[AppConfig] Cargado:', this.cfg);
    } catch (e) {
      console.error('[AppConfig] Error cargando config.json:', e);
      this.cfg = { apiUrl: 'http://localhost:3000/api' }; // fallback local
    }
  }

  get apiUrl(): string { return this.cfg?.apiUrl; }
  get(key: string) { return this.cfg?.[key]; }
}
