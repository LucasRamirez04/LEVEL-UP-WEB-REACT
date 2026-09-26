import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProductos } from "../../context/ProductosContext";
import { useCarrito } from "../../context/CarritoContext";
import { calcularPrecioFinal, formatearPrecio } from "../../data/productos";
import styles from "./DetalleProducto.module.css";

export default function DetalleProducto() {
  const { codigo } = useParams(); // parámetro dinámico de la URL
  const navigate = useNavigate();
  const { obtenerPorCodigo } = useProductos();
  const { agregarAlCarrito } = useCarrito();
  const [cantidad, setCantidad] = useState(1);

  const producto = obtenerPorCodigo(codigo);

  if (!producto) {
    return (
      <div className="container py-5 text-center">
        <p className="text-white">No encontramos ese producto.</p>
        <Link to="/productos" className="btn btn-outline-light">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const precioMostrado = producto.enOferta ? calcularPrecioFinal(producto) : producto.precio;

  function handleAgregar() {
    const agregado = agregarAlCarrito(producto, cantidad, precioMostrado);
    if (agregado) navigate("/productos");
  }

  return (
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
  );
}
