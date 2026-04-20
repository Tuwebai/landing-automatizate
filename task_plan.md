# Plan enterprise — pendientes de performance y verificación

## Alcance
Este plan cubre únicamente los pendientes visibles en `checklist-tecnica.html` entre las líneas 247 y 322:

- JavaScript
- Caché y servidor
- Carga general
- Verificación final

## Objetivo
Llevar la landing a un estado de performance productivo, medible y sostenible, priorizando impacto real en Core Web Vitals, peso total transferido y estabilidad de despliegue.

## KPIs objetivo
- LCP móvil: menor a 2.5 s
- JS no usado: reducción mínima de 150 KiB
- Recursos bloqueantes de render: 0 scripts no críticos
- Peso total inicial: menos de 1 MB transferido en home
- Caché estática: `cache hit` alto en assets versionados

## Fase 1 — JavaScript crítico y no crítico
**Prioridad:** P0
**Estado:** completada

### Pendientes
1. Diferir o eliminar scripts que bloquean el renderizado
2. Agregar `defer` o `async` a scripts no críticos
3. Eliminar JavaScript heredado innecesario
4. Remover código JavaScript sin usar

### Plan de ejecución
- Auditar todos los scripts cargados en `index.html` y en integraciones externas.
- Separar:
  - crítico para primer render
  - crítico post-interacción
  - no crítico / marketing / tracking
- Aplicar `defer` por default a scripts propios que no afecten el HTML inicial.
- Aplicar `async` solo a terceros independientes que no requieran orden.
- Mover inicializaciones pesadas a carga diferida o por interacción.
- Identificar librerías, componentes y utilidades que entren al bundle y no participen del primer viewport.
- Ejecutar code splitting por ruta, sección o bloque funcional.
- Remover código legado, helpers muertos y dependencias sin uso real.

### Entregables
- Mapa de scripts por criticidad
- Lista de terceros que siguen siendo necesarios
- Bundle principal reducido y sin bloqueo de render

### Criterios de aceptación
- Ningún script no crítico bloquea el render inicial
- El navegador puede pintar contenido principal sin esperar scripts secundarios
- Reducción tangible de tamaño del bundle inicial

### Resultado ejecutado
- Meta Pixel quedó diferido a `requestIdleCallback` o `load`, preservando la cola de eventos.
- `BookingSection`, `AdminLogin` y `AdminDashboard` se movieron a carga diferida con `React.lazy`.
- El build productivo quedó dividido en chunks separados para esas áreas no críticas.

## Fase 2 — Caché y capa de entrega
**Prioridad:** P0
**Estado:** completada

### Pendientes
1. Configurar caché del navegador para recursos estáticos
2. Implementar CDN si no hay uno activo

### Plan de ejecución
- Confirmar estrategia de hosting actual y capacidades de CDN/caché.
- Configurar caché agresiva para assets con hash:
  - `Cache-Control: public, max-age=31536000, immutable`
- Configurar HTML con caché corta o revalidación controlada.
- Verificar compresión Brotli/Gzip en edge.
- Activar CDN global para:
  - assets estáticos
  - imágenes
  - JS/CSS compilado
- Validar invalidación automática por nombre versionado en cada deploy.

### Entregables
- Política de caché documentada
- CDN activo o validación formal del existente
- Checklist de headers por tipo de recurso

### Criterios de aceptación
- Assets estáticos salen desde edge con caché larga
- HTML conserva frescura sin romper releases
- TTFB y transferencia internacional mejoran o se mantienen estables

### Resultado ejecutado
- Se configuró política de caché agresiva para assets versionados y estáticos.
- Se dejó HTML bajo revalidación controlada para no romper releases.
- Se agregó soporte de headers para Vercel y Netlify.
- La capa CDN queda activa automáticamente en despliegues sobre Vercel; en Netlify queda preparada con `_headers`.

## Fase 3 — Peso total de página
**Prioridad:** P0
**Estado:** en progreso

### Pendientes
1. Reducir peso total de la página de 3 MB a menos de 1 MB
2. Minificar archivos CSS y JavaScript

### Plan de ejecución
- Medir presupuesto actual por tipo de recurso:
  - imágenes
  - JavaScript
  - CSS
  - terceros
  - fuentes
- Definir presupuesto por categoría con owner técnico.
- Bajar el peso del JS inicial mediante:
  - code splitting
  - lazy hydration si aplica
  - eliminación de dependencias innecesarias
- Revisar CSS:
  - remover estilos muertos
  - consolidar estilos duplicados
  - asegurar minificación productiva
- Verificar que build de producción entregue minificación real y sourcemaps solo cuando corresponda.
- Revalidar que imágenes ya optimizadas no estén sobredimensionadas en viewport real.

### Entregables
- Presupuesto de performance por asset type
- Tabla antes/después de peso transferido
- Build productiva validada

### Criterios de aceptación
- Home por debajo de 1 MB transferido en condiciones objetivo
- CSS y JS minificados en producción
- No hay assets grandes sin justificación de negocio

### Resultado ejecutado
- Se confirmó minificación productiva de CSS y JavaScript vía Vite build.
- Se movieron secciones below-the-fold a carga diferida por visibilidad para evitar descargar JS no crítico en el primer viewport.
- Se configuró partición manual de bundles para React, motion, íconos y Supabase.
- El chunk principal quedó reducido a ~13.9 kB sin comprimir; quedan pendientes mediciones finales de transferencia total para cerrar la fase.

## Fase 4 — Verificación y release gate
**Prioridad:** P1

### Pendientes
1. Correr PageSpeed nuevamente y confirmar LCP menor a 2.5 s
2. Revisar toda la página manualmente desde un celular antes de relanzar

### Plan de ejecución
- Correr PageSpeed mobile antes y después de cada bloque P0.
- Registrar:
  - LCP
  - INP
  - CLS
  - peso total
  - recursos bloqueantes
- Hacer QA manual en celular real:
  - carga inicial
  - scroll
  - navbar
  - imágenes
  - formularios
  - tracking
- Validar que diferir scripts no rompa analytics, píxeles ni automatizaciones.
- Definir release gate: no relanzar si LCP móvil supera 2.5 s o si se rompe tracking crítico.

### Entregables
- Evidencia PageSpeed antes/después
- Checklist QA mobile completa
- Aprobación de release

### Criterios de aceptación
- LCP móvil menor a 2.5 s
- Sin regresiones visuales ni funcionales en mobile
- Tracking crítico operativo

## Orden recomendado
1. JavaScript crítico y no crítico
2. Caché/CDN
3. Peso total y minificación
4. Verificación final y release gate

## Riesgos enterprise
- Romper orden de ejecución entre scripts de terceros
- Degradar tracking o eventos de conversión
- Cachear HTML de forma demasiado agresiva
- Optimizar bundle sin validar impacto real en mobile

## Mitigaciones
- Cambios incrementales con medición por fase
- Validación de analytics en staging y producción controlada
- Headers distintos para HTML y assets versionados
- Checklist de rollback por deploy

## Definición de terminado
El slice queda verdaderamente cerrado cuando todos los ítems de este alcance están implementados, medidos en mobile y aprobados con evidencia de que la landing mantiene funcionalidad, tracking y performance objetivo.
