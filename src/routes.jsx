import { Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio/Inicio";
import Catalogo from "./pages/Catalogo/Catalogo";
import DetalleProducto from "./pages/DetalleProducto/DetalleProducto";
import Comunidad from "./pages/Comunidad/Comunidad";
import DetalleComunidad from "./pages/DetalleComunidad/DetalleComunidad";
import Contacto from "./pages/Contacto/Contacto";
import InicioSesion from "./pages/InicioSesion/InicioSesion";
import RegistroUsuario from "./pages/RegistroUsuario/RegistroUsuario";
import Administrador from "./pages/Administrador/Administrador";
import Pago from "./pages/Pago/Pago";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/productos" element={<Catalogo />} />
      <Route path="/productos/:codigo" element={<DetalleProducto />} />
      <Route path="/comunidad" element={<Comunidad />} />
      <Route path="/comunidad/:casoId" element={<DetalleComunidad />} />
      <Route path="/contacto" element={<Contacto />} />
      <Route path="/login" element={<InicioSesion />} />
      <Route path="/registro" element={<RegistroUsuario />} />
      <Route path="/administrador" element={<Administrador />} />
      <Route path="/pago" element={<Pago />} />
    </Routes>
  );
}
