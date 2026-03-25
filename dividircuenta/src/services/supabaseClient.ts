import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const supabaseUrl = 'https://xlfybpbzavtkdbwhmiez.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZnlicGJ6YXZ0a2Rid2htaWV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTg5MzcsImV4cCI6MjA4OTk3NDkzN30.eepZOY6aQEx5QYnXB3UdN66T6o33o-_mcj54u5anex0'   // ← pega aquí tu anon key correcta

const ExpoSecureStoreAdapter = {
    getItem:    (key: string) => SecureStore.getItemAsync(key),
    setItem:    (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage:           ExpoSecureStoreAdapter,
        autoRefreshToken:  true,
        persistSession:    true,
        detectSessionInUrl: false,
    },
})