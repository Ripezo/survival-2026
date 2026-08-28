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

## Fallos encontrados y corregidos (2026-08-28)

Reportado: *"en móvil la vista 3D no responde al tap"*. Al verificarlo en navegador
aparecieron dos, y el segundo era peor que el reportado.

**1. El terreno entero era invisible.** `thinInstanceAdd()` **no** actualiza el bounding
box de la malla: se queda siendo el cubo origen de 1×1×1 en (0,0,0). Como ese cubo cae
fuera del frustum, el culling se llevaba la malla y con ella todas sus instancias — se
veía solo el actor. Se arregla con `thinInstanceRefreshBoundingInfo(true)`.

**2. El tap no acertaba nunca.** `scene.pick` ignora las thin instances salvo que se
active `thinInstanceEnablePicking = true` (por defecto `false`). Sin eso, el rayo solo
se prueba contra la malla origen. El picking usa ahora el **índice de instancia** en vez
de redondear el punto de impacto: al tocar el lateral de un cubo el punto cae en el borde
(x.5) y el redondeo es ambiguo.

Ninguno de los dos era específico de móvil. Se notaron ahí porque en escritorio se estaba
usando el teclado.

### Dos correcciones que invalidaban la comparación

Aparte de los fallos, el spike medía mal:

- **Densidad de píxeles distinta.** El canvas 2D dibujaba a 2× y Babylon a 1×, o sea el
  2D hacía cuatro veces el trabajo de píxel. Comparar sus fps no medía nada. Ahora ambos
  usan `src/dpr.ts`, política única.
- **Sombreado por altura solo en 2D.** El 2D coloreaba cada tile según su altura y el 3D
  era todo verde plano, así que la pregunta "¿cuál se lee mejor?" venía contaminada.
  Ahora ambos usan `src/palette.ts`, la misma paleta.

Que los dos fallos fueran de *justicia de la medición* y no de código es lo esperable en
un benchmark: **lo que invalida una comparación no suele ser un bug, es una asimetría que
nadie miró.**

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
