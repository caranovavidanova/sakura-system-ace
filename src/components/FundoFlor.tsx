// Flor decorativa fixa no canto inferior direito, atrás de todo o conteúdo —
// não faz parte do conteúdo que rola (AreaRolavel), então fica parada mesmo
// quando a tela é rolada. Ver PROJETO_STATUS.md.
export function FundoFlor() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}sakura-flor-fundo.png`}
      alt=""
      aria-hidden="true"
      className="pointer-events-none fixed bottom-0 right-0 -z-10 w-[22rem] max-w-[40vw] select-none"
    />
  );
}
