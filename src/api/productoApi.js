import { request } from "./client";

export const obtenerProductos = () => request("/v1/productos/listar");
export const buscarProducto = (id) => request(`/v1/productos/${id}`);
export const obtenerProductosPorCategoria = (idCategoria) => request(`/v1/productos/categoria/${idCategoria}`);
export const agregarProducto = (producto) => request("/v1/productos", "POST", producto);
export const actualizarProducto = (id, producto) => request(`/v1/productos/${id}`, "PUT", producto);
export const eliminarProducto = (id) => request(`/v1/productos/${id}`, "DELETE");