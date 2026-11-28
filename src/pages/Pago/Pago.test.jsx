import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, test, vi } from "vitest";
import Pago from "./Pago";
import { agregarVenta } from "../../api/ventaApi";
import { agregarDetalleVenta } from "../../api/detalleVentasApi";
import { agregarBoleta } from "../../api/boletasApi";

// Se simula el backend: así el test no depende de que esté encendido
vi.mock("../../api/ventaApi");
vi.mock("../../api/detalleVentasApi");
vi.mock("../../api/boletasApi");

// Carrito de prueba: la PlayStation 5 está 2 veces y Catan 1 vez
const itemsCarrito = [
  { codigo: "1", nombre: "PlayStation 5", precio: 500000 },
  { codigo: "1", nombre: "PlayStation 5", precio: 500000 },
  { codigo: "2", nombre: "Catan", precio: 35000 },
];

function mostrarPago() {
  render(
    <MemoryRouter>
      <Pago />
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
  localStorage.setItem("carrito", JSON.stringify(itemsCarrito));
});

test("Comprobar que con el carrito vacío el botón de pago está deshabilitado", () => {
  localStorage.setItem("carrito", JSON.stringify([]));
  mostrarPago();

  const boton = screen.getByRole("button", { name: /carrito vacío/i });

  expect(boton).toBeDisabled();
});

test("Comprobar que un pago rechazado no registra nada en el backend", () => {
  mostrarPago();

  fireEvent.click(screen.getByLabelText(/Simular pago RECHAZADO/i));
  fireEvent.submit(document.querySelector("form"));

  expect(screen.getByText(/Transacción Fallida/i)).toBeInTheDocument();
  expect(agregarVenta).not.toHaveBeenCalled();
});

test("Comprobar que sin sesión iniciada no se puede pagar", () => {
  mostrarPago();

  fireEvent.submit(document.querySelector("form"));

  expect(screen.getByText("Debes iniciar sesión para pagar.")).toBeInTheDocument();
  expect(agregarVenta).not.toHaveBeenCalled();
});

test("Comprobar que un pago aprobado registra la venta, sus detalles y la boleta", () => {
  // Usuario con sesión iniciada (el id lo guarda el login)
  localStorage.setItem("usuario_levelup", JSON.stringify({ nombre: "Joaquin", id: 3 }));

  // Respuestas simuladas del backend
  agregarVenta.mockResolvedValue({ id_venta: 7 });
  agregarDetalleVenta.mockResolvedValue({});
  agregarBoleta.mockResolvedValue({});

  mostrarPago();

  // El cliente escribe la calle (la comuna ya viene seleccionada: Cerrillos)
  const calle = document.querySelector('input[name="calle"]');
  fireEvent.change(calle, { target: { value: "Av. Siempre Viva 123" } });
  fireEvent.submit(document.querySelector("form"));

  // Se espera a que aparezca la pantalla de éxito y luego se revisa lo que se envió
  return screen.findByText(/Transacción Completada/i).then(() => {
    expect(agregarVenta).toHaveBeenCalledTimes(1);
    expect(agregarVenta.mock.calls[0][0].usuario.id_usuario).toBe(3);
    expect(agregarVenta.mock.calls[0][0].total).toBe(1035000);
    expect(agregarVenta.mock.calls[0][0].direccion_envio).toBe("Av. Siempre Viva 123, Cerrillos");

    // 2 productos distintos = 2 detalles. La PS5 con cantidad 2
    expect(agregarDetalleVenta).toHaveBeenCalledTimes(2);
    expect(agregarDetalleVenta.mock.calls[0][0].cantidad_producto).toBe(2);

    // La boleta queda asociada a la venta 7
    expect(agregarBoleta).toHaveBeenCalledTimes(1);
    expect(agregarBoleta.mock.calls[0][0].venta.id_venta).toBe(7);
    expect(localStorage.getItem("carrito")).toBe("[]");
  });
});

test("Comprobar que si falla el backend se avisa y el carrito no se vacía", () => {
  localStorage.setItem("usuario_levelup", JSON.stringify({ nombre: "Joaquin", id: 3 }));
  agregarVenta.mockRejectedValue(new Error("Error 500"));

  mostrarPago();
  fireEvent.submit(document.querySelector("form"));

  return screen.findByText("No pudimos registrar tu compra. Intenta de nuevo.").then(() => {
    expect(agregarBoleta).not.toHaveBeenCalled();
    expect(JSON.parse(localStorage.getItem("carrito")).length).toBe(3);
  });
});