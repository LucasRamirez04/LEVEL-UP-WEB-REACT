import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, expect, test } from "vitest";
import Contacto from "./Contacto";

beforeEach(() => {
  localStorage.clear();
});

function renderizarContacto() {
  render(
    <MemoryRouter>
      <Contacto />
    </MemoryRouter>
  );
}

test("Un correo con dominio no permitido muestra el error de dominio", () => {
  renderizarContacto();

  const correoInput = screen.getByLabelText("Correo electrónico");
  fireEvent.change(correoInput, { target: { value: "javier@hotmail.com" } });

  fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

  expect(
    screen.getByText("Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.")
  ).toBeInTheDocument();
});
