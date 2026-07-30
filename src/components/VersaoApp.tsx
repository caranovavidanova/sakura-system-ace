export function VersaoApp() {
  const versao = window.sakuraApp?.version;
  if (!versao) return null;

  return (
    <span className="pointer-events-none fixed bottom-2 right-3 z-50 text-[10px] text-sakura-purple-dark/40">
      v{versao}
    </span>
  );
}
