import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Pular na primeira renderização para evitar scroll desnecessário
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Usar requestAnimationFrame para garantir que o DOM foi atualizado
    requestAnimationFrame(() => {
      // Tentar múltiplos métodos para garantir compatibilidade
      try {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch (e) {
        // Fallback silencioso
      }
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
