import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, redirect } from "react-router-dom";
import { expect, test } from "vitest";
import Administrador from "./Administrador";
import { productosIniciales } from "../../data/productos";


test("Registrar producto con precio = 0", () => {
  localStorage.clear();

  render(
    <MemoryRouter>
      <Administrador />
    </MemoryRouter>
  );

  // 1. Buscamos los inputs del formulario de productos
  const inputsTexto = screen.getAllByRole("textbox");
  const inputCodigo = inputsTexto[0];
  const inputNombre = inputsTexto[1];

  const selects = screen.getAllByRole("combobox");
  const selectCategoria = selects[0];

  const inputsNumericos = screen.getAllByRole("spinbutton");
  const inputPrecio = inputsNumericos[0];
  const inputStock = inputsNumericos[1];

  // 2. Llenamos el formulario con precio 0
  fireEvent.change(inputCodigo, { target: { value: "FREE-01" } });
  fireEvent.change(inputNombre, { target: { value: "Juego Gratuito" } });
  fireEvent.change(selectCategoria, { target: { value: "Juegos de Mesa" } });
  fireEvent.change(inputPrecio, { target: { value: "0" } });
  fireEvent.change(inputStock, { target: { value: "10" } });

  // 3. Enviamos el formulario haciendo clic en Guardar
  const botonesGuardar = screen.getAllByRole("button", { name: /guardar/i });
  fireEvent.click(botonesGuardar[0]);

  const productosGuardados = JSON.parse(localStorage.getItem("productos"));
  
  // Verificamos que aumentó en 1 elemento respecto a la lista inicial
  expect(productosGuardados.length).toBe(productosIniciales.length + 1);

  // Verificamos que el último elemento tiene exactamente el precio límite 0 como valor numérico
  // y el codigo es el que ingresamos en la simulacion
  const nuevoProducto = productosGuardados[productosGuardados.length - 1];
  expect(nuevoProducto.precio).toBe(0);
  expect(nuevoProducto.codigo).toBe("FREE-01");
});


test("Probar que el formulario vacío no debe agregar productos al storage" , () => {
    //limpiar localStorage
    localStorage.clear();

    render(
        <MemoryRouter>
            <Administrador />
        </MemoryRouter>
    )

    // 1. Hacer click en guardar sin registrar ningún campo
    const botonesGuardar = screen.getAllByRole("button", {name : /guardar/i});
    fireEvent.click(botonesGuardar[0]);

    //2. verificar que no aumento el tamaño de la lista en el localStorage
    const productosGuardados = JSON.parse(localStorage.getItem("productos"));
    expect(productosGuardados.length).toBe(productosIniciales.length)
});