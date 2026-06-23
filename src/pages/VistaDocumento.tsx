import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from 'react';

export default function VistaDocumento() {
    const { id } = useParams(); // id es el folio
    const navigate = useNavigate();
    const currentUrl = window.location.href;

    const [loading, setLoading] = useState(true);
    const [docInfo, setDocInfo] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchValidacion = async () => {
            try {
                const res = await fetch(`/api/validar/${id}`);
                const data = await res.json();
                
                if (!res.ok) {
                    throw new Error(data.error || 'No se pudo validar el documento');
                }
                setDocInfo(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchValidacion();
        }
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-stone-50"><p className="tracking-widest uppercase text-xs text-neutral-500">Validando documento...</p></div>;
    }

    if (error || !docInfo) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 p-6 text-center">
                <div className="w-20 h-20 bg-red-100 text-red-600 flex items-center justify-center rounded-full mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <h1 className="text-3xl font-serif mb-4">Documento No Encontrado</h1>
                <p className="text-neutral-500 max-w-md mb-8">{error || 'El folio proporcionado no existe en nuestra base de datos.'}</p>
                <button onClick={() => navigate('/')} className="text-xs tracking-widest uppercase bg-neutral-900 text-stone-50 px-8 py-4 hover:bg-neutral-700">Ir al Inicio</button>
            </div>
        );
    }

    const isVigente = docInfo.estado.toLowerCase() === 'vigente';

    return (
        <div className="min-h-screen flex flex-col bg-stone-50">
            <div className="bg-white p-6 border-b border-neutral-200 shadow-sm flex items-center justify-between flex-wrap gap-6">
                <div>
                    <h2 className="text-2xl font-light tracking-[0.1em] font-serif mb-1">
                        Validación Pública
                    </h2>
                    <p className="text-xs tracking-[0.2em] uppercase text-neutral-500 mb-4">Folio: {docInfo.folio}</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="text-xs tracking-[0.2em] uppercase border border-neutral-300 text-neutral-700 px-6 py-2 hover:bg-stone-100 transition-colors"
                    >
                        Volver
                    </button>
                </div>
                <div className="flex gap-8">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] tracking-widest uppercase text-neutral-400 mb-1">Estado</span>
                        <span className={`px-4 py-1 text-xs tracking-widest uppercase font-bold text-white ${isVigente ? 'bg-green-600' : 'bg-red-600'}`}>
                            {docInfo.estado}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 border border-neutral-200 p-2 bg-stone-50 rounded-sm">
                        <QRCodeCanvas value={currentUrl} size={50} level="H" />
                        <div className="text-[10px] text-neutral-500 w-20 leading-tight uppercase tracking-widest">
                            Enlace Directo
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-start p-6 bg-stone-100">
                <div className="w-full max-w-4xl mb-6 bg-white p-6 border border-neutral-200 shadow-sm flex flex-wrap justify-between gap-6">
                    <div>
                        <p className="text-[10px] tracking-widest uppercase text-neutral-400">Título</p>
                        <p className="text-lg font-serif">{docInfo.titulo}</p>
                    </div>
                    <div>
                        <p className="text-[10px] tracking-widest uppercase text-neutral-400">Tipo</p>
                        <p className="text-sm">{docInfo.tipo_documento}</p>
                    </div>
                    <div>
                        <p className="text-[10px] tracking-widest uppercase text-neutral-400">Área</p>
                        <p className="text-sm">{docInfo.area_emisora}</p>
                    </div>
                </div>

                <div className="w-full max-w-4xl bg-white shadow-md border border-neutral-200 rounded-sm overflow-hidden flex flex-col items-center justify-center" style={{ minHeight: '75vh' }}>
                    {isVigente ? (
                        <iframe src={`/uploads/${docInfo.ruta_pdf}`} title="Visor de Documento" className="w-full h-full flex-grow" style={{ minHeight: '75vh' }}></iframe>
                    ) : (
                        <div className="text-center p-10 flex flex-col items-center">
                            <div className="w-20 h-20 bg-red-100 text-red-600 flex items-center justify-center rounded-full mb-6">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-serif text-neutral-800 mb-2">Documento {docInfo.estado}</h3>
                            <p className="text-neutral-500 mb-8 max-w-sm">Este documento ya no tiene validez legal o fue revocado por la entidad emisora.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}