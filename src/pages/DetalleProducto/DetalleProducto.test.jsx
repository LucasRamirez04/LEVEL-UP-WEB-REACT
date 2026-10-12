import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { beforeEach, expect, test } from "vitest";
import DetalleProducto from "./DetalleProducto";
import { productosIniciales } from "../../data/productos";

beforeEach(() => {
  localStorage.clear();
});

// DetalleProducto lee el código desde la URL, se renderiza dentro de una ruta
function renderizarDetalle(codigo) {
  render(
    <MemoryRouter initialEntries={[`/productos/${codigo}`]}>
      <Routes>
        <Route path="/productos/:codigo" element={<DetalleProducto />} />
      </Routes>
    </MemoryRouter>
  );
}

test("Muestra el nombre del producto cuando el código existe", () => {
  const producto = productosIniciales[0];
  renderizarDetalle(producto.codigo);

  expect(screen.getByRole("heading", { name: producto.nombre })).toBeInTheDocument();
});