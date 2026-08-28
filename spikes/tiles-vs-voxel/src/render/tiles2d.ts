import { World } from "../domain/world";
import { Renderer } from "./renderer";
import { renderScale } from "../dpr";
import { colorForHeight, BLOCKED_COLOR } from "../palette";

const TILE_W = 48;
const TILE_H = 24;
const STEP_H = 12; // píxeles que sube un escalón de altura


/**
 * Tiles 2D en proyección isométrica sobre canvas.
 *
 * Sin librería a propósito: el objetivo es medir el coste de dibujar
 * rombos, no el de Pixi. Si este camino gana, Pixi entra después.
 */
export class Tiles2DRenderer implements Renderer {
  readonly name = "2D tiles (canvas)";
  private ctx: CanvasRenderingContext2D;
  private originX = 0;
  private originY = 0;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("sin contexto 2d");
    this.ctx = ctx;
    this.resize();
  }

  resize(): void {
    const dpr = renderScale();
    this.canvas.width = this.canvas.clientWidth * dpr;
    this.canvas.height = this.canvas.clientHeight * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.originX = this.canvas.clientWidth / 2;
    this.originY = 80;
  }

  private project(x: number, y: number, h: number) {
    return {
      sx: this.originX + (x - y) * (TILE_W / 2),
      sy: this.originY + (x + y) * (TILE_H / 2) - h * STEP_H,
    };
  }

  /** Inversa de la proyección. Ignora la altura: aproxima al plano base. */
  pick(screenX: number, screenY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const px = screenX - rect.left - this.originX;
    const py = screenY - rect.top - this.originY;
    const x = Math.round((px / (TILE_W / 2) + py / (TILE_H / 2)) / 2);
    const y = Math.round((py / (TILE_H / 2) - px / (TILE_W / 2)) / 2);
    return { x, y };
  }

  private diamond(sx: number, sy: number, fill: string) {
    const c = this.ctx;
    c.beginPath();
    c.moveTo(sx, sy);
    c.lineTo(sx + TILE_W / 2, sy + TILE_H / 2);
    c.lineTo(sx, sy + TILE_H);
    c.lineTo(sx - TILE_W / 2, sy + TILE_H / 2);
    c.closePath();
    c.fillStyle = fill;
    c.fill();
  }

  draw(world: World): void {
    const c = this.ctx;
    c.fillStyle = "#1b2430";
    c.fillRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

    const { grid } = world;
    const onPath = new Set(world.path.map((p) => p.y * grid.width + p.x));

    // Orden de pintor: de fondo a frente. En isométrico eso es x+y creciente.
    for (let sum = 0; sum <= grid.width + grid.height; sum++) {
      for (let x = 0; x < grid.width; x++) {
        const y = sum - x;
        if (y < 0 || y >= grid.height) continue;
        const cell = grid.at(x, y)!;
        const { sx, sy } = this.project(x, y, cell.height);

        // lados del bloque: lo que da sensación de volumen en 2D
        if (cell.height > 0) {
          const side = cell.height * STEP_H;
          c.fillStyle = "#3d5228";
          c.beginPath();
          c.moveTo(sx - TILE_W / 2, sy + TILE_H / 2);
          c.lineTo(sx, sy + TILE_H);
          c.lineTo(sx, sy + TILE_H + side);
          c.lineTo(sx - TILE_W / 2, sy + TILE_H / 2 + side);
          c.closePath();
          c.fill();
          c.fillStyle = "#2f411f";
          c.beginPath();
          c.moveTo(sx + TILE_W / 2, sy + TILE_H / 2);
          c.lineTo(sx, sy + TILE_H);
          c.lineTo(sx, sy + TILE_H + side);
          c.lineTo(sx + TILE_W / 2, sy + TILE_H / 2 + side);
          c.closePath();
          c.fill();
        }

        const fill = !cell.walkable
          ? BLOCKED_COLOR
          : onPath.has(y * grid.width + x)
            ? "#e8c46a"
            : colorForHeight(cell.height);
        this.diamond(sx, sy, fill);
      }
    }

    // actor
    const ah = world.actorHeight;
    const { sx, sy } = this.project(world.actor.x, world.actor.y, ah);
    c.fillStyle = "#e05a47";
    c.fillRect(sx - 9, sy + TILE_H / 2 - 30, 18, 30);
    c.fillStyle = "#f07a63";
    c.fillRect(sx - 9, sy + TILE_H / 2 - 30, 18, 8);
  }

  dispose(): void {}
}
