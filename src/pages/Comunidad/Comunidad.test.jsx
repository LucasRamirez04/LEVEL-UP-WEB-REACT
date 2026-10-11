import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { test, expect } from "vitest";
import Comunidad from "./Comunidad";

test("Comprobar que se muestra el título 'Noticias Importantes'", () => {
  // 1. Montamos la vista (MemoryRouter es necesario por los Links del Navbar y Footer)
  render(
    <MemoryRouter>
      <Comunidad />
    </MemoryRouter>
  );

  // 2. Verificamos que el título está en pantalla
  expect(screen.getByText("Noticias Importantes")).toBeInTheDocument();
});

test("Comprobar que se muestran los 2 casos curiosos", () => {
  // 1. Montamos la vista
  render(
    <MemoryRouter>
      <Comunidad />
    </MemoryRouter>
  );

  // 2. Buscamos todos los botones que dicen "Ver caso"
  const botones = screen.getAllByText("Ver caso");

  // 3. Verificamos que hay exactamente 2 (uno por cada caso curioso)
  expect(botones).toHaveLength(2);
});

test("Comprobar que se muestran los 3 mapas de eventos", () => {
  // 1. Montamos la vista
  render(
    <MemoryRouter>
      <Comunidad />
    </MemoryRouter>
  );

  // 2. Buscamos todos los mapas por su título ("Mapa de Santiago", "Mapa de Valparaíso"...)
  const mapas = screen.getAllByTitle(/Mapa de/);

  // 3. Verificamos que hay exactamente 3
  expect(mapas).toHaveLength(3);
});