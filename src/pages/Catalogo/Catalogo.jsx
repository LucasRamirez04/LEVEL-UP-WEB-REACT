import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarritoOffcanvas from "../../components/CarritoOffcanvas/CarritoOffcanvas";
import { productosIniciales as listaProductosBase, calcularPrecioFinal, formatearPrecio } from "../../data/productos";
import styles from "./Catalogo.module.css";
import App_alert from "../../components/alerta/alerta";

const CATEGORIAS = [
  "Juegos de Mesa",
  "Accesorios",
  "Consolas/Computadores",
  "Perifericos",
  "Vestuario",
];

export default function Catalogo() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState("todas");

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // Carga los productos desde localStorage si existen, o usa la lista base
  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem("productos"));
    if (productosGuardados && productosGuardados.length > 0) {
      setProductos(productosGuardados);
    } else {
      setProductos(listaProductosBase);
    }
  }, []);

  const productosFiltrados = useMemo(() => {
    if (categoria === "todas") return productos;
    return productos.filter((p) => p.categoria === categoria);
  }, [productos, categoria]);

  // Guarda en localStorage directamente
  const agregarAlCarrito = (producto, precioFinal) => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

    // Validacion de stock
    const yaEnCarrito = carritoActual.filter((item) => item.codigo === producto.codigo).length;
    if (yaEnCarrito >= producto.stock) {
      setMostrarAlerta(true);
      setMensajeAlerta(
        `No queda stock disponible de "${producto.nombre}". Ya tienes en el carrito el máximo permitido (${producto.stock}).`
      );
      setTipoAlerta("danger");
      return;
    }

    const itemAAgregar = {
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: precioFinal,
      imagen: producto.imagen,
    };

    const nuevoCarrito = [...carritoActual, itemAAgregar];
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

    // despacha evento global para que Navbar actualice su contador
    window.dispatchEvent(new Event("storage"));

    setMostrarAlerta(true);
    setMensajeAlerta(`"${producto.nombre}" agregado al carrito.`);
    setTipoAlerta("success");
  };

  function handleAgregarRapido(e, producto) {
    e.stopPropagation(); // agregar al carro sin entrar al detalle
    const precioFinal = producto.enOferta ? calcularPrecioFinal(producto) : producto.precio;
    agregarAlCarrito(producto, precioFinal);
  }

  return (
    <>
      <Navbar />
      <CarritoOffcanvas />

      <div style={{ position: "fixed", top: "90px", right: "20px", zIndex: 1060, maxWidth: "400px" }}>
        <App_alert
          mostrarAlert={mostrarAlerta}
          cerrarAlert={() => setMostrarAlerta(false)}
          variant={tipoAlerta}
          msgAlert={mensajeAlerta}
        />
      </div>

      <main className="flex-grow-1 contenedor-principal mt-5 pt-4">
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
      </main>

      <Footer />
    </>
  );
}