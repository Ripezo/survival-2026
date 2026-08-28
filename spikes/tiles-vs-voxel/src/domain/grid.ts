// Dominio puro. Sin Babylon, sin DOM, sin window. Regla CLAUDE.md §24.3:
// esto debe poder correr en un test de Node, en el cliente y algún día
// en el servidor, sin tocar una línea.

export interface Cell {
  /** Altura en pasos enteros. El 2D la dibuja como offset; el 3D la apila. */
  height: number;
  walkable: boolean;
}

export class Grid {
  readonly cells: Cell[];

  constructor(
    readonly width: number,
    readonly height: number,
    cells?: Cell[],
  ) {
    this.cells = cells ?? new Array(width * height).fill(null).map(() => ({ height: 0, walkable: true }));
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  at(x: number, y: number): Cell | undefined {
    return this.inBounds(x, y) ? this.cells[y * this.width + x] : undefined;
  }

  /**
   * Vecinos transitables en 4 direcciones. Sin diagonales a propósito:
   * mantiene el movimiento legible en isométrico y evita el caso de
   * cortar esquinas entre dos bloques.
   *
   * Un escalón de más de `maxStep` no se puede subir — es lo que hace
   * que la altura sea gameplay y no decoración.
   */
  neighbours(x: number, y: number, maxStep = 1): Array<{ x: number; y: number }> {
    const from = this.at(x, y);
    if (!from) return [];
    const out: Array<{ x: number; y: number }> = [];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const nx = x + dx;
      const ny = y + dy;
      const cell = this.at(nx, ny);
      if (!cell || !cell.walkable) continue;
      if (Math.abs(cell.height - from.height) > maxStep) continue;
      out.push({ x: nx, y: ny });
    }
    return out;
  }
}

/**
 * Mundo de prueba determinista: una meseta, un foso y unas columnas.
 * Determinista a propósito — los dos renderizadores deben dibujar
 * exactamente el mismo mundo para que la comparación signifique algo.
 */
export function buildTestGrid(width = 32, height = 32): Grid {
  const grid = new Grid(width, height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = grid.at(x, y)!;
      // meseta suave en diagonal
      cell.height = Math.floor((Math.sin(x / 6) + Math.cos(y / 7)) * 1.5 + 1.5);
      // foso
      if (x > 12 && x < 18 && y > 6 && y < 24) {
        cell.height = 0;
        cell.walkable = x < 14 || x > 16; // un paso estrecho por el medio
      }
      // columnas: obstáculos altos e intransitables
      if (x % 9 === 4 && y % 11 === 5) {
        cell.height = 5;
        cell.walkable = false;
      }
    }
  }
  return grid;
}
