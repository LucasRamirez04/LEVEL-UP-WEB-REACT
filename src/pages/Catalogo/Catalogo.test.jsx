import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import Catalogo from "./Catalogo";
import { obtenerProductos, obtenerProductosPorCategoria } from "../../api/productoApi";
import { obtenerCategorias } from "../../api/categoriaApi";

// se reemplazan las llamadas al backend por datos falsos
vi.mock("../../api/productoApi");
vi.mock("../../api/categoriaApi");

const categoriasFalsas = [
  { id_categoria: 1, nombre_categoria: "Juegos de Mesa" },
  { id_categoria: 2, nombre_categoria: "Accesorios" },
];

const productosFalsos = [
  {
    codigo_producto: 1,
    categoria: categoriasFalsas[0],
    nombre_producto: "Catan",
    descripcion_producto: "Juego de estrategia",
    precio_producto: 29000,
    porcentaje_producto: 30,
    stock_producto: 3,
    imagen_producto: "/img/catan.jpg",
  },
  {
    codigo_producto: 2,
    categoria: categoriasFalsas[1],
    nombre_producto: "Control Xbox",
    descripcion_producto: "Control inalámbrico",
    precio_producto: 59990,
    porcentaje_producto: 0,
    stock_producto: 2,
    imagen_producto: "/img/control-xbox.webp",
  },
];

beforeEach(() => {
  localStorage.clear();
  obtenerCategorias.mockResolvedValue(categoriasFalsas);
  obtenerProductos.mockResolvedValue(productosFalsos);
  // el backend devuelve solo los de la categoria pedida
  obtenerProductosPorCategoria.mockResolvedValue([productosFalsos[1]]);
});

function renderizarCatalogo() {
  render(
    <MemoryRouter>
      <Catalogo />
    </MemoryRouter>
  );
}

test("El filtro por categoría muestra solo los productos de esa categoría", async () => {
  renderizarCatalogo();

  // espera a que carguen las categorías antes de elegir una
  await screen.findByRole("option", { name: "Accesorios" });

  const selectCategoria = screen.getByLabelText("Filtrar por categoría");
  fireEvent.change(selectCategoria, { target: { value: "2" } }); // accesorios es la categoria con id 2

  // queda solo el producto de Accesorios
  await waitFor(() => expect(screen.getAllByText("Añadir").length).toBe(1));
});