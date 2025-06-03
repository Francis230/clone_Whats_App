import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
//   uploadFile(file: File) {
//     throw new Error('Method not implemented.');
//   }
  private supabase: SupabaseClient;

  constructor() {
    // Inicializar cliente Supabase
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  // Obtener mensajes en tiempo real
  getMessages(callback: (messages: any[]) => void) {
    // Escuchar cambios en tiempo real en la tabla 'messages'
    this.supabase
      .channel('chat-room')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
        this.fetchMessages().then(callback); // Volver a cargar todos los mensajes
      })
      .subscribe();

    // Cargar los mensajes iniciales
    this.fetchMessages().then(callback);
  }

  // Insertar un nuevo mensaje
  async sendMessage(userId: string, content: string, type: string = 'text', userEmail?: string, userPhoto?: string) {
    const { error } = await this.supabase.from('messages').insert({
      user_id: userId,
      user_email: userEmail,
      user_photo: userPhoto,
      content,
      type,
      timestamp: new Date()
    });
    if (error) throw error;
  }

  // Cargar todos los mensajes ordenados por fecha
  async fetchMessages() {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: true });
    if (error) throw error;
    return data;
  }

  // Subir archivo de imagen a Supabase Storage
    async uploadImage(base64Data: string, fileName: string): Promise<string> {
    const filePath = `images/${Date.now()}_${fileName}`;

    // Convertir base64 a Blob
    const blob = this.base64ToBlob(base64Data);

    const { error } = await this.supabase.storage
      .from('chat-media')
      .upload(filePath, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) throw error;

    const { data } = this.supabase.storage.from('chat-media').getPublicUrl(filePath);
    return data.publicUrl;
  }

  base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([intArray], { type: 'image/jpeg' });
  }

    // Subir archivo a Supabase Storage
    async uploadFile(file: File): Promise<string> {
    const path = `files/${Date.now()}_${file.name}`;

    const { error } = await this.supabase.storage
        .from('chat-media')
        .upload(path, file, {
        contentType: file.type,
        upsert: true
        });

    if (error) throw error;

    const { data } = this.supabase.storage.from('chat-media').getPublicUrl(path);
    return data.publicUrl;
    }


}
