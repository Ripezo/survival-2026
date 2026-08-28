# Spike — tiles 2D vs cubos 3D

Compara las dos direcciones técnicas **sobre el mismo mundo**: un cubo que camina por
una rejilla con A\*, controlado por teclado en escritorio y por taps en móvil.

No es el juego. Es una medición, y está pensado para borrarse o absorberse.

## Correr

```bash
npm install
npm run dev        # imprime también la URL de red
```

Abre la URL `Network:` **en el móvil, en la misma wifi**. Ese es el punto del spike;
medirlo solo en el portátil no responde nada (CLAUDE.md §24.8).

## Qué comparar

El botón de abajo alterna entre los dos renderizadores en caliente, sin recargar y
**sin reiniciar el mundo** — el actor se queda donde estaba. Camina un rato en uno,
cambia, y compara la misma escena.

El HUD de arriba muestra fps, media de tiempo de fotograma y **p95**. Mira el p95:
la media esconde los tirones, y los tirones son lo que se nota al jugar.

Preguntas que este spike responde:

1. ¿Cuántos fps da cada uno en tu móvil de gama media?
2. ¿Se calienta el teléfono? Déjalo tres minutos en cada modo.
3. ¿El tap acierta la celda que querías en los dos? (en 2D el picking ignora la
   altura; en 3D es un rayo real — se nota en las zonas altas)
4. ¿Cuál se *lee* mejor en una pantalla de 6"?

## Qué mide y qué no

**Sí mide:** coste de dibujado, respuesta táctil, precisión del picking, legibilidad,
comportamiento térmico.

**No mide:** cómo se ve con arte de verdad. Los dos usan cubos de colores planos a
propósito — el objetivo es aislar el coste de la presentación, no juzgar estética.

**Un dato que ya salió, antes de medir nada:** el bundle de producción pesa
**~261 kB gzip**, y casi todo es Babylon. El renderizador 2D no necesita ninguna
dependencia. Eso es coste de arranque en móvil, y cuenta en la decisión.

## Estructura

```
src/
├── domain/          TS puro — sin Babylon, sin DOM, sin window
│   ├── grid.ts          rejilla, alturas, transitabilidad, escalón máximo
│   ├── pathfinding.ts   A* con heurística Manhattan
│   └── world.ts         estado y avance en el tiempo
├── render/
│   ├── renderer.ts      la interfaz que ambos implementan
│   ├── tiles2d.ts       canvas 2D, proyección isométrica, orden de pintor
│   └── voxel3d.ts       Babylon, thin instances, cámara ortográfica
├── input.ts         teclado + tap, idéntico para los dos
└── hud.ts           medición
```

`domain/` no importa nada de `render/`. Es la regla de la §24.3, y aquí se ve para qué
sirve: **el mismo dominio alimenta dos presentaciones incompatibles sin enterarse.**
Si mañana se decide 2D, el dominio no cambia. Si se decide 3D, tampoco.

Ese código es el único de este spike que merece sobrevivir.
