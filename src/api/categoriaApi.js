import { request } from "./client";

export const obtenerCategorias = () => request("/v1/categorias/listar");
export const buscarCategoria = (id) => request(`/v1/categorias/${id}`);
export const agregarCategoria = (categoria) => request("/v1/categorias", "POST", categoria);
export const actualizarCategoria = (id, categoria) => request(`/v1/categorias/${id}`, "PUT", categoria);
export const eliminarCategoria = (id) => request(`/v1/categorias/${id}`, "DELETE");