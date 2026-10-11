import { fireEvent, render, screen } from "@testing-library/react";
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

test("Cambio de estado al agregar producto (Flujo exitoso)", () => {
  localStorage.clear();

  render(
    <MemoryRouter>
      <Inicio />
    </MemoryRouter>
  );

  // 1. Clic en el botón
  const botonesCompra = screen.getAllByRole("button", { name: /añadir al carrito/i });
  fireEvent.click(botonesCompra[0]);

  // 2. Buscamos el componente <Alert> por su rol nativo de accesibilidad
  const alerta = screen.getByRole("alert");
  expect(alerta).toBeDefined();

  // 3. Verificamos que contenga el texto del mensaje
  expect(alerta.textContent).toContain("agregado al carrito");

  // 4. Verificamos que React-Bootstrap le haya puesto la clase según la prop variant={tipoAlerta}
  expect(alerta.className).toContain("alert-success");

  // 5. Verificamos que se guardó en localStorage
  const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
  expect(carritoGuardado.length).toBe(1);
});
