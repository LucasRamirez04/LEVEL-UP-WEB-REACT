import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import InicioSesion from "./InicioSesion";
import { login } from "../../api/authApi";
import { getToken, getUsuario } from "../../auth/auth";

vi.mock("../../api/authApi");

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
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

test("Guarda token y usuario en auth.js cuando el login responde correctamente", async () => {
  login.mockResolvedValue({
    token: "jwt-token-prueba",
    type: "Bearer",
    expiresIn: 3600,
    rol: "Cliente",
    nombres: "Franco",
  });

  render(
    <MemoryRouter>
      <InicioSesion />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText("Correo Electrónico"), {
    target: { value: "  Franco@Duoc.cl " },
  });
  fireEvent.change(screen.getByLabelText("Contraseña"), {
    target: { value: "1234" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

  await waitFor(() => {
    expect(login).toHaveBeenCalledWith("franco@duoc.cl", "1234");
    expect(getToken()).toBe("jwt-token-prueba");
    expect(getUsuario()).toEqual({
      nombre: "Franco",
      rol: "Cliente",
      correo: "franco@duoc.cl",
    });
  });
});

test("Muestra alerta de error cuando el backend responde 401", async () => {
  login.mockRejectedValue(new Error("Error 401"));

  render(
    <MemoryRouter>
      <InicioSesion />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText("Correo Electrónico"), {
    target: { value: "franco@duoc.cl" },
  });
  fireEvent.change(screen.getByLabelText("Contraseña"), {
    target: { value: "incorrecta" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

  expect(await screen.findByText("Correo o contraseña incorrectos.")).toBeInTheDocument();
  expect(getToken()).toBeNull();
});