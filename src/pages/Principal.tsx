import { useRef, useState, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";

const ACCEPTED = [".pdf", ".docx", ".jpg", ".jpeg"];
const MAX_SIZE_MB = 10;

export default function Principal() {
  const [file, setFile] = useState(null);
  const [qrValue, setQrValue] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const qrRef = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const validate = (f) => {
    if (!f) return "Selecciona un documento";
    const ext = "." + f.name.split(".").pop().toLowerCase();
    if (!ACCEPTED.includes(ext)) return `Formato no permitido (${ACCEPTED.join(", ")})`;
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return `Máx. ${MAX_SIZE_MB}MB`;
    return "";
  };

  const handleFile = (f) => {
    const err = validate(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
    setQrValue("");
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  }, []);

  const [isUploading, setIsUploading] = useState(false);

  const handleGenerarQr = async () => {
    if (!file) {
      setError("Sube un documento primero");
      return;
    }
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir el archivo");
      }

      const data = await response.json();
      const link = `${window.location.origin}/v/${data.filename}`;
      setQrValue(link);
      showToast("QR generado correctamente");
    } catch (err) {
      setError("Error al procesar el documento");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `qr-${file.name.replace(/\.[^.]+$/, "")}.png`;
    a.click();
    showToast("QR descargado");
  };

  const reset = () => {
    setFile(null);
    setQrValue("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 selection:bg-neutral-900 selection:text-stone-50">
      {/* Toast */}
      <div
        className={`fixed top-6 right-6 z-50 transform transition-[opacity,transform] duration-300 ${
          toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-neutral-900 text-stone-50 text-xs tracking-wider uppercase px-5 py-3 rounded-sm shadow-lg">
          {toast}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-20 sm:py-28">
        {/* Header */}
        <header className="mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">
            Documento · Paso 01
          </p>
          <h1
            className="text-5xl sm:text-6xl font-light tracking-[0.15em] leading-none"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            VALIDACIÓN
          </h1>
          <div className="mt-6 h-px w-16 bg-neutral-900" />
          <p className="mt-6 text-sm text-neutral-600 max-w-md leading-relaxed">
            Sube tu documento y genera un código QR temporal para validarlo de forma segura.
          </p>
        </header>

        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`group relative cursor-pointer border border-dashed rounded-sm p-10 sm:p-14 text-center transition-colors duration-200
            ${dragging ? "border-neutral-900 bg-stone-100" : "border-neutral-300 hover:border-neutral-900 hover:bg-stone-100/60"}
            ${error ? "border-red-400" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="hidden"
          />

          {!file ? (
            <div className="flex flex-col items-center gap-3">
              <svg className="w-8 h-8 text-neutral-400 group-hover:text-neutral-900 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M12 4v12m0-12l-4 4m4-4l4 4M4 20h16" />
              </svg>
              <p className="text-sm text-neutral-700">
                Arrastra tu archivo aquí o <span className="underline underline-offset-4">selecciónalo</span>
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-mono">
                PDF · DOCX · JPG — máx {MAX_SIZE_MB}MB
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 border border-neutral-900 flex items-center justify-center text-[10px] font-mono">
                  {("." + file.name.split(".").pop()).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm truncate">{file.name}</p>
                  <p className="text-xs font-mono text-neutral-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); reset(); }}
                className="text-xs tracking-wider uppercase text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                Cambiar
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="mt-4 text-xs text-red-600 font-mono">→ {error}</p>
        )}

        {/* Action */}
        <button
          type="button"
          onClick={handleGenerarQr}
          disabled={!file || isUploading}
          className="mt-10 group relative w-full sm:w-auto inline-flex items-center justify-between gap-8 bg-neutral-900 text-stone-50 px-8 py-4 text-xs tracking-[0.3em] uppercase
                     disabled:bg-neutral-300 disabled:cursor-not-allowed
                     hover:bg-neutral-700 transition-colors duration-200"
        >
          <span>{isUploading ? "Subiendo..." : "Generar código QR"}</span>
          <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
        </button>

        {/* QR result */}
        {qrValue && (
          <section className="mt-20 animate-[fadeIn_0.6s_ease-out]">
            <div className="flex items-baseline justify-between mb-8">
              <h2
                className="text-2xl font-light tracking-[0.1em]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Código generado
              </h2>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                Temporal
              </span>
            </div>

            <div className="grid sm:grid-cols-[auto,1fr] gap-8 items-start border-t border-neutral-200 pt-8">
              <div ref={qrRef} className="bg-white p-4 border border-neutral-200">
                <QRCodeCanvas value={qrValue} size={180} level="H" />
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-2">Enlace</p>
                  <p className="text-xs font-mono break-all text-neutral-700 leading-relaxed">
                    {qrValue}
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleDownload}
                    className="text-xs tracking-[0.2em] uppercase border border-neutral-900 px-5 py-3 hover:bg-neutral-900 hover:text-stone-50 transition-colors"
                  >
                    Descargar PNG
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(qrValue);
                      showToast("Enlace copiado");
                    }}
                    className="text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                     Copiar
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

