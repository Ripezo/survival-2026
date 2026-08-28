import { World } from "./domain/world";
import { Renderer } from "./render/renderer";
import { Tiles2DRenderer } from "./render/tiles2d";
import { Voxel3DRenderer } from "./render/voxel3d";
import { attachInput } from "./input";
import { Hud } from "./hud";

type Mode = "2d" | "3d";

const stage = document.getElementById("stage") as HTMLDivElement;
const toggle = document.getElementById("toggle") as HTMLButtonElement;

// UN mundo. Los dos renderizadores lo comparten y no lo modifican:
// esto es lo que hace honesta la comparación, y es la razón de ser
// de la regla del dominio puro (CLAUDE.md §24.3).
const world = new World();
const hud = new Hud(document.body);

let mode: Mode = "2d";
let renderer: Renderer;
let canvas: HTMLCanvasElement;

function mount(next: Mode) {
  renderer?.dispose();
  stage.innerHTML = "";
  canvas = document.createElement("canvas");
  stage.appendChild(canvas);

  mode = next;
  renderer = next === "2d" ? new Tiles2DRenderer(canvas) : new Voxel3DRenderer(canvas, world);
  toggle.textContent = next === "2d" ? "Ver en 3D →" : "← Ver en 2D";
  detach?.();
  detach = attachInput(canvas, world, () => renderer);
  hud.reset();
}

let detach: (() => void) | undefined;
mount("2d");

toggle.addEventListener("click", () => mount(mode === "2d" ? "3d" : "2d"));
window.addEventListener("resize", () => renderer.resize());

let previous = performance.now();
function loop() {
  const now = performance.now();
  world.update(Math.min((now - previous) / 1000, 0.1));
  previous = now;
  renderer.draw(world);
  hud.frame(renderer.name);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
