import { QRCodeCanvas } from "qrcode.react";
import { useState } from "react";

function Principal() {

    
    const [qrValue, setQrValue] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleGenerarQr = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); 
        setQrValue(inputValue);
    };

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold px-6 pl-5 mx-auto">Vista Principal de la aplicación</h1>
            <form className="flex flex-col gap-2">
                <div>
                    <label htmlFor="fileUpload" className="px-4 underline">Subir documento:</label>
                    <input type="file" id="fileUpload" name="fileUpload" accept=".pdf,.docx,.jpg"
                     onChange={(e) => setInputValue(e.target.value)} className="border px-2 py-1 rounded" />
                </div>
                <button type="button"className="w-50 inline-block text-white rounded px-4 py-2 bg-blue-500 hover:bg-blue-600"
                    onClick={handleGenerarQr}> Generar código QR
                </button>
            </form>
            {qrValue && ( 
                <div className="mt-6 p-4 border rounded bg-white flex flex-col items-center gap-4 shadow-sm">
                    <h2 className="text-xl font-semibold">Código QR generado:</h2>
                    <QRCodeCanvas value={qrValue} size={180} />
                    <p className="text-xs text-gray-400 break-all max-w-xs text-center"> Link temporal: {qrValue}</p>
                </div>
            )}
        </div>
    )
}

export default Principal;
