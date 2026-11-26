import { request } from "./client";

export const obtenerVentas = () => request("/v1/ventas/listar");
export const buscarVenta = (id) => request(`/v1/ventas/${id}`);
export const agregarVenta = (venta) => request("/v1/ventas", "POST", venta);
export const actualizarVenta = (id, venta) => request(`/v1/ventas/${id}`, "PUT", venta);
export const eliminarVenta = (id) => request(`/v1/ventas/${id}`, "DELETE");
