import { request } from "./client";

export const listarUsuarios = () => 
    request("/v1/usuarios/listar");

export const obtenerUsuarioPorId = (id) => 
    request(`/v1/usuarios/${id}`);

export const crearUsuario = (usuario) => 
    request("/v1/usuarios","POST",usuario);

export const actualizarUsuario = (id, usuario) => 
    request(`/v1/usuarios/${id}`,"PUT",usuario);

export const eliminarUsuario = (id) => 
    request(`/v1/usuarios/${id}`,"DELETE");