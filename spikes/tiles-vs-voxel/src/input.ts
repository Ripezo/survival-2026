import { World } from "./domain/world";
import { Renderer } from "./render/renderer";

/**
 * Teclado y tap sobre el MISMO mundo. Si la entrada fuese distinta entre
 * los dos renderizadores la comparación no valdría nada.
 *
 * Un tap se distingue de un arrastre por distancia y tiempo: sin esto,
 * cualquier roce en el móvil dispara un movimiento.
 */
export function attachInput(
  canvas: HTMLCanvasElement,
  world: World,
  getRenderer: () => Renderer,
): () => void {
  const keys: Record<string, [number, number]> = {
    ArrowUp: [0, -1], KeyW: [0, -1],
    ArrowDown: [0, 1], KeyS: [0, 1],
    ArrowLeft: [-1, 0], KeyA: [-1, 0],
    ArrowRight: [1, 0], KeyD: [1, 0],
  };

  const onKey = (e: KeyboardEvent) => {
    const dir = keys[e.code];
    if (!dir) return;
    e.preventDefault();
    world.step(dir[0], dir[1]);
  };

  let downAt: { x: number; y: number; t: number } | null = null;

  const onDown = (e: PointerEvent) => {
    downAt = { x: e.clientX, y: e.clientY, t: performance.now() };
  };

  const onUp = (e: PointerEvent) => {
    if (!downAt) return;
    const moved = Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y);
    const elapsed = performance.now() - downAt.t;
    downAt = null;
    if (moved > 12 || elapsed > 600) return; // fue arrastre o pulsación larga
    const cell = getRenderer().pick(e.clientX, e.clientY);
    if (cell) world.moveTo(cell);
  };

  window.addEventListener("keydown", onKey);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);

  return () => {
    window.removeEventListener("keydown", onKey);
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointerup", onUp);
  };
}
