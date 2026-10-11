import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";
import Inicio from "./Inicio";

test("Comprobar que se renderizan exactamente 3 productos en ofertas destacadas", () => {
  // 1. Renderizamos la vista envuelta en MemoryRouter (necesario por los Links del Navbar y Footer)
  render(
    <MemoryRouter>
      <Inicio />
    </MemoryRouter>
  );

  // 2. Buscamos todos los botones que dicen "Añadir al Carrito"
  const botonesCompra = screen.getAllByRole("button", { name: /añadir al carrito/i });

  // 3. Verificamos que sean exactamente 3 tarjetas con su botón
  expect(botonesCompra.length).toBe(3);

  // 4. Verificamos que existan exactamente 3 badges de descuento (% OFF)
  const badgesDescuento = screen.getAllByText(/OFF/i);
  expect(badgesDescuento.length).toBe(3);
});