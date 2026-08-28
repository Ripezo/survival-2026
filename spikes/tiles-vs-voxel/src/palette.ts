/**
 * Paleta ÚNICA para los dos renderizadores, indexada por altura.
 *
 * Vive aquí por la misma razón que dpr.ts: si el 2D colorea por altura
 * y el 3D no, la pregunta "¿cuál se lee mejor?" queda contaminada —
 * estarías comparando 2D con sombreado contra 3D sin él.
 */
export const HEIGHT_COLORS = [
  "#5a7d3a", "#6b9142", "#7ba34d", "#8cb45a", "#9dc468", "#aed477",
] as const;

export const BLOCKED_COLOR = "#7a4b3a";

export function colorForHeight(h: number): string {
  return HEIGHT_COLORS[Math.min(Math.max(h, 0), HEIGHT_COLORS.length - 1)];
}
