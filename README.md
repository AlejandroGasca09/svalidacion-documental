# Sistema de Validación Documental - FES Aragón

Un sistema moderno para el registro, sellado y validación de documentos institucionales mediante códigos QR. Desarrollado para la FES Aragón (UNAM), esta plataforma permite a los administradores subir documentos PDF, incrustarles automáticamente un código QR de validación y ofrecer al público una ruta de verificación para comprobar la autenticidad y estado de cada documento.

## Características Principales

- **Autenticación Segura**: Acceso mediante JWT para usuarios administradores.
- **Sellado Automático de PDF**: Incrustación de códigos QR en los documentos PDF en posiciones configurables.
- **Validación Pública**: Enlaces públicos generados automáticamente para que cualquier persona pueda verificar la validez de un documento sin necesidad de iniciar sesión.
- **Interfaz Moderna**: Diseño minimalista y responsivo construido con React y Tailwind CSS, brindando una experiencia de usuario premium.

## Tecnologías Utilizadas

### Frontend
- React 18 (Vite)
- Tailwind CSS
- React Router DOM
- qrcode.react

### Backend
- Node.js & Express
- PostgreSQL (Base de Datos)
- pdf-lib (Manipulación de PDF)
- Multer (Carga de archivos)
- JSON Web Tokens (JWT) & bcrypt

## Requisitos Previos

Asegúrate de tener instalados los siguientes componentes en tu sistema antes de comenzar:
- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [Docker y Docker Compose](https://www.docker.com/) (para levantar la base de datos fácilmente)

## Instalación y Configuración

1. **Clonar el repositorio y acceder a la carpeta:**
   ```bash
   git clone <url-del-repositorio>
   cd svalidacion-documental
   ```

2. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

3. **Configurar la Base de Datos:**
   El proyecto incluye un archivo `docker-compose.yml` para desplegar la base de datos PostgreSQL rápidamente.
   ```bash
   docker-compose up -d
   ```
   *Nota: La base de datos correrá en el puerto `5433` con el usuario `usuario_qr`.*

4. **Variables de Entorno (`.env`):**
   Asegúrate de configurar el archivo `.env` en la raíz del proyecto basándote en la conexión de tu base de datos y la configuración del puerto.

5. **Iniciar el Servidor de Desarrollo (Frontend + Backend):**
   ```bash
   npm run dev
   ```

## Uso del Sistema

### Administradores
1. Acceder a `/login`.
2. Ingresar las credenciales configuradas en el archivo `init.sql` (Ej. `admin@sistema.com`).
3. En la página principal, completar los datos del documento (Título, Tipo, Área Emisora, Posición del QR) y adjuntar el archivo PDF.
4. Hacer clic en "Generar y Sellar Documento".
5. Se generará un enlace público de validación y el documento sellado quedará almacenado en el sistema.

### Validadores Públicos
1. Escanear el código QR del documento impreso o acceder directamente al enlace público generado.
2. El sistema mostrará si el documento se encuentra "Vigente", junto con los metadatos y un visor del archivo original.