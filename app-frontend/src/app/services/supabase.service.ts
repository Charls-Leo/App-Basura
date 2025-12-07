// src/app/services/supabase.service.ts
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environments';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Profile {
    id: string;
    email: string;
    nombre: string;
    rol: string;
}

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;
    private currentUser = new BehaviorSubject<User | null>(null);
    private currentProfile = new BehaviorSubject<Profile | null>(null);

    constructor() {
        this.supabase = createClient(
            environment.supabaseUrl,
            environment.supabaseAnonKey
        );

        // Escuchar cambios en el estado de autenticación
        this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔐 Auth state changed:', event);
            this.currentUser.next(session?.user ?? null);

            if (session?.user) {
                this.loadProfile(session.user.id);
            } else {
                this.currentProfile.next(null);
            }
        });

        // Cargar sesión existente al iniciar
        this.loadSession();
    }

    private async loadSession() {
        const { data: { session } } = await this.supabase.auth.getSession();
        if (session?.user) {
            this.currentUser.next(session.user);
            await this.loadProfile(session.user.id);
        }
    }

    private async loadProfile(userId: string) {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data && !error) {
            this.currentProfile.next(data as Profile);
        }
    }

    // === AUTENTICACIÓN ===

    async signUp(email: string, password: string, nombre: string, rol: string = 'usuario') {
        const { data, error } = await this.supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre,
                    rol
                }
            }
        });

        if (error) throw error;
        return data;
    }

    async signIn(email: string, password: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Cargar perfil después del login
        if (data.user) {
            await this.loadProfile(data.user.id);
        }

        return data;
    }

    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;

        this.currentUser.next(null);
        this.currentProfile.next(null);
    }

    async getSession(): Promise<Session | null> {
        const { data: { session } } = await this.supabase.auth.getSession();
        return session;
    }

    // === OBSERVABLES ===

    get user$(): Observable<User | null> {
        return this.currentUser.asObservable();
    }

    get profile$(): Observable<Profile | null> {
        return this.currentProfile.asObservable();
    }

    // === HELPERS ===

    get currentUserValue(): User | null {
        return this.currentUser.value;
    }

    get currentProfileValue(): Profile | null {
        return this.currentProfile.value;
    }

    isLoggedIn(): boolean {
        return !!this.currentUser.value;
    }

    // === OBTENER USUARIOS (para admin) ===

    async getProfiles(): Promise<Profile[]> {
        const { data, error } = await this.supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Profile[];
    }
}
