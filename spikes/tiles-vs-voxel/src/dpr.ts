/**
 * Densidad de píxeles, ÚNICA para los dos renderizadores.
 *
 * Vive aquí y no duplicada en cada uno a propósito: si divergen, uno
 * dibuja 4x los píxeles del otro y la comparación de fps deja de
 * significar nada. Es exactamente el fallo que tenía este spike.
 */
export function renderScale(): number {
  return Math.min(window.devicePixelRatio || 1, 2);
}
