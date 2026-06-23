import { useRef, useState, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";

const ACCEPTED = [".pdf"];
const MAX_SIZE_MB = 10;

export default function Principal() {
  const [file, setFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [areaEmisora, setAreaEmisora] = useState("");
  const [qrPosicion, setQrPosicion] = useState("superior-derecha");

  const [qrValue, setQrValue] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [dragging, setDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2400);
  };

  const validate = (f: File) => {
    if (!f) return "Selecciona un documento";
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) return `Solo se permiten archivos PDF`;
    if (f.size > MAX_SIZE_MB * 1024 * 1024) return `Máx. ${MAX_SIZE_MB}MB`;
    return "";
  };

  const handleFile = (f: File | undefined) => {
    if (!f) return;
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

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleGenerarQr = async () => {
    if (!file) {
      setError("Sube un documento primero");
      return;
    }
    if (!titulo || !tipoDocumento || !areaEmisora) {
      setError("Completa todos los campos del formulario");
      return;
    }

    setIsUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("titulo", titulo);
      formData.append("tipoDocumento", tipoDocumento);
      formData.append("areaEmisora", areaEmisora);
      formData.append("qrPosicion", qrPosicion);

      const token = localStorage.getItem('token');

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al subir el archivo");
      }

      // Simular la url de ruta publica del documento sellado de la fes 
      const link = `${window.location.origin}/v/${data.folio}`;
      setQrValue(link);
      showToast("Documento procesado correctamente");
    } catch (err: any) {
      setError(err.message || "Error al procesar el documento");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setTitulo("");
    setTipoDocumento("");
    setAreaEmisora("");
    setQrPosicion("superior-derecha");
    setQrValue("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-stone-50 text-neutral-900 selection:bg-neutral-900 selection:text-stone-50">
      <div
        className={`fixed top-6 right-6 z-50 transform transition-[opacity,transform] duration-300 ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
      >
        <div className="bg-neutral-900 text-stone-50 text-xs tracking-wider uppercase px-5 py-3 rounded-sm shadow-lg">
          {toast}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12 border-b border-neutral-200 pb-8">
          <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">
            Registro de Documento
          </p>
          <h1 className="text-4xl sm:text-5xl font-light tracking-[0.1em] font-serif">
            NUEVA VALIDACIÓN
          </h1>
        </header>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Columna Izquierda: Formulario */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Título del Documento</label>
              <input type="text" value={titulo} onChange={e => setTitulo(e.target.value)} className="w-full border border-neutral-300 p-3 text-sm bg-white" placeholder="Ej. Acta Constitutiva" />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Tipo de Documento</label>
              <input type="text" value={tipoDocumento} onChange={e => setTipoDocumento(e.target.value)} className="w-full border border-neutral-300 p-3 text-sm bg-white" placeholder="Ej. Legal, Administrativo" />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Área Emisora</label>
              <input type="text" value={areaEmisora} onChange={e => setAreaEmisora(e.target.value)} className="w-full border border-neutral-300 p-3 text-sm bg-white" placeholder="Ej. Dirección General" />
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">Posición del QR</label>
              <select value={qrPosicion} onChange={e => setQrPosicion(e.target.value)} className="w-full border border-neutral-300 p-3 text-sm bg-white">
                <option value="superior-derecha">Superior Derecha</option>
                <option value="superior-izquierda">Superior Izquierda</option>
                <option value="inferior-derecha">Inferior Derecha</option>
                <option value="inferior-izquierda">Inferior Izquierda</option>
                <option value="ultima-pagina">Última página inferior derecha</option>
              </select>
            </div>
          </div>

          {/* Columna Derecha: Archivo y Acción */}
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`group relative cursor-pointer border border-dashed rounded-sm p-10 text-center transition-colors duration-200 mb-6
                ${dragging ? "border-neutral-900 bg-stone-100" : "border-neutral-300 hover:border-neutral-900 hover:bg-stone-100/60"}`}
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
                  <p className="text-sm text-neutral-700">Arrastra tu PDF aquí o selecciona</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-mono">Solo PDF — máx {MAX_SIZE_MB}MB</p>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 text-left">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 border border-neutral-900 flex items-center justify-center text-[10px] font-mono bg-neutral-900 text-white">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm truncate">{file.name}</p>
                      <p className="text-xs font-mono text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-xs uppercase text-red-500 hover:text-red-700">Quitar</button>
                </div>
              )}
            </div>

            {error && <p className="mb-6 text-xs text-red-600 font-mono">→ {error}</p>}

            <button
              type="button"
              onClick={handleGenerarQr}
              disabled={!file || isUploading}
              className="w-full flex items-center justify-between gap-8 bg-neutral-900 text-stone-50 px-8 py-4 text-xs tracking-[0.3em] uppercase disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
            >
              <span>{isUploading ? "Procesando documento..." : "Generar y Sellar Documento"}</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Resultado */}
        {qrValue && (
          <section className="mt-16 animate-[fadeIn_0.6s_ease-out] border-t border-neutral-200 pt-12">
            <h2 className="text-2xl font-light tracking-[0.1em] font-serif mb-8">Proceso Completado</h2>

            <div className="bg-white p-8 border border-neutral-200 flex flex-col sm:flex-row gap-8 items-center">
              <div ref={qrRef} className="bg-white p-2 border border-neutral-200">
                <QRCodeCanvas value={qrValue} size={150} level="H" />
              </div>
              <div>
                <p className="text-sm text-neutral-600 mb-4">El documento ha sido sellado y registrado. Puedes escanear este código o copiar el enlace público de validación.</p>

                <div className="mb-6 p-3 bg-stone-50 border border-neutral-200 rounded-sm">
                  <p className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1">Enlace Público</p>
                  <a href={qrValue} target="_blank" rel="noreferrer" className="text-sm font-mono text-blue-600 hover:underline break-all">
                    {qrValue}
                  </a>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => { navigator.clipboard.writeText(qrValue); showToast("Enlace copiado"); }} className="text-xs tracking-[0.2em] uppercase border border-neutral-900 px-6 py-3 hover:bg-neutral-900 hover:text-stone-50 transition-colors">
                    Copiar Enlace
                  </button>
                  <button onClick={reset} className="text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors">
                    Registrar Nuevo
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

