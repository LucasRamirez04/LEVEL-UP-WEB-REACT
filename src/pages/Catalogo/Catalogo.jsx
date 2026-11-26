import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarritoOffcanvas from "../../components/CarritoOffcanvas/CarritoOffcanvas";
import { calcularPrecioFinal, formatearPrecio } from "../../data/productos";
import { obtenerProductos, obtenerProductosPorCategoria } from "../../api/productoApi";
import { obtenerCategorias } from "../../api/categoriaApi";
import { adaptarProducto } from "../../api/adaptadorProducto";
import styles from "./Catalogo.module.css";
import App_alert from "../../components/alerta/alerta";

// se elimina la constante CATEGORIAS = [] porque se piden al backend

export default function Catalogo() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("todas");
  const [cargando, setCargando] = useState(true);

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // carga las categorías desde el backend (GET /api/v1/categorias/listar).
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await obtenerCategorias();
        setCategorias(data);
      } catch {
        // si el backend no responde, se avisa con la alerta que ya existía
        setMostrarAlerta(true);
        setMensajeAlerta("No se pudieron cargar las categorías");
        setTipoAlerta("danger");
      }
    };
    cargarCategorias();
  }, []); // El [] hace que se ejecute una sola vez al abrir la pagina

  // antes los productos venian de localStorage ("productos") o de la lista base

  //  si hay categoria elegida "GET /api/v1/productos/categoria/{id}"" y si no "GET /api/v1/productos/listar""
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data =
          categoria === "todas"
            ? await obtenerProductos()
            : await obtenerProductosPorCategoria(categoria);
        // adaptarProducto se aplica a cada producto para traducir los nombres de los campos
        setProductos(data.map(adaptarProducto));
      } catch {
        setMostrarAlerta(true);
        setMensajeAlerta("No se pudieron cargar los productos");
        setTipoAlerta("danger");
      } finally {
        // finally se ejecuta siempre con o sin error y ya termina de cargar
        setCargando(false);
      }
    };
    cargarProductos();
  }, [categoria]);

  // se eliminó el useMemo de productosFiltrados porque el backend ya devuelve productos filtrados

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
              {categorias.map((c) => ( // ahora se recorren categorias del backend con su id
                <option key={c.id_categoria} value={c.id_categoria}>
                  {c.nombre_categoria}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section id="grid-productos" className={`${styles.gridProductos} container pb-5`}>
          {/* mensajes de estado para que la pagina no se vea vacia sin explicar */}
          {cargando && <p className={styles.textoSecundario}>Cargando productos...</p>}
          {!cargando && productos.length === 0 && (
            <p className={styles.textoSecundario}>No hay productos en esta categoría.</p>
          )}
          {productos.map((producto) => {
            const precioMostrado = producto.enOferta
              ? calcularPrecioFinal(producto)
              : producto.precio;
            return (
              <div
                // sin cambios en el jsx de la tarjeta por el adaptador
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