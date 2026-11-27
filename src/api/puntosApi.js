import { request } from "./client";

export const sumarPuntos = () => request("/v1/puntos/sumar", "POST");