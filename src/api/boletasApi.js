import { request } from "./client";

export const obtenerBoletas = () => request("/v1/boletas/listar");
export const buscarBoleta = (id) => request(`/v1/boletas/${id}`);
export const agregarBoleta = (boleta) => request("/v1/boletas", "POST", boleta);
export const actualizarBoleta = (id, boleta) => request(`/v1/boletas/${id}`, "PUT", boleta);
export const eliminarBoleta = (id) => request(`/v1/boletas/${id}`, "DELETE");