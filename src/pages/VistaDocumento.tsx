import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from "qrcode.react";

export default function VistaDocumento() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Determinar si es PDF, Imagen o Word
    const isImage = id?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/i);
    const isWord = id?.toLowerCase().match(/\.(docx|doc)$/i);
    const fileUrl = `/uploads/${id}`;
    const currentUrl = window.location.href;

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <div className="bg-white p-6 border-b border-neutral-200 shadow-sm flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-light tracking-[0.1em] font-serif mb-2">
                        Documento Validado
                    </h2>
                    <button 
                        onClick={() => navigate('/')}
                        className="text-xs tracking-[0.2em] uppercase bg-neutral-900 text-stone-50 px-6 py-3 hover:bg-neutral-700 transition-colors"
                    >
                        Volver al inicio
                    </button>
                </div>
                <div className="flex items-center gap-4 border border-neutral-200 p-2 bg-stone-50 rounded-sm">
                    <QRCodeCanvas value={currentUrl} size={60} level="H" />
                    <div className="text-xs text-neutral-500 max-w-[120px]">
                        Escanea para ver este documento
                    </div>
                </div>
            </div>
            <div className="flex-grow flex justify-center items-start p-6 bg-stone-100">
                <div className="w-full max-w-4xl bg-white shadow-md border border-neutral-200 rounded-sm overflow-hidden flex flex-col items-center justify-center" style={{ minHeight: '80vh' }}>
                    {isImage ? (
                        <img src={fileUrl} alt="Documento escaneado" className="w-full h-auto object-contain max-h-[85vh]" />
                    ) : isWord ? (
                        <div className="text-center p-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-serif text-neutral-800 mb-2">Documento de Word</h3>
                            <p className="text-neutral-500 mb-8 max-w-sm">Los documentos de Word no pueden visualizarse directamente en el navegador.</p>
                            <a 
                                href={fileUrl} 
                                download 
                                className="inline-flex items-center gap-3 bg-neutral-900 text-stone-50 px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-neutral-700 transition-colors"
                            >
                                Descargar Archivo
                            </a>
                        </div>
                    ) : (
                        <iframe src={fileUrl} title="Visor de Documento" className="w-full h-full flex-grow" style={{ minHeight: '80vh' }}></iframe>
                    )}
                </div>
            </div>
        </div>
    );
}