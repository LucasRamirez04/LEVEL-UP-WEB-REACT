import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test } from "vitest";
import Pago from "./Pago";

test("Flujo exitoso: procesar pago aprobado limpia el carrito y muestra confirmación", () => {
  // 0. Limpiar el storage antes de iniciar
  localStorage.clear();

  // 1. Preparamos el carrito simulando que el usuario ya agregó 2 productos
  const itemsCarrito = [
    { codigo: "PROD-001", nombre: "PlayStation 5", precio: 500000 },
    { codigo: "PROD-002", nombre: "Catan", precio: 35000 },
  ];
  localStorage.setItem("carrito", JSON.stringify(itemsCarrito));

  // 2. Renderizamos la vista envuelta en MemoryRouter
  render(
    <MemoryRouter>
      <Pago />
    </MemoryRouter>
  );

  // 3. El switch de simulación está en "Aprobado" por defecto, así que solo buscamos y hacemos clic en Pagar
  const botonPagar = screen.getByRole("button", { name: /pagar/i });
  fireEvent.click(botonPagar);

  // 4. Verificamos que la interfaz cambie mostrando el título de la tarjeta de éxito
  const tituloExito = screen.getByText(/Transacción Completada/i);
  expect(tituloExito).toBeDefined();

  // 5. Verificamos que el carrito se haya vaciado en localStorage (queda en 0)
  const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
  expect(carritoGuardado.length).toBe(0);
});