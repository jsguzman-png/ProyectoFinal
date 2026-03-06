import { createContext, useContext, useState } from "react";

type User = {
    id?: string;
    nombre: string;
    email: string;
} | null;

type AuthContextType = {
    user: User;
    login: (email: string, password: string) => boolean;
    register: (nombre: string, email: string, password: string) => boolean;
    logout: () => void;
};

// 1. Definir el contexto
const AuthContext = createContext<AuthContextType | null>(null);

// 2. Hook personalizado
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
    return context;
};

// 3. Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);

    const login = (email: string, password: string) => {
        if (!email || !password) return false;
        
        const nombre = email.split('@')[0]; // Simulación de nombre a partir del email
        setUser({ nombre , email });
        return true;
    };

    const register = (nombre: string, email: string, password: string) => {
        if (!nombre || !email || !password) return false;
       
        setUser({ nombre, email });
        return true;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};