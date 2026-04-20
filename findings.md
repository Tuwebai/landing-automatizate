# Findings

## Alcance relevado
- Se tomó únicamente el bloque de `checklist-tecnica.html` entre las líneas 247 y 322.
- Los pendientes se agrupan en cuatro áreas: JavaScript, caché/servidor, carga general y verificación final.

## Hallazgos clave
- La mayor palanca declarada es eliminar bloqueo de render por JavaScript.
- El objetivo de negocio/performance más exigente es bajar la página de 3 MB a menos de 1 MB.
- El cierre correcto requiere validación técnica y QA manual en celular real.

## Fase 1 ejecutada
- El único script de terceros visible en `index.html` era Meta Pixel.
- Ese script quedó con carga no bloqueante: cola inmediata y descarga diferida.
- La app principal ya usa `type=\"module\"`, por lo que no bloquea render como un script clásico.
- El bundle quedó particionado:
  - `BookingSection`: 21.15 kB
  - `AdminLogin`: 5.66 kB
  - `AdminDashboard`: 19.16 kB
  - `index`: 372.10 kB

## Fase 2 ejecutada
- El proyecto no tenía configuración previa de hosting ni headers de caché.
- Se agregó `vercel.json` para servir assets desde edge con caché larga en despliegues Vercel.
- Se agregó `public/_headers` para compatibilidad equivalente en Netlify.
- La estrategia aplicada es:
  - assets hashados y recursos estáticos: `public, max-age=31536000, immutable`
  - HTML/documentos: `public, max-age=0, must-revalidate`

## Fase 3 ejecutada parcialmente
- La build de producción ya minifica CSS y JS.
- Secciones no críticas del home ahora se descargan por visibilidad, no en el primer viewport.
- Se forzó chunking por dominios técnicos:
  - `react-vendor`
  - `motion-vendor`
  - `supabase`
- El entry chunk bajó de ~372 kB a ~13.9 kB sin comprimir.
- Aún falta validar el peso total transferido de la home contra el objetivo de menos de 1 MB.
