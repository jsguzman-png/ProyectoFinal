import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const supabaseUrl = 'https://icdldubtkhnicjvawxyt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZGxkdWJ0a2huaWNqdmF3eHl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNTM3MTIsImV4cCI6MjA4OTYyOTcxMn0.0ibQZZyeS2l3Es4CwuyO4s7QLEBtskHW0zxoXIarSnk'
// Adaptador para guardar la sesión
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