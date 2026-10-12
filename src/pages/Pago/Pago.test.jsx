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

  // 3. Llenamos específicamente el campo de correo, 
  // ya que tu función usa FormData para capturarlo y guardarlo en la venta.
  const inputCorreo = document.querySelector('input[name="correo"]');
  fireEvent.change(inputCorreo, { target: { value: "lucas@gmail.com" } });

  // 4. FORZAR EL SUBMIT: En lugar de hacer clic en el botón y depender 
  // de las validaciones HTML del navegador virtual, disparamos el envío directo.
  const formulario = document.querySelector("form");
  fireEvent.submit(formulario);

  // 5. Verificamos que la interfaz cambie mostrando el título de la tarjeta de éxito
  const tituloExito = screen.getByText(/Transacción Completada/i);
  expect(tituloExito).toBeDefined();

  // 6. Verificamos que el carrito se haya vaciado en localStorage (queda en 0)
  const carritoGuardado = JSON.parse(localStorage.getItem("carrito"));
  expect(carritoGuardado.length).toBe(0);

  // 7. (Opcional) Verificamos que la venta se haya registrado correctamente
  const ventasGuardadas = JSON.parse(localStorage.getItem("ventas"));
  expect(ventasGuardadas.length).toBe(1);
  expect(ventasGuardadas[0].cliente).toBe("lucas@gmail.com");
});