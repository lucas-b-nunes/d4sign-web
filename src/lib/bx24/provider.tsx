"use client";

import Script from "next/script";
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

type Bx24ContextValue = {
  ready: boolean;
  callMethod: <T = unknown>(
    method: string,
    params?: Record<string, unknown>,
  ) => Promise<T>;
  fitWindow: () => void;
};

const Bx24Context = createContext<Bx24ContextValue | null>(null);

declare global {
  interface Window {
    BX24?: {
      init: (cb: () => void) => void;
      callMethod: (
        method: string,
        params: Record<string, unknown>,
        cb: (result: { data: () => unknown }) => void,
      ) => void;
      fitWindow: () => void;
    };
  }
}

export function Bx24Provider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  const callMethod = useCallback(
    <R,>(method: string, params: Record<string, unknown> = {}) =>
      new Promise<R>((resolve, reject) => {
        if (!window.BX24) {
          reject(new Error("BX24 não carregado"));
          return;
        }
        window.BX24.callMethod(method, params, (result) => {
          try {
            resolve(result.data() as R);
          } catch (e) {
            reject(e);
          }
        });
      }),
    [],
  );

  const fitWindow = useCallback(() => {
    window.BX24?.fitWindow();
  }, []);

  return (
    <>
      <Script
        src="https://api.bitrix24.com/api/v1/"
        strategy="afterInteractive"
        onLoad={() => {
          window.BX24?.init(() => setReady(true));
        }}
      />
      <Bx24Context.Provider value={{ ready, callMethod, fitWindow }}>
        {children}
      </Bx24Context.Provider>
    </>
  );
}

export function useBx24() {
  const ctx = useContext(Bx24Context);
  if (!ctx) throw new Error("useBx24 deve ser usado dentro de Bx24Provider");
  return ctx;
}
