/**
 * Medición. Es el punto del spike: no sirve de nada comparar dos
 * renderizadores "a ojo" en el portátil.
 *
 * Se muestra el percentil 95 del tiempo de fotograma además de la media,
 * porque los tirones son lo que se nota y la media los esconde.
 */
export class Hud {
  private samples: number[] = [];
  private last = performance.now();
  private el: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement("div");
    this.el.className = "hud";
    container.appendChild(this.el);
  }

  frame(rendererName: string): void {
    const now = performance.now();
    this.samples.push(now - this.last);
    this.last = now;
    if (this.samples.length < 30) return;
    if (this.samples.length > 180) this.samples.shift();

    const sorted = [...this.samples].sort((a, b) => a - b);
    const avg = this.samples.reduce((a, b) => a + b, 0) / this.samples.length;
    const p95 = sorted[Math.floor(sorted.length * 0.95)];

    this.el.innerHTML =
      `<strong>${rendererName}</strong>` +
      `<span>${(1000 / avg).toFixed(0)} fps</span>` +
      `<span>media ${avg.toFixed(1)} ms</span>` +
      `<span>p95 ${p95.toFixed(1)} ms</span>`;
  }

  reset(): void {
    this.samples = [];
    this.last = performance.now();
  }
}
