# Progreso

## 2026-04-20
- Se creó un plan enterprise en Markdown para todos los pendientes visibles entre las líneas 247 y 322 de `checklist-tecnica.html`.
- Se respetó el alcance pedido sin leer más allá de ese tramo para definir el plan.
- Se completó la fase 1 de JavaScript:
  - Meta Pixel pasó a carga diferida sin romper tracking en cola.
  - `BookingSection`, `AdminLogin` y `AdminDashboard` quedaron en lazy loading.
  - El build validó chunks separados para código no crítico.
- Se completó la fase 2 de caché y entrega:
  - política de caché larga para assets estáticos/versionados
  - revalidación corta para HTML
  - configuración lista para Vercel y Netlify
- Se avanzó en la fase 3 de peso total:
  - minificación productiva confirmada
  - secciones below-the-fold diferidas por visibilidad
  - chunk principal reducido drásticamente mediante lazy loading y manual chunks
