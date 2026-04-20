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
