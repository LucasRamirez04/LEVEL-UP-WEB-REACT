import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
  Badge,
} from "react-bootstrap";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import CarritoOffcanvas from "../../components/CarritoOffcanvas/CarritoOffcanvas";
import App_alert from "../../components/alerta/alerta";
import { formatearPrecio } from "../../data/productos";
import styles from "./Pago.module.css";

export default function Pago() {
  // Estados originales de la vista de pago
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("credito");
  const [estadoSimulacion, setEstadoSimulacion] = useState("exito"); // "exito" o "error"
  const [resultadoPago, setResultadoPago] = useState(null); // null | "aprobado" | "rechazado"

  // Constantes para implementar alerta reutilizable
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  const totalPagar = carrito.reduce((acc, item) => acc + (item.precio || 0), 0);

  function handleProcesarPago(e) {
    e.preventDefault();

    if (estadoSimulacion === "exito") {
      // 1. Vaciar el carrito en localStorage
      localStorage.setItem("carrito", JSON.stringify([]));
      
      // 2. Disparar evento para actualizar Navbar/Offcanvas
      window.dispatchEvent(new Event("storage"));
      setCarrito([]);
      setResultadoPago("aprobado");

      // 3. Disparar Alerta de Éxito
      setMostrarAlerta(true);
      setMensajeAlerta("¡Pago Aprobado con Éxito! Tu orden ha sido procesada correctamente.");
      setTipoAlerta("success");
    } else {
      // Flujo de error simulado
      setResultadoPago("rechazado");

      // Disparar Alerta de Error
      setMostrarAlerta(true);
      setMensajeAlerta("Pago Rechazado. Fondos insuficientes o tarjeta denegada.");
      setTipoAlerta("danger");
    }
  }

  function handleReintentar() {
    setResultadoPago(null);
    setMostrarAlerta(false);
  }

  return (
    <>
      <Navbar />
      <CarritoOffcanvas />

      {/* Contenedor flotante para la alerta (Igual que en Inicio.jsx) */}
      <div style={{ position: "fixed", top: "90px", right: "20px", zIndex: 1060, maxWidth: "400px" }}>
        <App_alert
          mostrarAlert={mostrarAlerta}
          cerrarAlert={() => setMostrarAlerta(false)}
          variant={tipoAlerta}
          msgAlert={mensajeAlerta}
        />
      </div>

      <main className={`flex-grow-1 ${styles.contenedorPago}`}>
        <Container>
          <div className="mb-4 pb-2 border-bottom border-secondary">
            <h2 className={`text-white mb-0 ${styles.tituloGamer}`}>
              Pasarela de Pago (Simulación)
            </h2>
            <small className="text-secondary">
              Simulador de transacciones seguras Webpay / Redcompra
            </small>
          </div>

          {/* Pantalla de Éxito */}
          {resultadoPago === "aprobado" && (
            <Card className="text-center p-5 bg-dark border-success shadow-lg">
              <Card.Body>
                <i className="bi bi-check-circle-fill display-1 text-success mb-3 d-block"></i>
                <h3 className="text-white fw-bold mb-3">Transacción Completada</h3>
                <p className="text-white-50 mb-4">
                  Hemos enviado el comprobante electrónico a tu correo registrado.
                  Gracias por preferir Level-Up Gamer.
                </p>
                <Link to="/" className="btn btn-success fw-bold px-4 py-2">
                  <i className="bi bi-house-door-fill me-2"></i>Volver al Inicio
                </Link>
              </Card.Body>
            </Card>
          )}

          {/* Pantalla de Error */}
          {resultadoPago === "rechazado" && (
            <Card className="text-center p-5 bg-dark border-danger shadow-lg">
              <Card.Body>
                <i className="bi bi-x-circle-fill display-1 text-danger mb-3 d-block"></i>
                <h3 className="text-white fw-bold mb-3">Transacción Fallida</h3>
                <p className="text-white-50 mb-4">
                  No pudimos procesar la transacción. Por favor verifica tus fondos o intenta con otro medio de pago.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="danger" onClick={handleReintentar} className="fw-bold px-4 py-2">
                    <i className="bi bi-arrow-clockwise me-2"></i>Reintentar Pago
                  </Button>
                  <Link to="/" className="btn btn-outline-light px-4 py-2">
                    Cancelar
                  </Link>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Formulario Principal (Solo visible si no se ha pagado aún) */}
          {resultadoPago === null && (
            <Row className="g-4">
              <Col lg={7}>
                <Card className={`p-4 text-white ${styles.tarjetaPago}`}>
                  <h5 className="text-success mb-3">
                    <i className="bi bi-credit-card-2-front me-2"></i>Datos de Pago
                  </h5>
                  <Form onSubmit={handleProcesarPago}>
                    {/* Switch de Simulación */}
                    <div className="p-3 mb-3 rounded bg-dark border border-warning">
                      <Form.Label className="small fw-bold text-warning d-block">
                        <i className="bi bi-gear-fill me-1"></i>Opciones del Simulador:
                      </Form.Label>
                      <Form.Check
                        type="radio"
                        id="sim-exito"
                        name="simulacion"
                        label="Simular pago APROBADO (Éxito)"
                        checked={estadoSimulacion === "exito"}
                        onChange={() => setEstadoSimulacion("exito")}
                        className="text-white small mb-1"
                      />
                      <Form.Check
                        type="radio"
                        id="sim-error"
                        name="simulacion"
                        label="Simular pago RECHAZADO (Error / Sin saldo)"
                        checked={estadoSimulacion === "error"}
                        onChange={() => setEstadoSimulacion("error")}
                        className="text-white small"
                      />
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label className="small text-secondary">Método de Pago</Form.Label>
                      <Form.Select
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="form-select-sm"
                      >
                        <option value="credito">Tarjeta de Crédito (Webpay)</option>
                        <option value="debito">Tarjeta de Débito (Redcompra)</option>
                        <option value="transferencia">Transferencia Bancaria</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="small text-secondary">Nombre del Titular</Form.Label>
                      <Form.Control
                        type="text"
                        size="sm"
                        placeholder="Ej: Juan Pérez"
                        defaultValue="Juan Pérez"
                        required
                      />
                    </Form.Group>

                    <Row className="g-2 mb-3">
                      <Col xs={8}>
                        <Form.Label className="small text-secondary">Número de Tarjeta</Form.Label>
                        <Form.Control
                          type="text"
                          size="sm"
                          placeholder="1234 5678 9101 1121"
                          defaultValue="4567 8901 2345 6789"
                          required
                        />
                      </Col>
                      <Col xs={4}>
                        <Form.Label className="small text-secondary">CVV</Form.Label>
                        <Form.Control
                          type="password"
                          size="sm"
                          maxLength={3}
                          placeholder="123"
                          defaultValue="123"
                          required
                        />
                      </Col>
                    </Row>

                    <Button
                      type="submit"
                      variant="success"
                      className="w-100 fw-bold py-2 mt-2"
                      disabled={carrito.length === 0}
                    >
                      {carrito.length === 0
                        ? "Carrito Vacío"
                        : `Pagar ${formatearPrecio(totalPagar)}`}
                    </Button>
                  </Form>
                </Card>
              </Col>

              <Col lg={5}>
                <Card className={`p-4 text-white ${styles.tarjetaPago}`}>
                  <h5 className="text-info mb-3">
                    <i className="bi bi-receipt me-2"></i>Resumen de la Orden
                  </h5>

                  {carrito.length === 0 ? (
                    <p className="text-secondary small">No hay productos en el carrito.</p>
                  ) : (
                    <ListGroup variant="flush" className="mb-3">
                      {carrito.map((item, idx) => (
                        <ListGroup.Item
                          key={idx}
                          className="bg-transparent text-white border-secondary px-0 d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <span className="small d-block fw-semibold">{item.nombre}</span>
                            <small className="text-secondary">{item.codigo}</small>
                          </div>
                          <Badge bg="success" className="text-dark">
                            {formatearPrecio(item.precio)}
                          </Badge>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}

                  <div className={`p-3 text-white ${styles.resumenTotal}`}>
                    <div className="d-flex justify-content-between small text-secondary mb-1">
                      <span>Artículos:</span>
                      <span>{carrito.length}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold fs-5 text-white">
                      <span>Total:</span>
                      <span className="text-success">{formatearPrecio(totalPagar)}</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </main>

      <Footer />
    </>
  );
}