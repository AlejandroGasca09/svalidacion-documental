import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Documento {
    folio: string;
    titulo: string;
    tipo_documento: string;
    area_emisora: string;
    estado: string;
    fecha_registro: string;
}

export default function Dashboard() {
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const navigate = useNavigate();

    const fetchDocumentos = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/documentos', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al cargar documentos');
            setDocumentos(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocumentos();
    }, []);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2400);
    };

    const handleRevocar = async (folio: string) => {
        if (!window.confirm('¿Estás seguro de que deseas revocar este documento? Esta acción invalidará el código QR y no se puede deshacer.')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/documentos/${folio}/revocar`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al revocar el documento');
            
            showToast('Documento revocado exitosamente');
            // Actualizar la lista local
            setDocumentos(docs => docs.map(d => d.folio === folio ? { ...d, estado: 'Revocado' } : d));
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 text-neutral-900">
            <div
                className={`fixed top-6 right-6 z-50 transform transition-[opacity,transform] duration-300 ${toast ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
            >
                <div className="bg-neutral-900 text-stone-50 text-xs tracking-wider uppercase px-5 py-3 rounded-sm shadow-lg">
                    {toast}
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <header className="mb-12 border-b border-neutral-200 pb-8">
                    <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">
                        Historial de Registros
                    </p>
                    <h1 className="text-4xl sm:text-5xl font-light tracking-[0.1em] font-serif">
                        MIS DOCUMENTOS
                    </h1>
                </header>

                {error && <p className="text-red-500 text-sm mb-6 font-mono">→ {error}</p>}

                {loading ? (
                    <p className="text-sm tracking-widest uppercase text-neutral-500 animate-pulse">Cargando...</p>
                ) : (
                    <div className="bg-white border border-neutral-200 shadow-sm overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-stone-50 border-b border-neutral-200 text-[10px] tracking-widest uppercase text-neutral-500">
                                <tr>
                                    <th className="px-6 py-4 font-normal">Documento</th>
                                    <th className="px-6 py-4 font-normal">Folio</th>
                                    <th className="px-6 py-4 font-normal">Fecha</th>
                                    <th className="px-6 py-4 font-normal">Estado</th>
                                    <th className="px-6 py-4 font-normal text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {documentos.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-neutral-400 text-xs tracking-widest uppercase">
                                            No hay documentos registrados
                                        </td>
                                    </tr>
                                ) : (
                                    documentos.map((doc) => (
                                        <tr key={doc.folio} className="hover:bg-stone-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-serif text-base">{doc.titulo}</p>
                                                <p className="text-[10px] uppercase tracking-wider text-neutral-500">{doc.tipo_documento} · {doc.area_emisora}</p>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-neutral-600">{doc.folio.substring(0, 8)}...</td>
                                            <td className="px-6 py-4 text-xs text-neutral-600">
                                                {new Date(doc.fecha_registro).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-[10px] tracking-widest uppercase font-bold text-white ${doc.estado === 'Vigente' ? 'bg-green-600' : 'bg-red-600'}`}>
                                                    {doc.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-4">
                                                <button 
                                                    onClick={() => navigate(`/v/${doc.folio}`)}
                                                    className="text-xs uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    Ver
                                                </button>
                                                {doc.estado === 'Vigente' && (
                                                    <button 
                                                        onClick={() => handleRevocar(doc.folio)}
                                                        className="text-xs uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        Revocar
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}
