<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Estructura del Proyecto

```
src/
├── app/
│   ├── login/
│   ├── register/
│   ├── products/
│   │   └── [id]/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── profile/
│   └── admin/
│       ├── products/
│       │   └── create/
│       └── orders/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── products/
│   ├── cart/
│   ├── orders/
│   └── forms/
├── models/
│   └── .../
├── types/
│   └── .../
├── services/
│   └── .../
├── hooks/
│   └── .../
├── context/
│   └── .../
├── guards/
│   └── .../
└── utils/
    └── .../
```

## Explicacion de los componentes o arquitectura
* **Types (Tipos)**: La base de la tipificación en TypeScript.
    * *Propósito*: Definir de manera estricta las formas de los datos que se esperan y se envían en toda la aplicación. Esto incluye las estructuras de las respuestas de la API, los parámetros de las funciones y los estados internos.
* **Hooks**: Lógica de React reutilizable.
    * *Propósito*: Encapsular la lógica de estado (state) compleja, los efectos secundarios (side effects) o la lógica de negocio específica para un dominio (e.g., obtener datos o interactuar con el contexto global). Su uso permite mantener los componentes de la interfaz de usuario limpios y enfocados solo en el renderizado.
Ejemplo Práctico:
[] useAuth.ts: Maneja el inicio y cierre de sesión, guarda el token
JWT y el estado del usuario en la memoria, y proporciona métodos
para verificar si el usuario está autenticado.
* **Context (Contexto)**: Gestión de estado global de la aplicación.
    * *Propósito*: Utiliza la Context API de React para evitar el "prop drilling" (pasar propiedades a través de muchos niveles de componentes). Provee datos y funciones de actualización a componentes que se encuentren anidados en cualquier nivel de la jerarquía.
Ejemplo Práctico:
[] AuthContext.tsx: Es el proveedor (Provider) que envuelve la aplicación y distribuye el estado y las funciones del useAuth hook a todos los componentes que lo necesiten, como el Navbar o el Profile.
[] CartContext.tsx: Proporciona acceso global al estado del carrito para que cualquier componente (como el botón "Agregar al Carrito" en la página de producto o el ícono del carrito en el Navbar) pueda interactuar con él.
* **Utils (Utilidades**): Funciones auxiliares genéricas.
    * *Propósito*: Contener funciones puras (sin efectos secundarios ni dependencia de estados) que resuelven tareas comunes y reutilizables que no están atadas a la lógica de negocio específica de un dominio o la interfaz de usuario.
* Guards (Guardianes): Componentes de protección de acceso.
    * *Propósito*: Actuar como "middleware" de frontend. Son componentes de alto orden que envuelven rutas o sub-componentes para controlar el acceso basado en la autenticación o el rol del usuario, redirigiendo al usuario a una página de error o inicio de sesión si no cumple con los requisitos.