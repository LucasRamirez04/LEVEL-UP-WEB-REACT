import { createContext, useContext, useState, useEffect } from "react";
import { productosIniciales } from "../data/productos";

const ProductosContext = createContext(null);

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState(() => {
    const guardado = localStorage.getItem("productos");
    return guardado ? JSON.parse(guardado) : productosIniciales;
  });

  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  function obtenerPorCodigo(codigo) {
    return productos.find((p) => p.codigo === codigo) || null;
  }

  function crearProducto(datos) {
    setProductos((actual) => [...actual, datos]);
  }

  function actualizarProducto(index, datos) {
    setProductos((actual) => actual.map((p, i) => (i === index ? datos : p)));
  }

  function eliminarProducto(index) {
    setProductos((actual) => actual.filter((_, i) => i !== index));
  }

  return (
    <ProductosContext.Provider
      value={{
        productos,
        obtenerPorCodigo,
        crearProducto,
        actualizarProducto,
        eliminarProducto,
      }}
    >
      {children}
    </ProductosContext.Provider>
  );
}

export function useProductos() {
  return useContext(ProductosContext);
}
