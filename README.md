# ShopWave Fusion - Frontend E-Commerce

ShopWave Fusion es el frontend profesional de un e-commerce académico construido con Next.js App Router, TypeScript y Tailwind CSS, conectado a una API REST base desarrollada en Spring Boot y protegida con JWT. La solución está diseñada bajo el principio de Separación de Responsabilidades (SoC), aislando presentación, lógica de negocio, acceso a datos, protección de rutas y utilidades puras en capas bien definidas.

> **Nota:** Este repositorio corresponde a la capa frontend del sistema. La autenticación y el acceso a recursos protegidos dependen de la API backend y de la configuración correcta de la variable de entorno `NEXT_PUBLIC_API_URL`.

## Características Principales

### Módulo de Usuario Normal

- Registro e inicio de sesión contra la API protegida con JWT.
- Catálogo de productos con búsqueda, filtros y navegación por detalle.
- Vista de detalle de producto con información relevante para conversión.
- Carrito de compras reactivo con operaciones de agregar, modificar y eliminar ítems.
- Checkout simulado para validar el flujo funcional de compra.
- Historial de órdenes para seguimiento de transacciones previas.
- Perfil de usuario con acceso a información de sesión y datos asociados.

### Módulo de Administrador (Nuevo)

- Dashboard administrativo orientado a operación y monitoreo.
- CRUD completo de productos con gestión de inventario y control de stock.
- Monitoreo centralizado de órdenes globales.
- Control de acceso estricto por roles para aislar operaciones sensibles.

### Características Transversales

- Diseño 100% responsive adaptado a desktop, tablet y móvil.
- Gestión explícita de estados de carga con loaders y skeletons.
- Manejo robusto de errores con respuestas tipadas y mensajes controlados.
- Protección de rutas mediante guards y capa de middleware/proxy en el frontend.

#### Formulario de Autenticación Mejorado 
- LoginForm con validación de formularios y UI moderna con iconos de Lucide.
- RegisterForm con campos mejorados, soporte para número de móvil y validación en tiempo real.

#### Componentes de Carrito y Checkout Mejorados 
- CartPageClient con detalles de productos completos, controles de cantidad y eliminación.
- CheckoutPageClient con selector de direcciones de envío y métodos de pago integrados.
- ShippingAddressSelector para gestión eficiente de direcciones de entrega.

#### Módulo de Administración Ampliado
- AdminOrdersView con tabla de órdenes enriquecida, filtros avanzados y actualizaciones de estado.
- Admin dashboard con vistas detalladas de órdenes, productos y rendimiento del sistema.
- Paneles CRUD completos para gestión de inventario y control de stock.

#### Componentes de Interfaz de Usuario Mejorados 
- Hero y componentes de landing page con animaciones y diseño moderno.
- Navbar con estilo mejorado y componentes de UI reutilizables.
- Footer responsive con componentes de layout modular.

#### Componentes de Productos Mejorados 
- product-detail con información completa de productos y variantes.
- ProductFiltersPanel y ProductFiltersSheet con filtros avanzados.
- products-section y SortMenu con listados de productos ordenados.

#### Componentes de Órdenes y Perfil Mejorados 
- OrderHistoryView con detalles expandidos y visualización de pagos.
- ProfileView con gestión integrada de direcciones y métodos de pago.
- CustomerAvatar con información enriquecida de clientes.

#### Contextos y Guards Mejorados 
- AuthContext con administración mejorada de sesiones y gestión de tokens.
- CartContext con validaciones de checkout y lógica de procesamiento mejorada.
- ProductContext para gestión global de datos de productos.
- AuthGuard y AdminGuard con control de acceso mejorado y redirecciones.

#### Utilidades y Herramientas Mejoradas 
- currency.util con formateo mejorado de monedas.
- checkout.validation con validaciones mejoradas de formularios.
- Funciones puras de lib/auth para manejo seguro de sesiones.

## Arquitectura de Software y Estructura de Carpetas

La arquitectura sigue una organización limpia y desacoplada para mantener el código mantenible, escalable y fácil de testear.

```text
shopwavefusionfrontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       ├── logout/
│   │   │       ├── register/
│   │   │       └── session/
│   │   ├── admin/
│   │   │   ├── orders/
│   │   │   └── products/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── login/
│   │   ├── orders/
│   │   ├── products/
│   │   │   └── [id]/
│   │   ├── profile/
│   │   ├── register/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── products/
│   │   └── ui/
│   ├── context/
│   ├── guards/
│   ├── hooks/
│   ├── lib/
│   │   └── auth/
│   ├── models/
│   ├── services/
│   ├── types/
│   └── utils/
├── public/
├── proxy.ts
└── README.md
```

- `src/app/`: capa de enrutamiento del App Router. Aquí viven las páginas, layouts y route handlers del dominio funcional.
- `src/admin/`: panel de control administrativo con gestión de usuarios y datos del sistema.
- `src/components/`: biblioteca de componentes reutilizables y desacoplados por dominio visual y funcional.
- `src/components/auth/`: formularios de autenticación (LoginForm, RegisterForm).
- `src/components/cart/`: componentes de carrito y checkout (CartPageClient, CheckoutPageClient).
- `src/components/home/`: componentes de landing page (Hero, home-cta, trust-stats).
- `src/components/layout/`: componentes de layout (Navbar, Hero, Footer).
- `src/components/orders/`: componentes de órdenes (OrderHistoryView, CustomerAvatar).
- `src/components/products/`: componentes de productos (product-detail, ProductFiltersPanel, etc.).
- `src/components/profile/`: componente de vista de perfil (ProfileView).
- `src/components/ui/`: componentes de UI básicos (badge, button, input, etc.).
- `src/context/`: estado global con Context API para sesión, carrito y datos compartidos de la aplicación.
- `src/guards/`: componentes de protección de rutas que aplican control de acceso en cliente.
- `src/hooks/`: lógica reutilizable de estado y negocio para auth, carrito y catálogo.
- `src/lib/`: utilidades de infraestructura o dominio transversal; incluye manejo de sesión en servidor.
- `src/models/`: contratos de dominio y modelos tipados para auth, usuarios, productos, órdenes, reseñas y carrito.
- `src/services/`: capa de acceso a API y operaciones remotas, aislada de los componentes visuales.
- `src/types/`: tipos genéricos y contratos de respuesta como `api-response.type.ts`.
- `src/utils/`: funciones puras y reutilizables, sin dependencias de React ni del framework.

> **Nota:** Esta separación permite que la UI consuma servicios y hooks sin acoplarse directamente a detalles de transporte, sesión o validación de permisos.

## Tecnologías Utilizadas

- **Framework:** Next.js con App Router.
- **Lenguaje:** TypeScript.
- **Estilos:** Tailwind CSS.
- **Component Library:** shadcn/ui con componentes UI headless accesibles.
- **Iconos:** Lucide React iconografía moderna y ligera.
- **Herramientas UI:** tailwind-merge y tw-animate-css para clases utilitarias.
- **Cliente HTTP:** Fetch API centralizada en servicios, con compatibilidad conceptual para Axios si el proyecto lo requiere.
- **Seguridad:** JSON Web Tokens (JWT).
- **Persistencia de sesión:** Cookies HTTP-only para el token de autenticación.

## Requisitos Previos E Instalación

### Requisitos

- Node.js LTS (v20 o superior recomendado para compatibilidad con Next.js 16.2.6).
- Git.

### Instalación

1. Clona el repositorio.

	```bash
	git clone <URL-del-repositorio>
	cd Team5-Shopwave-Frontend
	```

2. Instala las dependencias.

	```bash
	npm install
	```

3. Crea tu archivo de entorno local a partir del ejemplo.

	```bash
	cp .env.local.example .env.local
	```

	En Windows PowerShell también puedes usar:

	```powershell
	Copy-Item .env.local.example .env.local
	```

4. Ajusta la URL de la API backend según tu entorno local o despliegue.

> **Nota:** El frontend lee `NEXT_PUBLIC_API_URL` para resolver el backend. Si tu entorno ya usa `NEXT_PUBLIC_API_BASE_URL`, la capa de servicios también la soporta como fallback.

### Actualización (2026)

El proyecto ha evolucionado con nuevas dependencias en 2026:

- **shadcn/ui** (v4.7.0) - Biblioteca moderna de componentes de UI con Tailwind CSS
- **Lucide React** (v1.16.0) - Iconografía moderna y ligera integrada con React
- **tailwind-merge** (v3.6.0) y **tw-animate-css** (v1.4.0) - Herramientas avanzadas de clases utilitarias y animaciones

Estas dependencias proporcionan componentes UI accesibles, una amplia gama de iconos modernos y capacidades avanzadas de animación.

### Archivo `.env.local.example`

```env
NEXT_PUBLIC_API_URL=https://github.com/DEEPAKKUMARMAHASETH/shopwavefusionbackend
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Scripts De Ejecución

- `npm run dev`: inicia el servidor de desarrollo con recarga en caliente.
- `npm run build`: compila la aplicación para producción.
- `npm run start`: ejecuta la versión compilada en un entorno de producción.
- `npm run lint`: ejecuta el linter para mantener consistencia y calidad de código.

## Seguridad Y Control De Acceso

La autenticación se implementa con JWT y una cookie de sesión HTTP-only administrada por el layer de App Router. Cuando el usuario inicia sesión, el backend devuelve el token y el frontend lo persiste en la cookie `shopwave_session`, evitando exposición directa desde JavaScript.

1. El login envía credenciales al backend mediante la ruta interna `/api/auth/login`.
2. La respuesta incluye el JWT, que se guarda en cookie de sesión con atributos `httpOnly`, `sameSite=lax`, `path=/` y expiración controlada.
3. `getSession()` y la ruta `/api/auth/session` reconstruyen el usuario autenticado a partir del token almacenado.
4. Las peticiones a recursos protegidos usan la capa de servicios para adjuntar el bearer token cuando corresponde.

`AuthGuard` protege rutas críticas como `/checkout` y `/profile`. Mientras la sesión se resuelve, muestra un estado de carga; si no existe autenticación válida, redirige al login con el parámetro `next` para conservar el destino original.

`AdminGuard` restringe el acceso al panel `/admin` y bloquea cualquier usuario que no tenga rol administrativo. En la implementación actual del proyecto, la validación se realiza contra `ROLE_ADMIN`, que es el valor esperado por el contrato del backend.

> **Nota:** Esta estrategia combina cookie segura en servidor, validación de sesión en el frontend y guards de ruta para reducir superficies de acceso no autorizadas.

## Estructura Funcional Resumida

- `src/app/`: páginas y rutas del sistema.
- `src/components/`: UI modular reutilizable.
- `src/context/`: estado global de autenticación y carrito.
- `src/guards/`: protección de acceso por sesión y rol.
- `src/hooks/`: composición de lógica reutilizable para vistas y flujos.
- `src/services/`: integración desacoplada con la API REST.
- `src/utils/`: helpers puros para token, moneda y validaciones.

## Flujo De Uso Recomendado

1. Configura la variable `NEXT_PUBLIC_API_URL` apuntando al backend de Spring Boot.
2. Inicia sesión con un usuario normal o con un usuario administrador.
3. Navega el catálogo, agrega productos al carrito y prueba el checkout simulado.
4. Verifica el módulo `/admin` con una cuenta que posea rol administrativo.

> **Nota:** Si el backend cambia de host o puerto, actualiza únicamente el `.env.local`; el resto de la aplicación mantiene la misma arquitectura y no requiere cambios en los componentes.
