# TP Integrador — Formularios y Tablas — Unidad 8

**Materia:** Programación IV — Tecnicatura Universitaria en Programación a Distancia (UTN)

Aplicación **Full Stack** completa que implementa el **CRUD de Categorías, Productos e Ingredientes** desde una interfaz de usuario interactiva en React construida con **TanStack Form**, **TanStack Table v8**, **TanStack Query** y **Tailwind CSS**. 

En el backend (**FastAPI + SQLModel + PostgreSQL**), se implementa la arquitectura **Models-Schemas-Repository-UoW-Service-Router** para la gestión transaccional atómica del módulo de **Pedidos y DetallePedido**, demostrada integralmente mediante **REST Client** (`pedidos.http`).

---

## 🏗️ Estructura del Repositorio

```text
TP_FormulariosYtablas/
│
├── fastapi-productos/                # Backend: FastAPI + SQLModel + PostgreSQL
│   ├── app/
│   │   ├── core/
│   │   │   ├── database.py           # Conexión engine y sesiones Session
│   │   │   ├── repository.py         # Repositorio genérico base
│   │   │   └── unit_of_work.py       # Unit of Work base transaccional
│   │   ├── categoria/                # Model, Schema, Service y Router de Categorías
│   │   ├── producto/                 # Model, Schema, Service y Router de Productos
│   │   ├── ingrediente/              # Model, Schema, Service y Router de Ingredientes
│   │   ├── pedidos/                  # Models, Schemas, Repository, UoW, Service y Router de Pedidos
│   │   └── main.py                   # App FastAPI, Lifespan y configuración CORS
│   ├── pedidos.http                  # Suite de pruebas REST Client (Casos 201, 204, 404, 422)
│   ├── requirements.txt              # Dependencias Python
│   └── .env                          # Variables de entorno (DATABASE_URL)
│
├── tp-categorias/                    # Frontend: React + TypeScript + Vite
│   ├── src/
│   │   ├── components/               # Navbar, modales y tablas reutilizables
│   │   ├── pages/
│   │   │   ├── CategoriasPage.tsx    # CRUD de Categorías (TanStack Form + Table)
│   │   │   ├── ProductsPage.tsx      # CRUD de Productos (TanStack Form + Table)
│   │   │   └── IngredientesPage.tsx  # CRUD de Ingredientes (TanStack Form + Table)
│   │   ├── types/                    # Interfaces de Categoria, Producto e Ingrediente
│   │   ├── App.tsx                   # Rutas de React Router (/categorias, /productos, /ingredientes)
│   │   ├── main.tsx                  # QueryClientProvider y BrowserRouter
│   │   └── index.css                 # Configuración de estilos Tailwind CSS
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore                        # Reglas de exclusión para Git (.venv, node_modules, etc.)
└── README.md                         # Documentación general del proyecto
```
## Autor

**Nicolás A. Pannunzio** – Full Stack Developer & QA Automation  
🔗 [Perfil de LinkedIn](https://www.linkedin.com/in/nicolas-a-pannunzio-/)
