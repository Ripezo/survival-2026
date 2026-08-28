import { Grid, buildTestGrid } from "./grid";
import { findPath, Point } from "./pathfinding";

/**
 * Estado del mundo y su avance en el tiempo. Puro: recibe delta en
 * segundos y no sabe nada de cómo se dibuja.
 *
 * El actor guarda posición continua (x, y con decimales) para que el
 * movimiento sea suave, pero razona sobre celdas enteras.
 */
export class World {
  readonly grid: Grid;
  /** Posición continua del actor, en coordenadas de celda. */
  actor: { x: number; y: number } = { x: 2, y: 2 };
  /** Celdas pendientes de recorrer. */
  path: Point[] = [];
  /** Celdas por segundo. */
  speed = 4;

  constructor(grid?: Grid) {
    this.grid = grid ?? buildTestGrid();
    const start = this.grid.at(2, 2)!;
    start.walkable = true;
    start.height = Math.max(start.height, 0);
  }

  get cell(): Point {
    return { x: Math.round(this.actor.x), y: Math.round(this.actor.y) };
  }

  /** Altura interpolada bajo el actor, para que el 3D no dé saltos bruscos. */
  get actorHeight(): number {
    return this.grid.at(this.cell.x, this.cell.y)?.height ?? 0;
  }

  /** Click o tap en una celda: recalcula ruta desde donde esté. */
  moveTo(target: Point): boolean {
    const path = findPath(this.grid, this.cell, target);
    if (!path) return false;
    this.path = path;
    return true;
  }

  /** Movimiento directo por teclado: un paso si es transitable. */
  step(dx: number, dy: number): boolean {
    if (this.path.length > 0) this.path = [];
    const from = this.cell;
    const target = { x: from.x + dx, y: from.y + dy };
    const ok = this.grid.neighbours(from.x, from.y).some((n) => n.x === target.x && n.y === target.y);
    if (!ok) return false;
    this.path = [target];
    return true;
  }

  update(dt: number): void {
    if (this.path.length === 0) return;
    const next = this.path[0];
    const dx = next.x - this.actor.x;
    const dy = next.y - this.actor.y;
    const dist = Math.hypot(dx, dy);
    const travel = this.speed * dt;

    if (dist <= travel) {
      this.actor.x = next.x;
      this.actor.y = next.y;
      this.path.shift();
    } else {
      this.actor.x += (dx / dist) * travel;
      this.actor.y += (dy / dist) * travel;
    }
  }
}
