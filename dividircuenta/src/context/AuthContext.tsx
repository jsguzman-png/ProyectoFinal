import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Alert } from "react-native";

type User = {
  id: string;
  nombre: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (nombre: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser]       = useState<User>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          nombre: session.user.user_metadata?.nombre ?? session.user.email!.split('@')[0],
          email: session.user.email!,
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setUser({
          id: session.user.id,
          nombre: session.user.user_metadata?.nombre ?? session.user.email!.split('@')[0],
          email: session.user.email!,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ 
        email: email.trim().toLowerCase(), 
        password 
    });
    if (error) { 
        console.error('Error login:', error.message);
        Alert.alert('Error', error.message); 
        return false; 
    }
    return true;
  };

  // Función de prueba de conexión
  const testConnection = async () => {
    try {
      console.log('🔗 Probando conexión a Supabase...');
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('❌ Error de conexión:', error);
        Alert.alert('Error de conexión', error.message);
        return false;
      }
      console.log('✅ Conexión exitosa. Sesión actual:', data.session ? 'Activa' : 'Ninguna');
      Alert.alert('Conexión OK', 'Supabase responde correctamente');
      return true;
    } catch (err) {
      console.error('💥 Error de red:', err);
      Alert.alert('Error de red', 'No se puede conectar a Supabase');
      return false;
    }
  };

  const register = async (nombre: string, email: string, password: string): Promise<boolean> => {
    Alert.alert('Debug 2', `Llamando a Supabase con: ${email}`); 
    
    const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { nombre } },
    });

    if (error) {
        console.error('Error registro:', error.message);
        Alert.alert('Error Supabase', error.message);
        return false;
    }

    Alert.alert('Éxito', 'Usuario registrado: ' + data.user?.email); 
    return true;
};
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};