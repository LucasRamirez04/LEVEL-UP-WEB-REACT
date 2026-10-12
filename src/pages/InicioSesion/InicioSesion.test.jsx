import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";
import InicioSesion from "./InicioSesion";

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

test("Comprobar que el formulario bloquea el ingreso y alerta si el correo está vacío", () => {
  render(
    <MemoryRouter>
      <InicioSesion />
    </MemoryRouter>
  );

  // Buscamos el botón de ingreso por su rol y texto
  const botonIngresar = screen.getByRole("button", { name: "Ingresar" });

  // Simulamos el clic directo sin llenar ningún dato en el formulario
  fireEvent.click(botonIngresar);

  // Verificamos que se muestre la alerta en pantalla con el mensaje correspondiente
  expect(screen.getByText("El correo es requerido.")).toBeInTheDocument();
});