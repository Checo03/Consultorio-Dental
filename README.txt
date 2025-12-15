================================================================================
CONSULTORIO DENTAL - SISTEMA DE GESTION
================================================================================

DESCRIPCION DEL PROYECTO
================================================================================

Sistema integral de gestión para consultorios dentales que proporciona 
funcionalidades para administrar pacientes, citas, tratamientos y registros 
médicos. La aplicación está construida con una arquitectura moderna de cliente-
servidor, utilizando tecnologías web estándar de la industria.

ARQUITECTURA DEL SISTEMA
================================================================================

El proyecto está dividido en dos componentes principales:

1. Backend (API REST)
   - Framework: Node.js con Express v5.1.0
   - Base de datos: SQL Server / MySQL
   - Puerto: 4000
   - Tipo de módulo: ES Modules (type: "module")

2. Frontend (Aplicación Web)
   - Framework: React v19.1.1
   - Build Tool: Vite v7.1.2
   - Routing: React Router DOM v7.8.2
   - HTTP Client: Axios v1.12.2

ESTRUCTURA DEL PROYECTO
================================================================================

Consultorio-Dental/
|
|-- Backend/
|   |-- app.js                  # Configuración de Express
|   |-- index.js                # Punto de entrada del servidor
|   |-- controllers/            # Lógica de negocio
|   |-- database/               # Configuración de base de datos
|   |-- routes/                 # Definición de rutas API
|   |-- encrypt.js              # Utilidades de encriptación
|   |-- package.json            # Dependencias del backend
|   |-- package-lock.json
|
|-- ConsultorioDental/
|   |-- src/                    # Código fuente del frontend
|   |-- public/                 # Recursos estáticos
|   |-- index.html              # Punto de entrada HTML
|   |-- vite.config.js          # Configuración de Vite
|   |-- eslint.config.js        # Configuración de ESLint
|   |-- package.json            # Dependencias del frontend
|   |-- package-lock.json
|
|-- .github/
|   |-- workflows/
|       |-- ci-cd.yml           # Pipeline principal CI/CD
|       |-- code-quality.yml    # Pipeline de calidad de código
|
|-- .gitignore                  # Archivos excluidos del control de versiones
|-- README.txt                  # Este archivo

PIPELINES CI/CD
================================================================================

El proyecto incluye dos pipelines automatizados para garantizar la calidad y 
facilitar el despliegue:

1. CI/CD Pipeline (ci-cd.yml)
   -------------------------
   
   Triggers:
   - Push a ramas: main, develop
   - Pull requests hacia: main
   
   Jobs:
   
   a) test-backend
      - Ejecuta en: ubuntu-latest
      - Node.js: v18
      - Pasos:
        * Checkout del código
        * Instalación de dependencias (npm ci)
        * Ejecución de linter (si existe)
        * Ejecución de tests
   
   b) build-backend
      - Dependencia: test-backend
      - Ejecuta en: ubuntu-latest
      - Node.js: v18
      - Pasos:
        * Checkout del código
        * Instalación de dependencias
        * Build de la aplicación (si aplica)
        * Creación de artefactos (retención: 7 días)
   
   c) build-frontend
      - Ejecuta en: ubuntu-latest
      - Node.js: v18
      - Pasos:
        * Checkout del código
        * Instalación de dependencias
        * Validación de estructura HTML5
        * Ejecución de linter
        * Build de producción con Vite
        * Creación de artefactos (retención: 7 días)
   
   d) deploy
      - Dependencias: build-backend, build-frontend
      - Condición: Solo en push a rama main
      - Ejecuta en: ubuntu-latest
      - Pasos:
        * Descarga de artefactos del backend y frontend
        * Preparación para despliegue
        * Plantillas comentadas para diferentes métodos de deploy:
          - SSH deployment
          - Cloud platforms (Heroku, AWS, Azure)
          - Docker deployment

2. Code Quality Pipeline (code-quality.yml)
   ----------------------------------------
   
   Triggers:
   - Push a ramas: main, develop
   - Pull requests hacia: main
   
   Jobs:
   
   a) eslint-backend
      - Análisis de código estático del backend
      - Detecta problemas de calidad y estilo
   
   b) eslint-frontend
      - Análisis de código estático del frontend
      - Valida reglas de React y JavaScript
   
   c) prettier-check
      - Verificación de formato de código
      - Asegura consistencia en el estilo
   
   d) security-audit-backend
      - Auditoría de seguridad de dependencias del backend
      - Identifica vulnerabilidades conocidas
      - Nivel: moderate o superior
   
   e) security-audit-frontend
      - Auditoría de seguridad de dependencias del frontend
      - Identifica vulnerabilidades conocidas
      - Nivel: moderate o superior
   
   f) dependency-review
      - Solo en pull requests
      - Revisión de cambios en dependencias
      - Previene la introducción de dependencias vulnerables

REQUISITOS DEL SISTEMA
================================================================================

Software Requerido:
- Node.js: v18.x o superior
- npm: v9.x o superior
- Base de datos: SQL Server o MySQL

Puertos Utilizados:
- Backend: 4000
- Frontend (desarrollo): 5173 (puerto por defecto de Vite)

Sistema Operativo:
- Compatible con Windows, macOS y Linux

INSTALACION Y CONFIGURACION
================================================================================

1. Clonar el Repositorio
   ----------------------
   git clone https://github.com/Checo03/Consultorio-Dental.git
   cd Consultorio-Dental

2. Configurar el Backend
   ----------------------
   cd Backend
   npm install
   
   Crear archivo .env con las siguientes variables:
   
   # Configuración del servidor
   PORT=4000
   NODE_ENV=development
   
   # SQL Server
   DB_SERVER=localhost
   DB_DATABASE=ConsultorioDental
   DB_USER=sa
   DB_PASSWORD=your_password
   DB_PORT=1433
   
   # O para MySQL
   MYSQL_HOST=localhost
   MYSQL_DATABASE=ConsultorioDental
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_PORT=3306

3. Configurar el Frontend
   -----------------------
   cd ../ConsultorioDental
   npm install
   
   Crear archivo .env (si es necesario):
   
   VITE_API_URL=http://localhost:4000

4. Inicializar la Base de Datos
   -----------------------------
   Ejecutar los scripts SQL proporcionados para crear:
   - Esquema de base de datos
   - Tablas necesarias
   - Datos iniciales (si aplica)

SCRIPTS DISPONIBLES
================================================================================

Backend:
--------
npm start          # Inicia el servidor en producción
npm run dev        # Inicia el servidor en modo desarrollo con nodemon
npm test           # Ejecuta los tests (cuando estén configurados)

Frontend:
---------
npm run dev        # Inicia el servidor de desarrollo de Vite
npm run build      # Genera build de producción
npm run lint       # Ejecuta ESLint para análisis de código
npm run preview    # Preview del build de producción

CONFIGURACION DE GITHUB ACTIONS
================================================================================

Para que los pipelines funcionen correctamente, es necesario configurar los
siguientes elementos:

1. Secretos de GitHub (Settings > Secrets and variables > Actions)
   ---------------------------------------------------------------
   
   Para Despliegue SSH (opcional):
   - SSH_PRIVATE_KEY: Clave privada SSH para acceso al servidor
   - REMOTE_HOST: Dirección IP o dominio del servidor
   - REMOTE_USER: Usuario SSH del servidor
   
   Para Despliegue en Cloud (opcional):
   - Según la plataforma elegida (AWS_ACCESS_KEY_ID, HEROKU_API_KEY, etc.)
   
   Para Base de Datos (CI/CD):
   - DB_CONNECTION_STRING: String de conexión para tests de integración

2. Variables de Entorno (Settings > Secrets and variables > Actions)
   -----------------------------------------------------------------
   - NODE_ENV: production
   - API_URL: URL de la API en producción

3. Permisos del Repositorio
   -------------------------
   - Settings > Actions > General > Workflow permissions
   - Seleccionar: "Read and write permissions"
   - Habilitar: "Allow GitHub Actions to create and approve pull requests"

4. Branch Protection (Recomendado)
   -------------------------------
   Para la rama main:
   - Require pull request reviews before merging
   - Require status checks to pass before merging
     * test-backend
     * build-backend
     * build-frontend
   - Require conversation resolution before merging

OPCIONES DE DESPLIEGUE
================================================================================

1. Despliegue Manual
   ------------------
   Backend:
   - Compilar: npm ci (en servidor)
   - Configurar variables de entorno en el servidor
   - Iniciar: npm start
   - Usar PM2 o similar para mantener el proceso activo
   
   Frontend:
   - Build: npm run build
   - Servir archivos de /dist con Nginx, Apache o servicio de hosting

2. Despliegue con Docker
   ----------------------
   Crear Dockerfile para backend y frontend
   Usar docker-compose para orquestar servicios
   Configurar reverse proxy con Nginx

3. Despliegue en Cloud Platforms
   ------------------------------
   - Heroku: Configurar Procfile y buildpacks
   - AWS: Usar Elastic Beanstalk, EC2 o ECS
   - Azure: Usar Azure App Service
   - Google Cloud: Usar App Engine o Cloud Run

4. Despliegue Automático con CI/CD
   ---------------------------------
   Descomentar y configurar las secciones de deploy en ci-cd.yml
   Configurar los secretos necesarios en GitHub
   El deploy se ejecutará automáticamente en push a main

TROUBLESHOOTING
================================================================================

Problema: npm ci falla en GitHub Actions
Solución: Verificar que package-lock.json esté actualizado y committed

Problema: Tests fallan en CI pero pasan localmente
Solución: Asegurar que las variables de entorno estén configuradas en GitHub
          Secrets y que la versión de Node.js coincida

Problema: Build del frontend falla
Solución: Verificar que todas las dependencias estén en package.json
          Revisar que no haya referencias a archivos faltantes

Problema: Deploy no se ejecuta
Solución: Verificar que el push sea a la rama main
          Confirmar que los jobs de build hayan pasado exitosamente

Problema: Vulnerabilidades en npm audit
Solución: Ejecutar 'npm audit fix' localmente
          Para vulnerabilidades sin fix, evaluar el riesgo y documentar

Problema: ESLint falla en código legacy
Solución: Ajustar reglas en eslint.config.js
          O usar // eslint-disable para líneas específicas temporalmente

MEJORES PRACTICAS
================================================================================

Desarrollo:
-----------
- Trabajar en ramas feature separadas
- Hacer commits pequeños y descriptivos
- Ejecutar linter y tests antes de push
- Mantener dependencias actualizadas regularmente

Seguridad:
----------
- No commitear archivos .env al repositorio
- Rotar secretos y credenciales periódicamente
- Revisar y resolver alertas de npm audit
- Implementar autenticación y autorización robusta

CI/CD:
------
- Revisar logs de workflow cuando fallen los jobs
- Mantener los artefactos solo el tiempo necesario
- Usar environments de GitHub para configuraciones específicas
- Implementar tests de integración antes de producción

Base de Datos:
--------------
- Hacer backups regulares
- Usar migraciones versionadas para cambios de esquema
- Implementar índices para mejorar rendimiento
- Sanitizar inputs para prevenir SQL injection

Monitoreo:
----------
- Implementar logging estructurado
- Configurar alertas para errores críticos
- Monitorear uso de recursos (CPU, memoria, disco)
- Trackear métricas de rendimiento

SOPORTE Y CONTACTO
================================================================================

Para reportar issues o solicitar features:
https://github.com/Checo03/Consultorio-Dental/issues

Documentación adicional:
- Express: https://expressjs.com/
- React: https://react.dev/
- Vite: https://vitejs.dev/
- GitHub Actions: https://docs.github.com/actions

================================================================================
Version: 1.0.0
Ultima actualizacion: Diciembre 2025
================================================================================
