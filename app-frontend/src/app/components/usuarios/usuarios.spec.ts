// @ts-nocheck   // 👈 desactiva los errores de TS en ESTE archivo
// import { render } from '@testing-library/angular';
import { UsuarioComponent } from './usuarios.component'; // 👈 nombre y ruta correctos

describe('UsuarioComponent', () => {
  it('should create', async () => {
    const component = await render(UsuarioComponent);
    expect(component).toBeTruthy();
  });
});
