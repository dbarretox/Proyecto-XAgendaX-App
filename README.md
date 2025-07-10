# XAgendaX 📅

Sistema de gestión de citas y agendas para salones de belleza, spas y negocios de servicios. Desarrollado con Next.js, TypeScript y Supabase.

## 🚀 Estado del Proyecto

### ✅ Completado
- Configuración inicial de Next.js con TypeScript y Tailwind CSS
- Integración con Supabase (autenticación y base de datos)
- Sistema de autenticación funcional
- Layout compartido con sidebar responsive y header
- Dashboard con métricas visuales
- Navegación dinámica con resaltado de página activa
- Protección de rutas centralizada

### 🔄 En Progreso
- Configuración de tablas en Supabase (clientes, citas, servicios)
- Página de Clientes con CRUD básico
- Conexión del dashboard con datos reales

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 + React + TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Hosting**: Vercel (preparado)
- **Iconos**: Lucide React

## 📁 Estructura del Proyecto

```
xagendax/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Grupo de rutas autenticadas
│   │   │   ├── layout.tsx        # Layout con sidebar y header
│   │   │   └── dashboard/
│   │   │       └── page.tsx      # Página principal del dashboard
│   │   ├── login/
│   │   │   └── page.tsx          # Página de login
│   │   ├── page.tsx              # Redirección a /dashboard
│   │   ├── layout.tsx            # Layout raíz
│   │   └── globals.css           # Estilos globales
│   └── lib/
│       └── supabase.ts           # Cliente de Supabase
├── .env.local                    # Variables de entorno (no commitear)
└── [archivos de configuración]
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/xagendax.git
cd xagendax
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env.local` en la raíz:
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🔐 Credenciales de Prueba

- **Email**: dev@dbarreto.net
- **Password**: password123

## 📋 Funcionalidades Planificadas

### Fase 1: Base (En progreso)
- [x] Setup inicial y autenticación
- [x] Layout compartido
- [ ] CRUD de clientes
- [ ] Tablas en Supabase

### Fase 2: Calendario
- [ ] Sistema de agendamiento
- [ ] Vista de calendario
- [ ] Gestión de citas

### Fase 3: Pagos y Finanzas
- [ ] Registro de pagos (efectivo, transferencia)
- [ ] Cálculo de comisiones
- [ ] Reportes financieros

### Fase 4: Comunicación
- [ ] Integración con WhatsApp (enlaces directos)
- [ ] Recordatorios por email
- [ ] Encuestas de satisfacción

### Fase 5: Analytics
- [ ] Dashboard avanzado
- [ ] Exportación de reportes (PDF/Excel)
- [ ] Métricas de negocio

### Fase 6: Multi-tenant
- [ ] Subdominios por cliente
- [ ] Gestión de múltiples negocios

## 🤝 Contribuir

Este es un proyecto en desarrollo activo. Si encuentras bugs o tienes sugerencias:

1. Abre un issue describiendo el problema/sugerencia
2. Haz fork del proyecto
3. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
4. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
5. Push a la rama (`git push origin feature/AmazingFeature`)
6. Abre un Pull Request

## 📝 Notas de Desarrollo

- **Principiante-friendly**: Código comentado y estructurado para aprendizaje
- **Mobile-first**: Diseño responsive desde el inicio
- **TypeScript estricto**: Para mejor mantenibilidad
- **Componentes reutilizables**: Arquitectura modular

## 🐛 Problemas Conocidos

- El título del header está hardcodeado como "Dashboard" (pendiente hacerlo dinámico)

## 📄 Licencia

Este proyecto está bajo desarrollo privado. Todos los derechos reservados.

---

**Desarrollado con 💙 mientras aprendo React/TypeScript**