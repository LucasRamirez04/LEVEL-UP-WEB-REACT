import { request } from "./client";

export const obtenerDetallesVenta = () => request("/v1/detalle-ventas/listar");
export const buscarDetalleVenta = (id) => request(`/v1/detalle-ventas/${id}`);
export const obtenerDetallesPorVenta = (idVenta) => request(`/v1/detalle-ventas/venta/${idVenta}`);
export const agregarDetalleVenta = (detalle) => request("/v1/detalle-ventas", "POST", detalle);
export const actualizarDetalleVenta = (id, detalle) => request(`/v1/detalle-ventas/${id}`, "PUT", detalle);
export const eliminarDetalleVenta = (id) => request(`/v1/detalle-ventas/${id}`, "DELETE");