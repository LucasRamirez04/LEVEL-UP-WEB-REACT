import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";
import Inicio from "./Inicio";
import { productosIniciales } from "../../data/productos";

test("Comprobar que no se pueden agregar productos sin stock suficiente", () => {
  //limpiar storage
  localStorage.clear();

  //renderizar vista
  render(
    <MemoryRouter> 
      <Inicio />
    </MemoryRouter>
  );

  //1. Buscar Botones de agregar al carrito
  const botonesCompra = screen.getAllByRole("button", { name : /añadir al carrito/i }); // la i es para que el filtro no sea key-sensitive
  const primer_boton = botonesCompra[0];

  //2.Buscar producto con mayor descuento 
  const primerProductoEnOferta = productosIniciales
  .filter((p) => p.enOferta)
  .sort((a, b) => b.descuento - a.descuento)[0];

  const stockMaximo = primerProductoEnOferta.stock;
  
  //3.Hacer clicks en agregar producto para superar el stock
  for(let i = 0; i<= stockMaximo; i++){
    fireEvent.click(primer_boton);
  }

  //4.Verificamos que se lanzo la alerta de error
  const alerta = screen.getByRole("alert");
  expect(alerta.textContent).toContain("No puedes agregar más unidades");
  expect(alerta.className).toContain("alert-danger");

  //5. Verificamos que el carrito no guardo más unidades que el stock permitido
  const carrito = JSON.parse(localStorage.getItem("carrito"));
  expect(carrito.length).toBe(primerProductoEnOferta.stock);
});
