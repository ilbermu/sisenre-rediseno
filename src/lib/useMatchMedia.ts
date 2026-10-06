import { useState, useEffect } from "react";

// Sigue una media query en vivo (matchMedia + listener de "change") — usado
// para el acordeón del sidebar en tier 760px (ver App): a diferencia de una
// clase Tailwind condicionada por CSS, acá el breakpoint tiene que cambiar
// comportamiento real (qué grupo se auto-expande, qué handler navega vs.
// solo despliega), no nada más apariencia.
export function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}
