import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, test } from "vitest";
import Catalogo from "./Catalogo";
import { productosIniciales } from "../../data/productos";

beforeEach(() => {
  localStorage.clear();
});

function renderizarCatalogo() {
  render(
    <MemoryRouter>
      <Catalogo />
    </MemoryRouter>
  );
}

test("El filtro por categoría muestra solo los productos de esa categoría", () => {
  renderizarCatalogo();

  const selectCategoria = screen.getByLabelText("Filtrar por categoría");
  fireEvent.change(selectCategoria, { target: { value: "Accesorios" } });

  const esperados = productosIniciales.filter((p) => p.categoria === "Accesorios").length;
  expect(screen.getAllByText("Añadir").length).toBe(esperados);
});