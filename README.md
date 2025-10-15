# AVOPP - Aplicación de Organización y Visualización de Planificación Personal

Aplicación web moderna para la gestión de tareas académicas, diseñada para estudiantes universitarios que buscan optimizar su tiempo y mejorar su productividad.

## Descripción del Proyecto

AVOPP es una plataforma integral que permite a los estudiantes organizar sus tareas, clases y exámenes, con funcionalidades avanzadas de priorización automática, visualización de datos y sincronización con Moodle.

## Tecnologías Utilizadas

- **React 18** - Framework de interfaz de usuario
- **Vite** - Herramienta de construcción y desarrollo
- **Tailwind CSS** - Framework de estilos
- **date-fns** - Manejo de fechas
- **Recharts** - Visualización de datos
- **Lucide React** - Iconos

## Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build
```

## Estado de Implementación de Historias de Usuario

### 1. Edición de Tareas

**Estado:** Completada

**Descripción:** Los estudiantes pueden editar la información de tareas agregadas manualmente (nombre, fecha, descripción) para corregir errores o actualizar cambios sin necesidad de eliminarlas.

**Funcionalidades implementadas:**
- Formulario de edición completo con todos los campos de la tarea
- Actualización en tiempo real sin duplicados
- Interfaz modal para edición
- Validación de datos requeridos
- Botones de acción claramente identificados

---

### 2. Resumen Semanal

**Estado:** Completada

**Descripción:** Los estudiantes pueden ver un resumen gráfico con barras que muestran el número de entregas y exámenes por día de la semana para anticipar su carga académica.

**Funcionalidades implementadas:**
- Gráficos de barras dinámicos con datos reales del estudiante
- Actualización automática basada en tareas, clases y exámenes
- Navegación entre semanas (últimas 4 semanas)
- Cálculo automático de estadísticas semanales
- Gráfico circular de distribución de actividades
- Identificación del día más productivo
- Tasa de completado en tiempo real

---

### 3. Marcar Tareas como Completadas

**Estado:** Completada

**Descripción:** Los estudiantes pueden marcar tareas y evaluaciones como completadas dentro de la aplicación para llevar un control visual de su progreso.

**Funcionalidades implementadas:**
- Toggle de completado con checkbox visual
- Estilo tachado para tareas completadas
- Las tareas completadas permanecen en el historial
- Indicador visual distintivo (check icon)
- Reducción de opacidad para tareas completadas
- Persistencia del estado en el almacenamiento local
- Filtros para ver solo completadas o pendientes

---

### 4. Panel del Día

**Estado:** Completada

**Descripción:** Los estudiantes pueden ver en una sola pantalla sus clases, tareas y exámenes del día, diferenciados con iconos y checklists para planear mejor su jornada.

**Funcionalidades implementadas:**
- Vista filtrada mostrando solo eventos del día seleccionado
- Diferenciación por tipo: clases, tareas y exámenes con iconos únicos
- Navegación entre días (anterior/siguiente/hoy)
- Checklist integrado para marcar actividades completadas
- Contador de progreso diario (completadas/totales)
- Formato de fecha en español
- Estado vacío informativo cuando no hay actividades
- Secciones colapsables según contenido disponible

---

### 5. Priorización Automática

**Estado:** Completada

**Descripción:** Los estudiantes pueden ver un ranking de tareas ordenadas por urgencia y fecha de entrega, usando colores y categorías para organizarse mejor.

**Funcionalidades implementadas:**
- Cálculo automático de prioridad basado en:
  - Fecha de entrega (menos tiempo = mayor prioridad)
  - Tipo de actividad (examen > proyecto > tarea)
  - Estado de finalización
- Sistema de colores codificados:
  - Rojo: alta prioridad (menos de 48 horas)
  - Amarillo: media prioridad (3 a 5 días)
  - Verde: baja prioridad (más de 5 días)
- Ordenamiento automático de la lista de tareas
- Filtros por nivel de prioridad
- Actualización dinámica cuando cambian las fechas límite
- Opción de sobrescribir la prioridad manualmente
- Banner informativo sobre el sistema de priorización

---

### 6. Filtro por Materia

**Estado:** Completada

**Descripción:** Los estudiantes pueden filtrar las tareas y evaluaciones por materia para visualizar únicamente las actividades de un curso específico.

**Funcionalidades implementadas:**
- Búsqueda en tiempo real por nombre de curso o materia
- Filtrado combinable con otros criterios (prioridad, estado)
- Resultados instantáneos al escribir
- Indicador de resultados encontrados
- Opción para limpiar búsqueda rápidamente
- Búsqueda insensible a mayúsculas/minúsculas

---

## Características Adicionales

### Gestión de Tareas
- Crear, editar y eliminar tareas manualmente
- Sincronización con Moodle (preparado para integración)
- Categorización por tipo: tarea, proyecto, examen
- Asignación de fechas y horas de entrega
- Descripciones detalladas

### Visualización de Datos
- Dashboard con resumen de actividades
- Gráficos interactivos con tooltips
- Estadísticas en tiempo real
- Insights de productividad

### Panel de Notificaciones
- Recordatorios de entregas próximas
- Configuración de notificaciones personalizables
- Alertas de exámenes

### Sistema de Gamificación
- Desafíos semanales
- Sistema de insignias
- Seguimiento de rachas de productividad

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── Dashboard.jsx
│   ├── TaskManagement.jsx
│   ├── DailyPanel.jsx
│   ├── WeeklySummary.jsx
│   ├── Challenges.jsx
│   └── ...
├── context/            # Context API para estado global
│   └── AppContext.jsx
├── hooks/              # Custom Hooks
│   ├── useChallenges.js
│   └── useNotifications.js
├── services/           # Servicios y lógica de negocio
│   ├── priorityService.js
│   ├── weeklyService.js
│   └── moodleService.js
└── ...
```

## Servicios Implementados

### Priority Service
Gestiona el cálculo automático de prioridades y colores dinámicos basados en tiempo restante.

### Weekly Service
Genera datos semanales reales desde las tareas, clases y exámenes del estudiante.

### Moodle Service
Preparado para sincronización con plataforma Moodle (pendiente de integración backend).

## Persistencia de Datos

La aplicación utiliza `localStorage` para mantener el estado de las tareas, configuraciones y progreso del usuario entre sesiones.

## Diseño Responsive

La interfaz está optimizada para dispositivos móviles y de escritorio, con una navegación inferior tipo app móvil.

## Licencia

Este proyecto es parte de un desarrollo académico.

## Contacto

Para más información sobre el proyecto, consultar con el equipo de desarrollo.
