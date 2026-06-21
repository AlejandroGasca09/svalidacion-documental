CREATE TYPE estado_documento AS ENUM ('Vigente', 'Revocado', 'Cancelado');

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, 
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documentos (
    id SERIAL PRIMARY KEY,
    folio VARCHAR(50) UNIQUE NOT NULL,      
    titulo VARCHAR(150) NOT NULL,            
    tipo_documento VARCHAR(50) NOT NULL,    
    area_emisora VARCHAR(100) NOT NULL,        
    ruta_pdf_original VARCHAR(255) NOT NULL, 
    ruta_pdf_con_qr VARCHAR(255) NOT NULL,
    ruta_qr_imagen VARCHAR(255) NOT NULL,
    estado estado_documento DEFAULT 'Vigente', 
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    usuario_id INT REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE validaciones (
    id SERIAL PRIMARY KEY,
    documento_id INT REFERENCES documentos(id) ON DELETE CASCADE,
    fecha_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_consultor VARCHAR(45),
    dispositivo VARCHAR(255)
);

-- Prueba
INSERT INTO usuarios (nombre, email, password_hash) 
VALUES ('Alejandro Admin', 'admin@sistema.com', '$2b$10$NoQueriaHacer3xtr4pongame10');