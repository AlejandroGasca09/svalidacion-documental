import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            // Guardar token y usuario en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.usuario));
            
            // Redirigir al panel principal
            navigate('/');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-neutral-900">
            <div className="w-full max-w-md bg-white p-10 border border-neutral-200 shadow-sm">
                <header className="mb-10 text-center">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 mb-4">
                        Ingresa tu datos</p>
                    <h1 
                        className="text-4xl font-light tracking-[0.1em] font-serif" style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}>
                        INICIAR SESIÓN
                    </h1>
                </header>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">
                            Correo Electrónico
                        </label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-neutral-900 transition-colors bg-stone-50"
                            placeholder="admin@sistema.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs tracking-widest uppercase text-neutral-500 mb-2">
                            Contraseña
                        </label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:border-neutral-900 transition-colors bg-stone-50"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 font-mono">→ {error}</p>
                    )}

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-neutral-900 text-stone-50 px-8 py-4 text-xs tracking-[0.3em] uppercase disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors duration-200 mt-4"
                    >
                        {loading ? 'Ingresando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    );
}
