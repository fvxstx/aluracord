import { Box, Button, Text, TextField, Image } from "@skynexui/components";

export default function NotFound() {
  return (
    <>
      <div>
        <h1>404</h1>
        <p>Essa página aqui não é a certa não</p>

        <a href="/">Voltar para o inicio</a>
      </div>

      <style jsx>{`
        div {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
      `}</style>
    </>
  );
}
