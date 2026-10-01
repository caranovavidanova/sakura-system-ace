import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("mostra o título do painel e a leva em construção", () => {
    const html = renderToString(<App />);
    expect(html).toContain("Painel da Sakura");
    expect(html).toContain("Em construção: leva 0");
  });
});
