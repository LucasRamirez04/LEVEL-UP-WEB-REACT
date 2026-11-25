const TOKEN_KEY = "token_levelup";
const USER_KEY = "usuario_levelup";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const guardarToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const getUsuario = () => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
};

export const guardarUsuario = (usuario) => {
    localStorage.setItem(USER_KEY, JSON.stringify(usuario));
};

export const cerrarSesion = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const estaLogueado = () => getToken() !== null;