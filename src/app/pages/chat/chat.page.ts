import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ViewChild, ElementRef } from '@angular/core';
import { Injectable } from '@angular/core';
import { supabase } from 'src/supabase';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit, OnDestroy {

  messages: any[] = [];
  newMessage: string = '';
  userId: string | null = null;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;


  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userId = user.uid;
      this.chatService.getMessages((msgs) => {
        this.messages = msgs;
      });
    } else {
      this.showToast('No hay usuario autenticado');
    }
  }

  ngOnDestroy() {
    // (Opcional) Limpiar recursos, canales, etc.
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;

    try {
      await this.chatService.sendMessage(this.userId!, this.newMessage.trim(), 'text');
      this.newMessage = '';
    } catch (error: any) {
      this.showToast(error.message);
    }
  }

  async logout() {
    await this.authService.logout();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
  }
  // Metodo para enviar fotos
    async sendPhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 70,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt
      });

      const base64 = image.dataUrl!;
      const fileName = `photo.jpg`;

      const imageUrl = await this.chatService.uploadImage(base64, fileName);

      await this.chatService.sendMessage(this.userId!, imageUrl, 'image');
    } catch (err: any) {
      this.showToast('No se pudo abrir la cámara o galería.');
      console.error(err);
    }
  }


  // Método para subir archivos genéricos (PDF, Word, ZIP, etc.)
  selectFile() {
  // Simula un clic en el input invisible
  this.fileInput.nativeElement.click();
}

async handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const fileUrl = await this.chatService.uploadFile(file);
    await this.chatService.sendMessage(this.userId!, fileUrl, 'file');
  } catch (err: any) {
    this.showToast('Error al subir archivo');
    console.error(err);
  }
}





}

