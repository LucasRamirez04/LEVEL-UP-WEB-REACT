import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { test, expect } from "vitest";
import Comunidad from "./Comunidad";

test("Comprobar que se muestra el título 'Noticias Importantes'", () => {
  render(
    <MemoryRouter>
      <Comunidad />
    </MemoryRouter>
  );

  expect(screen.getByText("Noticias Importantes")).toBeInTheDocument();
});

test("Comprobar que se muestran los 2 casos curiosos", () => {
  render(
    <MemoryRouter>
      <Comunidad />
    </MemoryRouter>
  );

  const botones = screen.getAllByText("Ver caso");

  expect(botones).toHaveLength(2);
});

test("Comprobar que el formulario pide iniciar sesión si no hay sesión", () => {
  render(
    <MemoryRouter>
      <Comunidad />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: /inscribirme/i }));

  expect(screen.getByText("Debes iniciar sesión para inscribirte.")).toBeInTheDocument();
});

test("Comprobar que el formulario avisa cuando no se elige un evento", () => {
  localStorage.setItem("token_levelup", "token-de-prueba");

  render(
    <MemoryRouter>
      <Comunidad />
    </MemoryRouter>
  );

  fireEvent.click(screen.getByRole("button", { name: /inscribirme/i }));

  expect(screen.getByText("Debes elegir un evento.")).toBeInTheDocument();

  localStorage.clear();
});