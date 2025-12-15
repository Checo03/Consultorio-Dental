================================================================================
                    CONSULTORIO DENTAL - SISTEMA DE GESTION
================================================================================

DESCRIPCION DEL PROYECTO
--------------------------------------------------------------------------------

Sistema integral de gestion para consultorios dentales que permite administrar
pacientes, doctores, citas, historiales medicos, tratamientos y generacion de
tickets. Desarrollado con arquitectura cliente-servidor utilizando tecnologias
modernas y escalables.


ARQUITECTURA DEL SISTEMA
--------------------------------------------------------------------------------

El proyecto esta estructurado en dos componentes principales:

BACKEND
  - Tecnologia: Node.js con Express 5.x
  - Tipo de modulo: ES Modules (type: "module")
  - Base de datos: SQL Server / MySQL
  - Puerto: 4000
  - API: RESTful
  
  Dependencias principales:
  - express: Framework web para Node.js
  - cors: Middleware para manejo de CORS
  - mssql: Cliente para SQL Server
  - mysql2: Cliente para MySQL
  - dotenv: Gestion de variables de entorno
  - morgan: Logger de peticiones HTTP
  
  Dependencias de desarrollo:
  - nodemon: Auto-reinicio del servidor en desarrollo

FRONTEND
  - Tecnologia: React 19.x con Vite
  - Framework: React Router DOM para enrutamiento
  - Cliente HTTP: Axios
  - Build tool: Vite 7.x
  - Linting: ESLint con configuracion para React
  
  Caracteristicas:
  - Desarrollo con Hot Module Replacement (HMR)
  - Build optimizado para produccion
  - Linting automatico del codigo


ESTRUCTURA DEL PROYECTO
--------------------------------------------------------------------------------

Consultorio-Dental/
├── .github/
│   └── workflows/
│       ├── ci-cd.yml           # Pipeline principal de CI/CD
│       └── code-quality.yml    # Pipeline de calidad de codigo
├── Backend/
│   ├── controllers/            # Logica de negocio
│   ├── database/              # Configuracion de base de datos
│   ├── routes/                # Definicion de rutas API
│   ├── app.js                 # Configuracion de Express
│   ├── index.js               # Punto de entrada del servidor
│   ├── encrypt.js             # Utilidades de encriptacion
│   └── package.json           # Dependencias del backend
├── ConsultorioDental/
│   ├── public/                # Archivos estaticos
│   ├── src/                   # Codigo fuente React
│   ├── index.html             # HTML principal
│   ├── vite.config.js         # Configuracion de Vite
│   ├── eslint.config.js       # Configuracion de ESLint
│   └── package.json           # Dependencias del frontend
├── .gitignore                 # Exclusiones de Git
└── README.txt                 # Este archivo


PIPELINES DE CI/CD
--------------------------------------------------------------------------------

El proyecto incluye dos pipelines automatizados de GitHub Actions:

1. CI/CD PIPELINE (ci-cd.yml)
   
   Triggers:
   - Push a ramas main y develop
   - Pull requests hacia main
   
   Jobs:
   
   a) test-backend
      - Checkout del codigo
      - Instalacion de Node.js 18
      - Instalacion de dependencias con npm ci
      - Ejecucion de linter (si esta configurado)
      - Ejecucion de tests
   
   b) build-backend
      - Dependiente de test-backend
      - Build de la aplicacion backend
      - Generacion de artefacto (retencion: 7 dias)
   
   c) build-frontend
      - Validacion de estructura HTML5
      - Build del frontend con Vite
      - Generacion de artefacto (retencion: 7 dias)
   
   d) deploy
      - Dependiente de build-backend y build-frontend
      - Solo se ejecuta en push a main
      - Descarga artefactos de build
      - Preparacion para despliegue
      - Incluye plantillas comentadas para diferentes plataformas

2. CODE QUALITY PIPELINE (code-quality.yml)
   
   Triggers:
   - Push a ramas main y develop
   - Pull requests hacia main
   
   Jobs:
   
   a) eslint-backend
      - Analisis de codigo del backend con ESLint
   
   b) eslint-frontend
      - Analisis de codigo del frontend con ESLint
   
   c) prettier-check
      - Verificacion de formato de codigo
   
   d) security-audit
      - Auditoria de seguridad con npm audit
      - Deteccion de vulnerabilidades en dependencias
      - Ejecuta en backend y frontend


REQUISITOS DEL SISTEMA
--------------------------------------------------------------------------------

SOFTWARE REQUERIDO
  - Node.js 18.x o superior
  - npm 9.x o superior
  - SQL Server 2016+ o MySQL 8.0+
  - Git 2.x

RECOMENDACIONES
  - Sistema operativo: Windows 10+, macOS 12+, o Linux (Ubuntu 20.04+)
  - RAM: 4GB minimo, 8GB recomendado
  - Espacio en disco: 500MB para dependencias


INSTALACION Y CONFIGURACION
--------------------------------------------------------------------------------

1. CLONAR EL REPOSITORIO

   git clone https://github.com/Checo03/Consultorio-Dental.git
   cd Consultorio-Dental


2. CONFIGURAR BACKEND

   a) Navegar al directorio del backend:
      cd Backend

   b) Instalar dependencias:
      npm install

   c) Crear archivo .env con las siguientes variables:
      
      # Configuracion del servidor
      PORT=4000
      
      # SQL Server
      DB_SERVER=localhost
      DB_DATABASE=ConsultorioDental
      DB_USER=usuario
      DB_PASSWORD=password
      DB_PORT=1433
      
      # MySQL (alternativo)
      MYSQL_HOST=localhost
      MYSQL_DATABASE=consultorio_dental
      MYSQL_USER=usuario
      MYSQL_PASSWORD=password
      MYSQL_PORT=3306
      
      # Configuracion general
      NODE_ENV=development

   d) Configurar la base de datos:
      - Crear la base de datos
      - Ejecutar scripts de migracion (si existen)
      - Configurar permisos de usuario


3. CONFIGURAR FRONTEND

   a) Navegar al directorio del frontend:
      cd ../ConsultorioDental

   b) Instalar dependencias:
      npm install

   c) Crear archivo .env.local (opcional):
      VITE_API_URL=http://localhost:4000/api


4. VERIFICAR INSTALACION

   Backend:
   cd Backend
   npm run dev

   Frontend (en otra terminal):
   cd ConsultorioDental
   npm run dev


SCRIPTS DISPONIBLES
--------------------------------------------------------------------------------

BACKEND (desde directorio Backend/)

  npm start
    Inicia el servidor en modo produccion
    Puerto: 4000

  npm run dev
    Inicia el servidor en modo desarrollo con nodemon
    Auto-reinicio al detectar cambios

  npm test
    Ejecuta la suite de tests
    Nota: Actualmente no hay tests configurados


FRONTEND (desde directorio ConsultorioDental/)

  npm run dev
    Inicia servidor de desarrollo con Vite
    Puerto: 5173 (por defecto)
    Hot Module Replacement habilitado

  npm run build
    Genera build de produccion en /dist
    Optimiza y minifica el codigo

  npm run preview
    Pre-visualiza el build de produccion localmente

  npm run lint
    Ejecuta ESLint para analizar el codigo
    Identifica problemas de calidad y estilo


CONFIGURACION DE GITHUB ACTIONS
--------------------------------------------------------------------------------

SECRETOS REQUERIDOS

Para despliegue automatico, configurar los siguientes secretos en GitHub:
Settings > Secrets and variables > Actions > New repository secret

Dependiendo de la plataforma de despliegue:

HEROKU:
  - HEROKU_API_KEY: API key de Heroku
  - HEROKU_APP_NAME: Nombre de la aplicacion
  - HEROKU_EMAIL: Email de la cuenta Heroku

AWS:
  - AWS_ACCESS_KEY_ID: Access key de AWS
  - AWS_SECRET_ACCESS_KEY: Secret key de AWS
  - AWS_REGION: Region de AWS (ej: us-east-1)

AZURE:
  - AZURE_WEBAPP_PUBLISH_PROFILE: Perfil de publicacion

SERVIDOR PERSONALIZADO (SSH):
  - DEPLOY_HOST: Direccion IP o dominio del servidor
  - DEPLOY_USER: Usuario SSH
  - DEPLOY_KEY: Clave privada SSH


CONFIGURACION DE VARIABLES DE ENTORNO

GitHub Actions > Settings > Secrets and variables > Actions > Variables:

  - NODE_VERSION: 18 (version de Node.js)
  - DB_SERVER: Servidor de base de datos (produccion)
  - DB_DATABASE: Nombre de base de datos


HABILITAR WORKFLOWS

1. Navegar a Actions en el repositorio de GitHub
2. Los workflows se ejecutaran automaticamente en:
   - Push a main o develop
   - Pull requests hacia main
3. Monitorear ejecuciones en la pestaña Actions


DESPLIEGUE
--------------------------------------------------------------------------------

DESARROLLO LOCAL

  Backend:
    cd Backend
    npm run dev
    
  Frontend:
    cd ConsultorioDental
    npm run dev


PRODUCCION

El pipeline de CI/CD maneja el despliegue automatico a main.

Pasos manuales de despliegue:

1. Backend:
   cd Backend
   npm ci --production
   npm start

2. Frontend:
   cd ConsultorioDental
   npm ci
   npm run build
   # Servir archivos de /dist con servidor web

3. Configurar variables de entorno de produccion

4. Configurar proxy reverso (Nginx, Apache, etc.)

5. Configurar HTTPS con certificado SSL


OPCIONES DE HOSTING

BACKEND:
  - Heroku
  - AWS EC2 / Elastic Beanstalk
  - Azure App Service
  - DigitalOcean
  - Google Cloud Platform
  - Servidor VPS personalizado

FRONTEND:
  - Vercel
  - Netlify
  - AWS S3 + CloudFront
  - Azure Static Web Apps
  - GitHub Pages
  - Firebase Hosting

BASE DE DATOS:
  - AWS RDS (SQL Server / MySQL)
  - Azure SQL Database
  - Google Cloud SQL
  - Servidor dedicado


TROUBLESHOOTING
--------------------------------------------------------------------------------

PROBLEMA: Error al instalar dependencias

  Solucion:
  - Verificar version de Node.js: node --version
  - Limpiar cache de npm: npm cache clean --force
  - Eliminar node_modules y reinstalar:
    rm -rf node_modules package-lock.json
    npm install


PROBLEMA: Backend no conecta a la base de datos

  Solucion:
  - Verificar credenciales en .env
  - Verificar que el servidor de base de datos este activo
  - Verificar puertos (SQL Server: 1433, MySQL: 3306)
  - Verificar reglas de firewall
  - Revisar logs del servidor: logs/error.log


PROBLEMA: Frontend no puede comunicarse con Backend

  Solucion:
  - Verificar que el backend este ejecutandose
  - Verificar URL de API en configuracion del frontend
  - Verificar configuracion de CORS en Backend
  - Revisar consola del navegador para errores


PROBLEMA: Error de CORS

  Solucion:
  - Verificar configuracion de cors() en Backend/app.js
  - Asegurar que el origen del frontend este permitido
  - En desarrollo, verificar puertos correctos


PROBLEMA: Falla el pipeline de CI/CD

  Solucion:
  - Revisar logs en GitHub Actions
  - Verificar que los secretos esten configurados
  - Verificar permisos de GitHub Actions
  - Asegurar que las dependencias esten actualizadas


PROBLEMA: Build de produccion falla

  Solucion:
  - Ejecutar npm run build localmente para reproducir
  - Verificar variables de entorno requeridas
  - Revisar errores de ESLint
  - Actualizar dependencias con npm update


MEJORES PRACTICAS
--------------------------------------------------------------------------------

DESARROLLO

1. Seguir la estructura de directorios establecida
2. Usar ESLint para mantener calidad de codigo
3. Realizar commits pequenos y descriptivos
4. Crear pull requests para revision de codigo
5. Escribir tests para nuevas funcionalidades
6. Documentar funciones y componentes complejos


SEGURIDAD

1. NUNCA commitear archivos .env
2. Usar variables de entorno para datos sensibles
3. Mantener dependencias actualizadas
4. Ejecutar npm audit regularmente
5. Validar y sanitizar todas las entradas de usuario
6. Usar HTTPS en produccion
7. Implementar autenticacion y autorizacion robustas
8. Realizar backups regulares de la base de datos


CONTROL DE VERSIONES

1. main: Rama de produccion estable
2. develop: Rama de desarrollo
3. feature/*: Ramas para nuevas funcionalidades
4. hotfix/*: Ramas para correcciones urgentes
5. Merge a main solo despues de code review
6. Usar tags para versiones de release


DESPLIEGUE

1. Probar exhaustivamente antes de desplegar
2. Realizar despliegues durante ventanas de mantenimiento
3. Mantener backups antes de actualizaciones
4. Implementar rollback plan
5. Monitorear logs despues del despliegue
6. Usar despliegue azul-verde o canary cuando sea posible


MANTENIMIENTO

1. Revisar y actualizar dependencias mensualmente
2. Monitorear logs de errores
3. Realizar backups de base de datos regularmente
4. Optimizar consultas de base de datos
5. Revisar metricas de rendimiento
6. Mantener documentacion actualizada


================================================================================
Para mas informacion o soporte, contactar al equipo de desarrollo.
Version: 1.0.0
Ultima actualizacion: 2025
================================================================================
