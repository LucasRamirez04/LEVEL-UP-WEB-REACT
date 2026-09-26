import { CarritoProvider } from "./context/CarritoContext";
import { ProductosProvider } from "./context/ProductosContext";
import { UsuariosProvider } from "./context/UsuariosContext";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import CarritoOffcanvas from "./components/CarritoOffcanvas/CarritoOffcanvas";
import AppRoutes from "./routes";

export default function App() {
  return (
    <ProductosProvider>
      <UsuariosProvider>
        <CarritoProvider>
          <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <main className="flex-grow-1 contenedor-principal">
              <AppRoutes />
            </main>
            <Footer />
            <CarritoOffcanvas />
          </div>
        </CarritoProvider>
      </UsuariosProvider>
    </ProductosProvider>
  );
}
