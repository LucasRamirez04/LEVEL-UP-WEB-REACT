import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarritoOffcanvas from "../../components/CarritoOffcanvas/CarritoOffcanvas";
import {
  productosIniciales as listaProductosBase,
  calcularPrecioFinal,
  formatearPrecio,
} from "../../data/productos";
import styles from "./DetalleProducto.module.css";

export default function DetalleProducto() {
  const { codigo } = useParams(); // param dinamico de la URL
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);

  // Busca el producto en localStorage o en la lista base si no hay nada guardado
  const producto = useMemo(() => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos"));
    const lista =
      productosGuardados && productosGuardados.length > 0
        ? productosGuardados
        : listaProductosBase;
    return lista.find((p) => p.codigo === codigo) || null;
  }, [codigo]);

  // Guarda en localStorage directamente
  const agregarAlCarrito = (prod, unidades, precioFinal) => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

    // Validacion stock
    const yaEnCarrito = carritoActual.filter((item) => item.codigo === prod.codigo).length;
    const stockDisponible = prod.stock - yaEnCarrito;

    if (stockDisponible <= 0) {
      alert(
        `No queda stock disponible de "${prod.nombre}". Ya tienes en el carrito el máximo permitido (${prod.stock}).`
      );
      return false;
    }
    if (unidades > stockDisponible) {
      alert(
        `Solo puedes agregar ${stockDisponible} unidad(es) más de "${prod.nombre}" (stock disponible: ${prod.stock}, ya tienes ${yaEnCarrito} en el carrito).`
      );
      return false;
    }

    const nuevosItems = Array.from({ length: unidades }, () => ({
      codigo: prod.codigo,
      nombre: prod.nombre,
      precio: precioFinal,
      imagen: prod.imagen,
    }));

    localStorage.setItem("carrito", JSON.stringify([...carritoActual, ...nuevosItems]));

    // Despacha evento global para que Navbar actualice su contador
    window.dispatchEvent(new Event("storage"));
    return true;
  };

  if (!producto) {
    return (
      <>
        <Navbar />
        <CarritoOffcanvas />

        <main className="flex-grow-1 contenedor-principal mt-5 pt-4">
          <div className="container py-5 text-center">
            <p className="text-white">No encontramos ese producto.</p>
            <Link to="/productos" className="btn btn-outline-light">
              Volver al catálogo
            </Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const precioMostrado = producto.enOferta ? calcularPrecioFinal(producto) : producto.precio;

  function handleAgregar() {
    const agregado = agregarAlCarrito(producto, cantidad, precioMostrado);
    if (agregado) navigate("/productos");
  }

  return (
    <>
      <Navbar />
      <CarritoOffcanvas />

      <main className="flex-grow-1 contenedor-principal mt-5 pt-4">
        <div className="container py-5">
          <Link to="/productos" className="btn btn-outline-light mb-4">
            &larr; Volver al catálogo
          </Link>

          <div className={`p-4 rounded ${styles.modalDetalleProducto}`}>
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className={styles.imagenDetalleProducto}
                />
              </div>
              <div className="col-12 col-md-6">
                <h1 className="text-white h3">{producto.nombre}</h1>
                <p className={styles.textoSecundario}>{producto.categoria}</p>
                <p className={styles.precioDetalle}>{formatearPrecio(precioMostrado)}</p>
                <p className={styles.textoSecundario}>
                  Stock disponible: {producto.stock} unidad(es).
                </p>

                <div className={styles.selectorCantidad}>
                  <label htmlFor="detalle-cantidad" className="form-label text-white">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    id="detalle-cantidad"
                    className="form-control"
                    min="1"
                    max="99"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                  />
                </div>

                <button
                  type="button"
                  className={`btn mt-3 ${styles.botonAgregarCarrito}`}
                  onClick={handleAgregar}
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}