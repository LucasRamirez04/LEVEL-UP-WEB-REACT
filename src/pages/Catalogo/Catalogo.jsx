import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProductos } from "../../context/ProductosContext";
import { useCarrito } from "../../context/CarritoContext";
import { calcularPrecioFinal, formatearPrecio } from "../../data/productos";
import styles from "./Catalogo.module.css";

const CATEGORIAS = [
  "Juegos de Mesa",
  "Accesorios",
  "Consolas/Computadores",
  "Perifericos",
  "Vestuario",
];

export default function Catalogo() {
  const { productos } = useProductos();
  const { agregarAlCarrito } = useCarrito();
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState("todas");

  const productosFiltrados = useMemo(() => {
    if (categoria === "todas") return productos;
    return productos.filter((p) => p.categoria === categoria);
  }, [productos, categoria]);

  function handleAgregarRapido(e, producto) {
    e.stopPropagation(); // permite agregar al carro sin entrar al detalle
    const precioFinal = producto.enOferta ? calcularPrecioFinal(producto) : producto.precio;
    agregarAlCarrito(producto, 1, precioFinal);
  }

  return (
    <>
      <section id="filtros-catalogo" className="container py-4">
        <h1 className={styles.tituloCatalogo}>Catálogo de Productos</h1>

        <div className={styles.filaFiltros}>
          <label htmlFor="filtro-categoria" className={`form-label ${styles.textoSecundario}`}>
            Filtrar por categoría
          </label>
          <select
            id="filtro-categoria"
            className={`form-select ${styles.selectorFiltro}`}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c === "Perifericos" ? "Periféricos" : c}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section id="grid-productos" className={`${styles.gridProductos} container pb-5`}>
        {productosFiltrados.map((producto) => {
          const precioMostrado = producto.enOferta
            ? calcularPrecioFinal(producto)
            : producto.precio;
          return (
            <div
              key={producto.codigo}
              className={`position-relative ${styles.tarjetaProducto}`}
              onClick={() => navigate(`/productos/${producto.codigo}`)}
            >
              {producto.enOferta && (
                <span
                  className="badge position-absolute top-0 end-0 m-2 px-2 py-1"
                  style={{ backgroundColor: "#39FF14", color: "#000000", fontWeight: "bold" }}
                >
                  -{producto.descuento}% OFF
                </span>
              )}
              <img src={producto.imagen} alt={producto.nombre} className={styles.imagenProducto} />
              <p className={styles.nombreProducto}>{producto.nombre}</p>
              <p className={styles.precioProducto}>{formatearPrecio(precioMostrado)}</p>
              <button
                type="button"
                className={`btn ${styles.botonAgregarCarrito}`}
                onClick={(e) => handleAgregarRapido(e, producto)}
              >
                Añadir
              </button>
            </div>
          );
        })}
      </section>
    </>
  );
}
