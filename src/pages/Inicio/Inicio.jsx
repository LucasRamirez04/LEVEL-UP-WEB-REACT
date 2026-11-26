import { useMemo, useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarritoOffcanvas from "../../components/CarritoOffcanvas/CarritoOffcanvas";
import { formatearPrecio } from "../../data/productos";
import styles from "./Inicio.module.css";
import App_alert from "../../components/alerta/alerta";
import { obtenerProductos } from "../../api/productoApi";

export default function Inicio() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await obtenerProductos();
        setProductos(data || []);
      } catch {
        setMostrarAlerta(true);
        setMensajeAlerta("No se pudieron cargar los productos");
        setTipoAlerta("danger");
      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  // Top 3 ofertas con mayor porcentaje_producto
  const ofertasEspeciales = useMemo(() => {
    return productos
      .filter((p) => p.porcentaje_producto > 0)
      .sort((a, b) => b.porcentaje_producto - a.porcentaje_producto)
      .slice(0, 3);
  }, [productos]);

  const calcularPrecioConDescuento = (producto) => {
    if (!producto.porcentaje_producto) return producto.precio_producto;
    return Math.round(
      producto.precio_producto * (1 - producto.porcentaje_producto / 100)
    );
  };

  const agregarAlCarrito = (producto, precioFinal) => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

    const cantidadEnCarrito = carritoActual.filter(
      (item) => item.codigo === producto.codigo_producto
    ).length;

    if (cantidadEnCarrito >= producto.stock_producto) {
      setMostrarAlerta(true);
      setMensajeAlerta(
        `No puedes agregar más unidades. El stock máximo disponible para "${producto.nombre_producto}" es de ${producto.stock_producto}.`
      );
      setTipoAlerta("danger");
      return;
    }

    const itemAAgregar = {
      codigo: producto.codigo_producto,
      codigo_producto: producto.codigo_producto,
      nombre: producto.nombre_producto,
      precio: precioFinal,
      imagen: producto.imagen_producto,
    };

    const nuevoCarrito = [...carritoActual, itemAAgregar];
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

    window.dispatchEvent(new Event("storage"));

    setMostrarAlerta(true);
    setMensajeAlerta(`"${producto.nombre_producto}" agregado al carrito.`);
    setTipoAlerta("success");
  };

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
        <section id="sec-ofertas" className="py-5">
          <div className="container">
            <h2
              className="mb-4 text-white text-uppercase"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              OFERTAS ESPECIALES <span className={styles.textoNeonVerde}>Top Drops</span>
            </h2>

            {cargando ? (
              <p className="text-secondary">Cargando ofertas...</p>
            ) : ofertasEspeciales.length === 0 ? (
              <p className="text-secondary">No hay ofertas disponibles en este momento</p>
            ) : (
              <div className="row g-4">
                {ofertasEspeciales.map((producto) => {
                  const precioFinal = calcularPrecioConDescuento(producto);
                  return (
                    <div className="col-12 col-md-4" key={producto.codigo_producto}>
                      <div className="card h-100 bg-dark text-white border-secondary position-relative overflow-hidden">
                        <span
                          className="badge position-absolute top-0 end-0 m-2 px-2 py-1"
                          style={{ backgroundColor: "#39FF14", color: "#000000", fontWeight: "bold" }}
                        >
                          -{producto.porcentaje_producto}% OFF
                        </span>
                        <img
                          src={producto.imagen_producto}
                          alt={producto.nombre_producto}
                          className="card-img-top"
                          style={{
                            height: 250,
                            objectFit: "contain",
                            backgroundColor: "#111",
                            padding: 10,
                          }}
                        />
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{producto.nombre_producto}</h5>
                          <div className="my-2">
                            <small className="text-decoration-line-through text-secondary me-2">
                              {formatearPrecio(producto.precio_producto)}
                            </small>
                            <span className="fw-bold fs-5" style={{ color: "#39FF14" }}>
                              {formatearPrecio(precioFinal)}
                            </span>
                          </div>
                          <button
                            type="button"
                            className={`btn mt-auto ${styles.botonAgregar}`}
                            onClick={() => agregarAlCarrito(producto, precioFinal)}
                          >
                            Añadir al Carrito
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-5" id="nosotros">
          <div className="container">
            <div className="row align-items-center g-5">
              <div className="col-12 col-lg-6">
                <h2 className={`mb-3 ${styles.tituloNosotros}`}>Sobre Level-Up Gamer</h2>
                <p className={styles.textoNosotros}>
                  Nacimos como respuesta a la creciente pasión por los videojuegos en Chile,
                  transformándonos en una plataforma dedicada exclusivamente a equipar a la
                  comunidad gamer con tecnología y accesorios de primer nivel.
                </p>
                <p className={styles.textoNosotros}>
                  Aunque operamos sin sucursales físicas, conectamos con jugadores de todo el país a
                  través de envíos rápidos y seguros, llevando lo último en consolas, PC armados,
                  periféricos y ergonomía directo a tu setup.
                </p>

                <ul className="list-unstyled mt-4 d-flex flex-column gap-3">
                  <li className="d-flex align-items-center gap-3">
                    <i className={`bi bi-truck fs-4 ${styles.textoNeonVerde}`}></i>
                    <span>Despachos garantizados a todas las regiones de Chile.</span>
                  </li>
                  <li className="d-flex align-items-center gap-3">
                    <i className={`bi bi-controller fs-4 ${styles.textoNeonVerde}`}></i>
                    <span>Catálogo seleccionado por y para jugadores.</span>
                  </li>
                  <li className="d-flex align-items-center gap-3">
                    <i className={`bi bi-shield-check fs-4 ${styles.textoNeonVerde}`}></i>
                    <span>Garantía y soporte técnico especializado.</span>
                  </li>
                </ul>
              </div>

              <div className="col-12 col-lg-6">
                <div className="d-flex flex-column gap-4">
                  <div className={`p-4 rounded border-secondary ${styles.tarjetaMisionVision}`}>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <i className={`bi bi-bullseye fs-3 ${styles.textoNeonVerde}`}></i>
                      <h4 className={`mb-0 text-white ${styles.subtituloNosotros}`}>Nuestra Misión</h4>
                    </div>
                    <p className="mb-0 text-secondary">
                      Proporcionar productos de alta calidad para gamers en todo Chile, ofreciendo
                      una experiencia de compra única y personalizada, con un enfoque en la
                      satisfacción del cliente y el crecimiento de la comunidad gamer.
                    </p>
                  </div>

                  <div className={`p-4 rounded border-secondary ${styles.tarjetaMisionVision}`}>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <i className={`bi bi-trophy fs-3 ${styles.textoNeonVerde}`}></i>
                      <h4 className={`mb-0 text-white ${styles.subtituloNosotros}`}>Nuestra Visión</h4>
                    </div>
                    <p className="mb-0 text-secondary">
                      Ser la tienda online líder en productos para gamers en Chile, reconocida por
                      su innovación, servicio al cliente excepcional, y un programa de fidelización
                      basado en gamificación que recompense a nuestros clientes más fieles.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}