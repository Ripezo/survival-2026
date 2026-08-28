import { World } from "../domain/world";

/**
 * Los dos renderizadores implementan esto y nada más. El bucle principal
 * y la entrada son idénticos para ambos: lo único que cambia es cómo se
 * dibuja el mismo mundo.
 */
export interface Renderer {
  readonly name: string;
  /** Convierte un punto de pantalla en celda del mundo, o null si no dio en el suelo. */
  pick(screenX: number, screenY: number): { x: number; y: number } | null;
  draw(world: World): void;
  resize(): void;
  dispose(): void;
}
