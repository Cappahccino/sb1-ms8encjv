import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function uploadFile(file: File) {
  const fileName = `${Date.now()}-${file.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('files')
    .upload(fileName, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: fileData, error: insertError } = await supabase
    .from('files')
    .insert({
      name: file.name,
      path: uploadData.path,
      mime_type: file.type,
      size: file.size,
      created_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (insertError) {
    throw insertError;
  }

  return fileData;
}

export async function getFiles() {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getFileContent(path: string) {
  const { data, error } = await supabase.storage
    .from('files')
    .download(path);

  if (error) {
    throw error;
  }

  return data;
}