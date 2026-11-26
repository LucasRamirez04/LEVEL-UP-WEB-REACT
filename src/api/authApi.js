import { request } from "./client";

export const login = (correo, contrasena) =>
    request("/auth/login", "POST", { correo, contrasena });

export const registro = (usuario) =>
    request("/auth/registro", "POST", usuario);