import { useMemo, useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarritoOffcanvas from "../../components/CarritoOffcanvas/CarritoOffcanvas";
import { productosIniciales as listaProductosBase, calcularPrecioFinal, formatearPrecio } from "../../data/productos";
import styles from "./Inicio.module.css";
import App_alert from "../../components/alerta/alerta";

export default function Inicio() {
  const [productos, setProductos] = useState([]);
  
  //constantes para implementar alerta
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

  // Top 3 ofertas con mayor descuento
  const ofertasEspeciales = useMemo(() => {
    return productos
      .filter((p) => p.enOferta)
      .sort((a, b) => b.descuento - a.descuento)
      .slice(0, 3);
  }, [productos]);

const agregarAlCarrito = (producto, precioFinal) => {
  // 1. Obtener los productos que ya están en el carrito
  const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

  // 2. Contar cuántas veces se ha agregado ESTE producto específico al carrito
  const cantidadEnCarrito = carritoActual.filter(
    (item) => item.codigo === producto.codigo
  ).length;

  // 3. Validar si supera el stock del producto
  if (cantidadEnCarrito >= producto.stock) {
    setMostrarAlerta(true);
    setMensajeAlerta(`No puedes agregar más unidades. El stock máximo disponible para "${producto.nombre}" es de ${producto.stock}.`);
    setTipoAlerta("danger")
    //alert(`No puedes agregar más unidades. El stock máximo disponible para "${producto.nombre}" es de ${producto.stock}.`);
    return;
  }

  // 4. Si hay stock disponible, creamos el item y lo guardamos
  const itemAAgregar = {
    codigo: producto.codigo,
    nombre: producto.nombre,
    precio: precioFinal,
    imagen: producto.imagen,
  };

  const nuevoCarrito = [...carritoActual, itemAAgregar];
  localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

  // 5. Notificar al Navbar para actualizar el badge de contador
  window.dispatchEvent(new Event("storage"));
  
  setMostrarAlerta(true);
  setMensajeAlerta(`"${producto.nombre}" agregado al carrito.`);
  setTipoAlerta("success")
  //alert(`"${producto.nombre}" agregado al carrito.`);
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

            <div className="row g-4">
              {ofertasEspeciales.map((producto) => {
                const precioFinal = calcularPrecioFinal(producto);
                return (
                  <div className="col-12 col-md-4" key={producto.codigo}>
                    <div className="card h-100 bg-dark text-white border-secondary position-relative overflow-hidden">
                      <span
                        className="badge position-absolute top-0 end-0 m-2 px-2 py-1"
                        style={{ backgroundColor: "#39FF14", color: "#000000", fontWeight: "bold" }}
                      >
                        -{producto.descuento}% OFF
                      </span>
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="card-img-top"
                        style={{
                          height: 250,
                          objectFit: "contain",
                          backgroundColor: "#111",
                          padding: 10,
                        }}
                      />
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{producto.nombre}</h5>
                        <div className="my-2">
                          <small className="text-decoration-line-through text-secondary me-2">
                            {formatearPrecio(producto.precio)}
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