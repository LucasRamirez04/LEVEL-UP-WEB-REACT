import { createContext, useContext, useState, useEffect } from "react";
import { usuarioAdminInicial } from "../data/productos";

const UsuariosContext = createContext(null);

export function UsuariosProvider({ children }) {
  const [usuarios, setUsuarios] = useState(() => {
    const guardado = localStorage.getItem("usuarios");
    return guardado ? JSON.parse(guardado) : usuarioAdminInicial;
  });

  const [usuarioActivo, setUsuarioActivo] = useState(() => {
    const guardado = localStorage.getItem("usuarioActivo");
    return guardado ? JSON.parse(guardado) : null;
  });

  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    if (usuarioActivo) {
      localStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
    } else {
      localStorage.removeItem("usuarioActivo");
    }
  }, [usuarioActivo]);

  function registrarUsuario(datos) {
    setUsuarios((actual) => [...actual, datos]);
  }

  function actualizarUsuario(index, datos) {
    setUsuarios((actual) => actual.map((u, i) => (i === index ? datos : u)));
  }

  function eliminarUsuario(index) {
    setUsuarios((actual) => actual.filter((_, i) => i !== index));
  }

  function iniciarSesion(correo, clave) {
    const encontrado = usuarios.find(
      (u) => u.correo === correo && u.clave === clave
    );
    if (encontrado) {
      setUsuarioActivo(encontrado);
      return encontrado;
    }
    return null;
  }

  function cerrarSesion() {
    setUsuarioActivo(null);
  }

  return (
    <UsuariosContext.Provider
      value={{
        usuarios,
        usuarioActivo,
        registrarUsuario,
        actualizarUsuario,
        eliminarUsuario,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </UsuariosContext.Provider>
  );
}

export function useUsuarios() {
  return useContext(UsuariosContext);
}
