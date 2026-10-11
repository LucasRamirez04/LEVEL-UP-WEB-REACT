import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi, beforeEach } from "vitest";
import InicioSesion from "./InicioSesion";

// Configuramos una "Simulación" para las alertas y evitar que la prueba se detenga

beforeEach(() => {
  window.alert = vi.fn();
});

test("Comprobar que los campos de 'Correo' y 'Contraseña' se renderizan correctamente", () => {
  render(
    <MemoryRouter>
      <InicioSesion />
    </MemoryRouter>
  );

  // Buscamos los inputs conectados a sus etiquetas
  const inputCorreo = screen.getByLabelText("Correo Electrónico");
  const inputClave = screen.getByLabelText("Contraseña");

  // Verificamos que ambos existan 
  expect(inputCorreo).toBeInTheDocument();
  expect(inputClave).toBeInTheDocument();
});