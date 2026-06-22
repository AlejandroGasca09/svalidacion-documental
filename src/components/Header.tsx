function Header() {
  return (
    <header className="bg-stone-50 border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-6">
        {/* Logo FES */}
        <a href="#" className="shrink-0 group">
          <img
            src="https://amei.mx/wp-content/uploads/2016/08/UNAM-FES-Aragon.png"
            alt="FES Aragón"
            className="h-11 w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        </a>

        {/* Título */}
        <div className="text-center flex-1 min-w-0">
          <p className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 mb-1 font-mono">
            UNAM · FES Aragón
          </p>
          <h4
            className="text-neutral-900 text-lg sm:text-xl font-light tracking-[0.2em] truncate"
            style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
          >
            Validación Documental
          </h4>
        </div>

        {/* Logo UNAM */}
        <a href="#" className="shrink-0 group">
          <img
            src="https://yosoycide.com/wp-content/uploads/2020/03/unam-escudo.png"
            alt="UNAM"
            className="h-11 w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
        </a>
      </div>

      {/* Línea acento sutil */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
    </header>
  );
}

export default Header;
