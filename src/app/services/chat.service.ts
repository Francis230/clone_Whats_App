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
  async sendMessage(userId: string, content: string, type: string = 'text') {
    const { error } = await this.supabase.from('messages').insert({
      user_id: userId,
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

    const { error } = await this.supabase.storage
        .from('chat-media')
        .upload(filePath, base64Data, {
        contentType: 'image/jpeg',
        upsert: true
        });

    if (error) throw error;

    // Obtener la URL pública
    const { data } = this.supabase.storage.from('chat-media').getPublicUrl(filePath);
    return data.publicUrl;
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
