# FinanzasKata - Seguidor de Finanzas Personales

Aplicación web responsiva para el registro manual de finanzas, construida con Next.js 14, Tailwind CSS y LocalStorage.

## Instalación

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

3.  **Abrir en el navegador:**
    Visita [http://localhost:3000](http://localhost:3000).

## Características

- **Dashboard:** Resumen de saldo, ingresos, gastos y ahorro. Gráficos y movimientos recientes.
- **Movimientos:** Registro manual de Ingresos, Gastos y Aportes a Metas. Filtros por mes.
- **Presupuesto:** Establece límites mensuales por categoría y visualiza tu progreso.
- **Metas:** Crea objetivos de ahorro y registra aportes para ver tu avance.
- **Ajustes:** Gestiona categorías personalizadas y datos (borrado de caché).
- **Modo Oscuro:** Automático según preferencia del sistema.

## Estructura del Proyecto

- `src/app`: Páginas y Layout (App Router).
- `src/components`: Componentes reutilizables (UI, Dashboard, Forms).
- `src/hooks`: Lógica de negocio y acceso a datos (LocalStorage).
- `src/lib`: Utilidades y repositorio de almacenamiento.
- `src/types`: Definiciones de TypeScript.

## Notas Técnicas

- Los datos se guardan en el `localStorage` del navegador. **No borres el caché** si quieres conservar tus registros.
- Diseñado con enfoque "Mobile First" para uso fácil en celulares.
