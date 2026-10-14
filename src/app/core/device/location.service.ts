import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';

import { AppError } from '../errors/app-error';

/** Leitura única de GPS em primeiro plano. Sem watch/tracking contínuo. */
export interface DeviceLocation {
  latitude: number;
  longitude: number;
  /** Raio de precisão em metros informado pelo dispositivo. */
  accuracy: number;
  /** Momento da leitura (relógio do dispositivo). */
  readAt: string;
}

/**
 * Regras D10/IMP-020:
 * - Só chamar DEPOIS do consentimento explícito na UI.
 * - Negar/falhar NÃO bloqueia o registro: a observação segue sem coordenadas (nunca inventar).
 * - Coordenadas ficam só em observation_private_locations; nunca no feed nem no VLM.
 */
@Injectable({ providedIn: 'root' })
export class LocationService {
  async getCurrent(): Promise<DeviceLocation> {
    await this.ensurePermission();
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20_000,
        maximumAge: 0,
      });
      const { latitude, longitude, accuracy } = position.coords;
      if (!isValidCoordinate(latitude, longitude) || !(accuracy >= 0)) {
        throw new AppError('location_unavailable', 'O dispositivo retornou uma localização inválida.');
      }
      return { latitude, longitude, accuracy, readAt: new Date(position.timestamp).toISOString() };
    } catch (error) {
      throw mapLocationError(error);
    }
  }

  private async ensurePermission(): Promise<void> {
    // No navegador o próprio browser pergunta; requestPermissions não existe na web.
    if (!Capacitor.isNativePlatform()) return;
    try {
      let status = await Geolocation.checkPermissions();
      if (status.location !== 'granted' && status.coarseLocation !== 'granted') {
        status = await Geolocation.requestPermissions({ permissions: ['location', 'coarseLocation'] });
      }
      if (status.location !== 'granted' && status.coarseLocation !== 'granted') {
        throw new AppError('location_permission_denied', 'Permissão de localização negada.');
      }
    } catch (error) {
      throw mapLocationError(error);
    }
  }
}

function isValidCoordinate(latitude: number, longitude: number): boolean {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
}

function mapLocationError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  const code = (error as { code?: string | number } | null)?.code;
  // Códigos do plugin (OS-PLUG-GLOC-*) e do navegador (GeolocationPositionError 1/2/3).
  if (code === 'OS-PLUG-GLOC-0003' || code === 1) {
    return new AppError(
      'location_permission_denied',
      'Permissão de localização negada. Você pode salvar o registro sem localização.',
      error,
    );
  }
  if (code === 'OS-PLUG-GLOC-0007' || code === 'OS-PLUG-GLOC-0009' || code === 'OS-PLUG-GLOC-0017') {
    return new AppError('location_disabled', 'Localização do aparelho desligada. Ative o GPS e tente de novo.', error);
  }
  if (code === 'OS-PLUG-GLOC-0010' || code === 3) {
    return new AppError(
      'location_timeout',
      'Não foi possível obter a localização a tempo. Tente de novo ao ar livre.',
      error,
    );
  }
  return new AppError('location_unavailable', 'Localização indisponível no momento. Tente novamente.', error);
}
