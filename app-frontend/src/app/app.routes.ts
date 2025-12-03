import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./app/pages/landing/landing').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./app/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./app/pages/registro/registro').then(m => m.RegistroComponent)
  },
  {
    path: 'mapa',
    loadComponent: () =>
      import('./app/pages/mapa/mapa').then(m => m.MapaComponent)
  },
  {
    path: 'usuarios',
    loadComponent: () =>
      import('./components/usuarios/usuarios').then(m => m.UsuarioComponent)
  },
  { path: '**', redirectTo: ''  
  }
];
