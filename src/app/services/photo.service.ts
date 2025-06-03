import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  async capturePhoto(): Promise<string> {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera, // Fuerza el uso de la cámara directamente
      quality: 70
    });

    return photo.dataUrl!;
  }
}
