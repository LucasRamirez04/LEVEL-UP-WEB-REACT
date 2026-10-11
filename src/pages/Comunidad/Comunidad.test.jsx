import { render, screen, fireEvent } from "@testing-library/react";
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


test("Probar input del nombre en el formulario de inscripción", () => {
  // 1. Montamos la vista
  render(
    <MemoryRouter>
      <Comunidad />
    </MemoryRouter>
  );

  // 2. Buscamos el campo "Nombre" y escribimos "Ana"
  const campoNombre = screen.getByLabelText("Nombre");
  fireEvent.change(campoNombre, { target: { value: "Ana" } });

  // 3. Verificamos que el campo muestra lo que escribimos
  expect(campoNombre.value).toBe("Ana");
});

test("Comprobar que el formulario avisa cuando se envía vacío", () => {
  // 1. Montamos la vista
  render(
    <MemoryRouter>
      <Comunidad />
    </MemoryRouter>
  );

  // 2. Hacemos clic en "Inscribirme" sin escribir nada
  fireEvent.click(screen.getByRole("button", { name: /inscribirme/i }));

  // 3. Verificamos que aparece el aviso de que el nombre es obligatorio
  expect(screen.getByText("El nombre es obligatorio.")).toBeInTheDocument();
});