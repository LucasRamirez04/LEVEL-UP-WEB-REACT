import { useCarrito } from "../../context/CarritoContext";
import { formatearPrecio } from "../../data/productos";
import styles from "./CarritoOffcanvas.module.css";

export default function CarritoOffcanvas() {
  const { carrito, total, eliminarDelCarrito, vaciarCarrito } = useCarrito();

  return (
    <div
      className={`offcanvas offcanvas-end ${styles.panelCarritoGamer}`}
      tabIndex="-1"
      id="carritoCompras"
      aria-labelledby="carritoLabel"
    >
      <div className="offcanvas-header border-bottom border-secondary">
        <h5 className={`offcanvas-title ${styles.tituloCarrito}`} id="carritoLabel">
          <i className="bi bi-cart3 me-2"></i>Tu Carrito
        </h5>
        <button
          type="button"
          className="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body">
        {carrito.length === 0 ? (
          <p className="text-center mt-4" style={{ color: "#d3d3d3" }}>
            No tienes productos en el carrito.
          </p>
        ) : (
          carrito.map((producto, indice) => (
            <div
              key={indice}
              className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom border-secondary"
            >
              <div className="d-flex align-items-center gap-2">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="rounded"
                  style={{ width: 48, height: 48, objectFit: "cover" }}
                />
                <div>
                  <h6 className="mb-0 text-white small">{producto.nombre}</h6>
                  <small className={styles.textoNeonVerde}>
                    {formatearPrecio(producto.precio)}
                  </small>
                </div>
              </div>
              <button
                className="btn btn-sm btn-outline-danger"
                aria-label="Quitar producto"
                onClick={() => eliminarDelCarrito(indice)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="offcanvas-footer p-3 border-top border-secondary">
        <div className="d-flex justify-content-between mb-3 text-white">
          <span>Total estimado:</span>
          <strong className={styles.textoNeonVerde}>{formatearPrecio(total)}</strong>
        </div>
        <div className="d-flex flex-column gap-2">
          <button className={`btn w-100 py-2 ${styles.botonBuscarNeon}`}>Continuar al Pago</button>
          <button
            className="btn btn-sm btn-outline-danger w-100"
            disabled={carrito.length === 0}
            onClick={vaciarCarrito}
          >
            <i className="bi bi-trash3 me-1"></i>Vaciar Carrito
          </button>
        </div>
      </div>
    </div>
  );
}
