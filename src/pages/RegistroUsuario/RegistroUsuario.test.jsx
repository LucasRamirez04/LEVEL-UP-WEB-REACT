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

test("Comprobar que la caja de texto 'Nombre' guarda correctamente lo que escribe el usuario", () => {
  render(
    <MemoryRouter>
      <RegistroUsuario />
    </MemoryRouter>
  );
  
  // Buscamos el input a través de su etiqueta <label> asociada
  const inputNombre = screen.getByLabelText("Nombre");
  
  // Simulamos de forma síncrona a un usuario tecleando la palabra "Franco"
  fireEvent.change(inputNombre, { target: { value: "Franco" } });
  
  // Verificamos que el valor interno de la caja haya cambiado
  expect(inputNombre.value).toBe("Franco");
});

test("Comprobar que el formulario bloquea el envío y alerta si el RUN está vacío", () => {
  render(
    <MemoryRouter>
      <RegistroUsuario />
    </MemoryRouter>
  );
  
  // Buscamos el botón de registro por su rol y texto
  const botonRegistro = screen.getByRole("button", { name: "Registrar Cuenta" });
  
  // Simulamos el clic directo sin llenar ningún dato en el formulario
  fireEvent.click(botonRegistro);
  
  // Verificamos que la función de validación haya disparado exactamente esta alerta
  expect(window.alert).toHaveBeenCalledWith("El RUN es requerido.");
});