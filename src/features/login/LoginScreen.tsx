import { useState } from "react";
import { Loader2 } from "lucide-react";
import imgLoginBg from "@/imports/Login/login-bg.png";
import Logo from "@/imports/Logo/index";
import { FIELD_FOCUS, ICON } from "@/components/ui";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (usuario === "rdellamagiora" && password === "1234") {
      setLoading(true);
      setTimeout(onLogin, 600);
    } else {
      setError("Usuario o contraseña incorrectos.");
    }
  }

  const inputCls = `w-full px-[8px] py-[12px] [@media(max-height:760px)]:py-[var(--login-input-py,12px)] border border-border-strong rounded-sm bg-surface ${FIELD_FOCUS} transition-[border-color,box-shadow,background-color]`;
  const inputStyle: React.CSSProperties = { letterSpacing: "0.14px" };
  const labelStyle: React.CSSProperties = { letterSpacing: "0.14px" };

  return (
    <div className="relative w-full h-screen overflow-hidden flex">
      {/* Background image */}
      <img src={imgLoginBg} alt="" className="absolute inset-0 size-full object-cover pointer-events-none" />

      {/* Left half: branding */}
      <div className="relative flex-1 flex flex-col justify-center" style={{ padding: "100px" }}>
        <div style={{ filter: "brightness(0) invert(1)", width: 272 }}>
          <Logo />
        </div>
        <div style={{ marginTop: 50 }}>
          <p className="font-sans text-display" style={{ color: "white" }}>SISENRE</p>
          <p className="font-sans text-display" style={{ color: "white" }}>Calidad de servicio</p>
        </div>
      </div>

      {/* Right half: 600px card, top aligned ~15px below logo. Todo el
          padding/gap de acá abajo es en px inline (no clases Tailwind), así
          que no participa de --spacing — cada valor que aporta alto
          vertical usa var(--login-*, valor-normal) para poder achicarse en
          tier 760px (ver index.css) sin tocar el tamaño normal. */}
      <div className="relative flex-1 flex flex-col" style={{ paddingTop: "var(--login-top-offset, calc(38vh + 15px))" }}>
        <div className="bg-surface rounded-tl-lg rounded-tr-lg flex flex-col overflow-hidden flex-1 min-h-0" style={{ width: 600, margin: "0 auto" }}>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0" style={{ paddingTop: "var(--login-form-pt, 60px)", paddingLeft: 32, paddingRight: 32, paddingBottom: "var(--login-form-pb, 32px)" }}>
            {/* Header */}
            <div className="flex flex-col gap-[8px] [@media(max-height:760px)]:gap-[var(--login-header-gap,8px)] shrink-0">
              <p className="font-sans text-heading-lg" style={{ color: "var(--color-secondary)" }}>Bienvenido </p>
              <p className="font-sans text-body-lg text-text" style={{ letterSpacing: "0.16px" }}>Ingresá tu usuario y contraseña</p>
            </div>

            {/* Inputs */}
            <div className="flex flex-col shrink-0" style={{ marginTop: "var(--login-inputs-mt, 24px)", gap: "var(--login-inputs-gap, 32px)" }}>
              <div className="flex flex-col gap-[4px]">
                <label className="font-sans text-body-lg text-text" style={labelStyle}>Usuario</label>
                <input type="text" autoComplete="username" value={usuario} onChange={e => { setUsuario(e.target.value); setError(""); }} className={inputCls + " font-sans text-body-lg text-text"} style={inputStyle} />
              </div>
              <div className="flex flex-col gap-[4px]">
                <label className="font-sans text-body-lg text-text" style={labelStyle}>Contraseña</label>
                <input type="password" autoComplete="current-password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} className={inputCls + " font-sans text-body-lg text-text"} style={inputStyle} />
              </div>
            </div>

            {error && (
              <p className="mt-3 shrink-0 text-body-sm text-error-text-strong bg-error-bg-subtle border border-error-border-subtle rounded-sm px-3 py-2">{error}</p>
            )}

            {/* Button */}
            <div className="shrink-0" style={{ marginTop: "var(--login-button-mt, 32px)" }}>
              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-sm text-white bg-primary-strong hover:bg-primary-hover disabled:pointer-events-none active:scale-[0.99] transition-[color,background-color,border-color,transform] font-sans text-body font-medium"
                style={{
                  paddingTop: "var(--login-button-py, 12px)", paddingBottom: "var(--login-button-py, 12px)", paddingLeft: 24, paddingRight: 24,
                }}
              >
                {loading && <Loader2 size={ICON.md} strokeWidth={1.5} className="animate-spin shrink-0" aria-hidden />}
                {loading ? "Ingresando…" : "Confirmar"}
              </button>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Footer */}
            <div className="shrink-0 text-center">
              <p className="font-sans text-body-sm text-text-muted" style={{ letterSpacing: "1px" }}>© Desarrollos propios 2026</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
