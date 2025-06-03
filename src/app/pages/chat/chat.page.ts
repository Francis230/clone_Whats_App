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
import { PhotoService } from 'src/app/services/photo.service'; // Ajusta la ruta si es necesario
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';





@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss']
})
export class ChatPage implements OnInit, OnDestroy {
  userName: string = '';
  userPhoto: string = '';
  messages: any[] = [];
  newMessage: string = '';
  userId: string | null = null;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;


  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private photoService: PhotoService, // <- nuevo
    private toastController: ToastController,
    private http: HttpClient

  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userId = user.uid;
      this.userName = user.email || 'Sin correo';
      const randomAvatarId = Math.floor(Math.random() * 70) + 1;
      this.userPhoto = user.photoURL || `https://i.pravatar.cc/150?img=${randomAvatarId}`;
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
      await this.chatService.sendMessage(this.userId!, this.newMessage.trim(), 'text', this.userName, this.userPhoto);
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

  // Metodo para enviar las fotos 
    async sendPhoto() {
    try {
      const base64 = await this.photoService.capturePhoto();
      const fileName = `photo_${Date.now()}.jpeg`;

      const imageUrl = await this.chatService.uploadImage(base64, fileName);
      await this.chatService.sendMessage(this.userId!, imageUrl, 'image', this.userName, this.userPhoto);
    } catch (err: any) {
      this.showToast('Error al capturar imagen.');
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
      await this.chatService.sendMessage(this.userId!, fileUrl, 'file', this.userName , this.userPhoto);
    } catch (err: any) {
      this.showToast('Error al subir archivo');
      console.error(err);
    }
  }

  // Metodo para la geolocalizacion
    async sendLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

      await this.chatService.sendMessage(this.userId!, mapUrl, 'location', this.userName, this.userPhoto);
    } catch (err) {
      this.showToast('Error al obtener ubicación GPS');
      console.error(err);
    }
  }
  // Método del consumo de una api que genera un texto
  async sendJoke() {
  try {
    const res: any = await this.http.get('https://official-joke-api.appspot.com/jokes/random').toPromise();
    const joke = `${res.setup} - ${res.punchline}`;
    await this.chatService.sendMessage(this.userId!, joke, 'text', this.userName , this.userPhoto);
  } catch (err) {
    this.showToast('Error al obtener chiste');
    console.error(err);
  }
}


}

