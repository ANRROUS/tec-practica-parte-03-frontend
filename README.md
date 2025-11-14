# Frontend - NXT Abogados

Aplicación web para gestión de casos legales con autenticación JWT y validación de formularios.

## Tech Stack

- **Next.js 15** + React 19 + App Router
- **TypeScript 5**
- **Tailwind CSS** - Estilos utility-first
- **Zod** - Validación de esquemas
- **localStorage** - Almacenamiento de tokens

## Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (opcional)
# Copiar .env.example a .env.local si necesitas cambiar la URL del backend
cp .env.example .env.local

# Editar .env.local si es necesario:
# NEXT_PUBLIC_API_URL=http://localhost:4000  # URL del backend

# 3. Asegurarse de que el backend esté corriendo
# Ver: ../tec-practica-parte-03-backend/README.md

# 4. Ejecutar en desarrollo
npm run dev  # Servidor en http://localhost:3000
```

**URL**: http://localhost:3000

**Nota**: El frontend requiere que el backend esté corriendo en `http://localhost:4000` (o la URL configurada en `.env.local`)

## Estructura

```
app/
├── page.tsx            # Root - Redirige según autenticación
├── layout.tsx          # Layout raíz con Header/Footer
├── globals.css         # Estilos globales Tailwind
├── home/
│   └── page.tsx        # Landing page profesional (protegido)
├── login/
│   └── page.tsx        # Autenticación con tabs Login/Registro + Zod
└── expedientes/
    └── page.tsx        # CRUD completo con validación y modales (protegido)

components/
├── Header.tsx          # Navegación reutilizable con detección de ruta activa
└── Footer.tsx          # Footer reutilizable con copyright

lib/
├── api.ts              # Cliente API con fetch y manejo de errores
├── auth.ts             # Servicio de autenticación con localStorage
└── validations.ts      # Esquemas Zod (login, register, caso)

types/
└── index.ts            # Tipos TypeScript (User, Caso, etc.)

public/
└── assets/             # Imágenes y recursos estáticos
```

## Páginas

### `/` - Root
Valida sesión y redirige:
- Con sesión → `/home`
- Sin sesión → `/login`

### `/login` - Autenticación
- **Tab Login**: Email + Password con validación Zod
- **Tab Registro**: Email + Password + Nombre con validación estricta
  - Email válido con @
  - Contraseña: mínimo 8 caracteres, mayúscula, minúscula, número, carácter especial
- Mensajes de error/éxito en tiempo real
- Auto-redirige a /home tras login exitoso

### `/home` - Dashboard (Protegido)
- Hero section con bienvenida personalizada al usuario
- Sección "¿Por qué elegirnos?" con 3 características destacadas
- Call-to-action para acceder a expedientes
- Navegación centralizada con indicador de página activa
- Footer con información del sistema
- Redirige a /login si no hay sesión activa

### `/expedientes` - Gestión CRUD (Protegida)
- Tabla completa de expedientes del usuario autenticado
- **Crear**: Modal con formulario validado (título, descripción, estado)
- **Editar**: Modal pre-llenado con datos del expediente
- **Eliminar**: Modal de confirmación con advertencia
- Estados visuales: A (Activo/Verde), P (En Proceso/Azul), C (Cerrado/Gris), S (Suspendido/Amarillo)
- Loading overlay durante operaciones con blur de fondo
- Validación Zod en tiempo real con mensajes de error
- Feedback visual: spinners, mensajes de éxito/error
- Deshabilita botones durante operaciones asíncronas

## Validación con Zod

### Login
- Email: formato válido requerido
- Password: campo requerido

### Registro
- Nombre: 3-100 caracteres
- Email: formato válido con @
- Password:
  - Mínimo 8 caracteres
  - Al menos una mayúscula
  - Al menos una minúscula
  - Al menos un número
  - Al menos un carácter especial (!@#$%^&*)

### Expedientes
- Título: 5-200 caracteres
- Descripción: 10-2000 caracteres
- Estado: A, P, C o S

## Servicios

### authService (`lib/auth.ts`)
```typescript
setAuth(token, user)     // Guardar sesión
getToken()               // Obtener token
getUser()                // Obtener usuario
isAuthenticated()        // Verificar sesión
logout()                 // Cerrar sesión
```

### apiService (`lib/api.ts`)
```typescript
login(email, password)
register(email, password, fullName)
getCasos()
createCaso(data)
updateCaso(id, data)
deleteCaso(id)
```

## Diseño UI/UX

### Paleta de Colores
- **Color Primario**: `#1c0538` (rgb 28, 5, 56) - Morado oscuro profesional
- **Color de Texto en Inputs**: `#0f0228` - Morado más oscuro para mejor legibilidad
- **Fondo Principal**: Blanco limpio (`#ffffff`)
- **Fondo Secundario**: Gris claro (`bg-gray-50`)
- **Estados de Caso**:
  - Activo: Verde (`bg-green-50`, `text-green-700`)
  - En Proceso: Azul (`bg-blue-50`, `text-blue-700`)
  - Cerrado: Gris (`bg-gray-50`, `text-gray-700`)
  - Suspendido: Amarillo (`bg-yellow-50`, `text-yellow-700`)

### Interacciones
- **Bordes en Focus**: Color primario `#1c0538`
- **Hover States**: `cursor-pointer`, opacidad reducida, transiciones suaves
- **Modales**: Fondo translúcido `bg-black/30` con `backdrop-blur-sm`
- **Navegación Activa**: Border inferior sólido en página actual
- **Loading States**: Spinners con color primario, overlay blur durante operaciones
- **Responsive**: Mobile-first con Tailwind (breakpoints sm, md, lg)
- **Feedback Visual**: 
  - Spinners animados durante carga
  - Mensajes de éxito (verde) y error (rojo)
  - Validaciones inline en tiempo real
  - Deshabilitar botones durante operaciones

### Componentes Reutilizables
- **Header**: Logo, navegación centrada, logout - condicional según ruta y auth
- **Footer**: Copyright con año dinámico - condicional según ruta y auth
- **Modales**: Diseño consistente con border primario, blur de fondo, confirmaciones
- **Formularios**: Inputs con focus state, validación Zod, mensajes de error claros

## Buenas Prácticas Implementadas

✅ **Validación robusta**: Zod para todos los formularios con mensajes claros  
✅ **Feedback inmediato**: Loading states, spinners, mensajes de éxito/error  
✅ **Confirmaciones**: Modal de confirmación antes de eliminar expedientes  
✅ **Seguridad**: Validación de email, contraseñas fuertes con requisitos estrictos  
✅ **UX optimizada**: Deshabilitar botones durante operaciones, blur en modales  
✅ **Rutas protegidas**: Verificación de sesión antes de renderizar páginas  
✅ **Manejo de errores**: Captura y display de errores de API y validación  
✅ **Arquitectura limpia**: Componentes reutilizables (Header/Footer), servicios separados  
✅ **Hidratación SSR**: Prevención de errores de hidratación Next.js  
✅ **Estados sincronizados**: Re-evaluación de auth en cambios de ruta  
✅ **Accesibilidad**: Labels en formularios, estados visuales claros  
✅ **Performance**: Código optimizado, lazy loading implícito de Next.js

## Usuario de Prueba

```
Email: admin@nxtabogados.com
Password: 123456
```

## Scripts

```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Build optimizado para producción
npm start        # Ejecutar versión de producción
npm run lint     # ESLint
```

## Configuración Backend

El frontend se conecta al backend mediante variables de entorno.

**Configuración por defecto**: `http://localhost:4000`

Para cambiar la URL del backend:

1. Copiar `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Editar `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://tu-backend-url:puerto
   ```

3. Reiniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

**Importante**: El backend debe estar corriendo antes de iniciar el frontend.

```bash
# Terminal 2 - Frontend  
cd ../tec-practica-parte-03-frontend
npm run dev  # Puerto 3000
```

## 👨‍💻 Autor

Prueba Técnica para **NXT Abogados** - Parte 03

Autor: Andrés Arthuro Pineda Paredes
Fecha: Noviembre 2025

```
