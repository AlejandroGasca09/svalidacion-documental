function VistaQR() {
    // Puedes cambiar esta URL por el enlace o texto que quieres en tu QR
    const qrData = "https://tusitio.com/medallero";
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black/50 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center text-center max-w-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Código QR</h1>
                <p className="text-gray-600 mb-6">
                    Escanea este código para acceder directamente.
                </p>
                
                {/* Imagen del QR Generada Dinámicamente */}
                <div className="bg-gray-100 p-4 rounded-xl mb-6">
                    <img 
                        src={qrImageUrl} 
                        alt="Código QR del Medallero" 
                        className="w-48 h-48 object-contain"
                    />
                </div>

                <button 
                    onClick={() => window.history.back()}
                    className="bg-[#2D2A26] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#1a1815] transition-colors"
                >
                    Volver
                </button>
            </div>
        </div>
    );
}

export default VistaQR;