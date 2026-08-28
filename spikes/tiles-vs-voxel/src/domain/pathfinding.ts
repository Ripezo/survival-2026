import { Grid } from "./grid";

export interface Point { x: number; y: number }

/**
 * A* sobre rejilla, heurística Manhattan (coherente con vecindario de 4).
 *
 * Cola de prioridad por array ordenado: sobra de largo para 32x32.
 * Si el mundo crece a miles de celdas, esto se cambia por un binary heap
 * — pero no antes, §24.6: no construir lo que la maqueta no necesita.
 */
export function findPath(grid: Grid, start: Point, goal: Point): Point[] | null {
  const key = (p: Point) => p.y * grid.width + p.x;
  const goalCell = grid.at(goal.x, goal.y);
  if (!goalCell || !goalCell.walkable) return null;
  if (start.x === goal.x && start.y === goal.y) return [];

  const h = (p: Point) => Math.abs(p.x - goal.x) + Math.abs(p.y - goal.y);

  const open: Array<{ p: Point; f: number }> = [{ p: start, f: h(start) }];
  const cameFrom = new Map<number, Point>();
  const gScore = new Map<number, number>([[key(start), 0]]);
  const closed = new Set<number>();

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const { p: current } = open.shift()!;
    const ck = key(current);
    if (closed.has(ck)) continue;
    closed.add(ck);

    if (current.x === goal.x && current.y === goal.y) {
      const path: Point[] = [];
      let node: Point | undefined = current;
      while (node && !(node.x === start.x && node.y === start.y)) {
        path.push(node);
        node = cameFrom.get(key(node));
      }
      return path.reverse();
    }

    for (const next of grid.neighbours(current.x, current.y)) {
      const nk = key(next);
      if (closed.has(nk)) continue;
      // subir cuesta cuesta más: el camino prefiere rodear a escalar
      const climb = Math.abs(grid.at(next.x, next.y)!.height - grid.at(current.x, current.y)!.height);
      const tentative = gScore.get(ck)! + 1 + climb * 0.5;
      if (tentative < (gScore.get(nk) ?? Infinity)) {
        cameFrom.set(nk, current);
        gScore.set(nk, tentative);
        open.push({ p: next, f: tentative + h(next) });
      }
    }
  }
  return null;
}
