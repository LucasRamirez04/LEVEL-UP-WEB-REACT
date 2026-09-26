import { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem("carritoGamer");
    return guardado ? JSON.parse(guardado) : [];
  });

  // Cada vez que el carrito cambia, se persiste en localStorage (reemplaza los
  // localStorage.setItem("carritoGamer", ...) repetidos del JS original)
  useEffect(() => {
    localStorage.setItem("carritoGamer", JSON.stringify(carrito));
  }, [carrito]);

  function cantidadEnCarrito(codigo) {
    return carrito.filter((item) => item.codigo === codigo).length;
  }

  function agregarAlCarrito(producto, cantidad = 1, precioFinal = null) {
    const yaEnCarrito = cantidadEnCarrito(producto.codigo);
    const stockDisponible = producto.stock - yaEnCarrito;

    if (stockDisponible <= 0) {
      alert(
        `No queda stock disponible de "${producto.nombre}". Ya tienes en el carrito el máximo permitido (${producto.stock}).`
      );
      return false;
    }
    if (cantidad > stockDisponible) {
      alert(
        `Solo puedes agregar ${stockDisponible} unidad(es) más de "${producto.nombre}" (stock disponible: ${producto.stock}, ya tienes ${yaEnCarrito} en el carrito).`
      );
      return false;
    }

    const precio = precioFinal ?? producto.precio;
    const nuevosItems = Array.from({ length: cantidad }, () => ({
      ...producto,
      precio,
    }));

    setCarrito((actual) => [...actual, ...nuevosItems]);
    return true;
  }

  function eliminarDelCarrito(indice) {
    setCarrito((actual) => actual.filter((_, i) => i !== indice));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  const total = carrito.reduce((acc, item) => acc + item.precio, 0);

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        total,
        cantidadEnCarrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  return useContext(CarritoContext);
}
