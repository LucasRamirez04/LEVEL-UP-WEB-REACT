import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi, beforeEach } from "vitest";
import RegistroUsuario from "./RegistroUsuario";

// Configuramos una "Simulación" para las alertas de validación.
// Usamos vi.fn() para que intercepte los alert logrando que la prueba no se quede pausada
beforeEach(() => {
  window.alert = vi.fn(); 
});

test("Comprobar que se renderiza el título principal del formulario", () => {
  render(
    <MemoryRouter>
      <RegistroUsuario />
    </MemoryRouter>
  );
  
  // Buscamos el texto exacto en el documento
  const titulo = screen.getByText("REGISTRO DE USUARIO");
  
  // Verificamos que el elemento exista visualmente
  expect(titulo).toBeInTheDocument();
});
