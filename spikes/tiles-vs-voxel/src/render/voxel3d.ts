import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { Vector3, Color3, Color4, Matrix } from "@babylonjs/core/Maths/math";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Camera } from "@babylonjs/core/Cameras/camera";
import "@babylonjs/core/Meshes/thinInstanceMesh";
import "@babylonjs/core/Culling/ray";

import { World } from "../domain/world";
import { Renderer } from "./renderer";
import { renderScale } from "../dpr";
import { HEIGHT_COLORS, colorForHeight, BLOCKED_COLOR } from "../palette";

/** Márgen alrededor del mundo, en celdas. */
const MARGIN = 3;

/**
 * Cubos 3D con cámara ortográfica en ángulo isométrico.
 *
 * El terreno entero se dibuja con thin instances: una sola malla y una
 * matriz por cubo, así que son pocas draw calls sin importar el tamaño
 * del mundo. Es la técnica que hace viable un mundo de bloques en móvil.
 */
export class Voxel3DRenderer implements Renderer {
  readonly name = "3D cubos (Babylon)";
  private engine: Engine;
  private scene: Scene;
  private camera: FreeCamera;
  /**
   * Una malla por nivel de altura. Las thin instances comparten material,
   * así que para colorear por altura hace falta una malla por color —
   * son 6, y sigue siendo un puñado de draw calls.
   */
  private grounds: Array<{ mesh: Mesh; cells: Array<{ x: number; y: number }> }> = [];
  private blocked: Mesh;
  private actor: Mesh;
  /** Altura visible en unidades de mundo. Deriva del tamaño de la rejilla. */
  private view: number;

  constructor(private canvas: HTMLCanvasElement, world: World) {
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: false });
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.106, 0.141, 0.188, 1);

    const { grid } = world;
    const cx = grid.width / 2;
    const cz = grid.height / 2;
    // En vista isométrica el mundo se proyecta en diagonal, así que la
    // altura visible que hace falta va con la suma de los dos lados.
    this.view = (grid.width + grid.height) * 0.62 + MARGIN;

    // Cámara ortográfica en ángulo isométrico clásico. Sin rotación:
    // CLAUDE.md §24.5 la deja revisable, así que no se hornea nada que
    // dependa de que sea fija.
    this.camera = new FreeCamera("cam", new Vector3(cx + 30, 34, cz - 30), this.scene);
    this.camera.mode = Camera.ORTHOGRAPHIC_CAMERA;
    this.camera.setTarget(new Vector3(cx, 0, cz));
    this.camera.minZ = -100;
    this.camera.maxZ = 300;

    const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0), this.scene);
    hemi.intensity = 0.75;
    const sun = new DirectionalLight("sun", new Vector3(-0.6, -1, 0.5), this.scene);
    sun.intensity = 1.1;

    const rockMat = new StandardMaterial("rock", this.scene);
    rockMat.diffuseColor = Color3.FromHexString(BLOCKED_COLOR);
    rockMat.specularColor = Color3.Black();

    this.blocked = MeshBuilder.CreateBox("blocked", { size: 1 }, this.scene);
    this.blocked.material = rockMat;

    for (let level = 0; level < HEIGHT_COLORS.length; level++) {
      const mat = new StandardMaterial(`ground${level}`, this.scene);
      mat.diffuseColor = Color3.FromHexString(colorForHeight(level));
      mat.specularColor = Color3.Black();
      const mesh = MeshBuilder.CreateBox(`ground${level}`, { size: 1 }, this.scene);
      mesh.material = mat;
      this.grounds.push({ mesh, cells: [] });
    }

    // Una matriz por cubo. Se calcula una vez: el terreno no cambia.
    const byLevel: Matrix[][] = this.grounds.map(() => []);
    const walls: Matrix[] = [];
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const cell = grid.at(x, y)!;
        const level = Math.min(Math.max(cell.height, 0), this.grounds.length - 1);
        // apila desde el suelo hasta su altura: aspecto de mundo de bloques
        for (let h = 0; h <= cell.height; h++) {
          if (cell.walkable) {
            byLevel[level].push(Matrix.Translation(x, h, y));
            // índice de instancia -> celda, para el picking exacto
            this.grounds[level].cells.push({ x, y });
          } else {
            walls.push(Matrix.Translation(x, h, y));
          }
        }
      }
    }
    this.grounds.forEach((g, i) => g.mesh.thinInstanceAdd(byLevel[i]));
    this.blocked.thinInstanceAdd(walls);

    // BUG 1 — el terreno entero desaparecía.
    // thinInstanceAdd no actualiza el bounding box de la malla: se queda
    // siendo el cubo origen de 1x1x1 en (0,0,0). Como ese cubo cae fuera
    // del frustum, el culling se lleva la malla y con ella TODAS sus
    // instancias. Hay que recalcularlo contando las instancias.
    this.grounds.forEach((g) => g.mesh.thinInstanceRefreshBoundingInfo(true));
    this.blocked.thinInstanceRefreshBoundingInfo(true);

    // BUG 2 — el tap no acertaba nunca.
    // scene.pick ignora las thin instances salvo que se habilite: sin
    // esto el rayo solo se prueba contra la malla origen. Default false.
    this.grounds.forEach((g) => (g.mesh.thinInstanceEnablePicking = true));

    const actorMat = new StandardMaterial("actor", this.scene);
    actorMat.diffuseColor = Color3.FromHexString("#e05a47");
    actorMat.specularColor = Color3.Black();
    this.actor = MeshBuilder.CreateBox("actor", { width: 0.6, height: 1.2, depth: 0.6 }, this.scene);
    this.actor.material = actorMat;

    this.resize();
  }

  resize(): void {
    // Misma densidad de píxeles que el renderizador 2D. Sin esto Babylon
    // dibuja a 1x mientras el canvas 2D dibuja a 2x, y comparar sus fps
    // no mide nada.
    this.engine.setHardwareScalingLevel(1 / renderScale());
    this.engine.resize();
    const aspect = this.engine.getRenderWidth() / this.engine.getRenderHeight();
    const v = this.view;
    this.camera.orthoTop = v / 2;
    this.camera.orthoBottom = -v / 2;
    this.camera.orthoLeft = (-v * aspect) / 2;
    this.camera.orthoRight = (v * aspect) / 2;
  }

  /**
   * Rayo de cámara contra los cubos: devuelve la celda tocada.
   *
   * Se usa el índice de la thin instance en vez de redondear el punto de
   * impacto: al tocar el lateral de un cubo el punto cae justo en el
   * borde (x.5) y el redondeo es ambiguo. El índice es exacto.
   *
   * Babylon compensa internamente el hardware scaling, así que aquí se
   * pasan píxeles CSS.
   */
  pick(screenX: number, screenY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const hit = this.scene.pick(
      screenX - rect.left,
      screenY - rect.top,
      (m) => this.grounds.some((g) => g.mesh === m),
    );
    if (!hit?.hit || !hit.pickedMesh) return null;
    const group = this.grounds.find((g) => g.mesh === hit.pickedMesh);
    const cell = group?.cells[hit.thinInstanceIndex];
    if (cell) return { x: cell.x, y: cell.y };
    if (!hit.pickedPoint) return null;
    return { x: Math.round(hit.pickedPoint.x), y: Math.round(hit.pickedPoint.z) };
  }

  draw(world: World): void {
    this.actor.position.set(world.actor.x, world.actorHeight + 1.1, world.actor.y);
    this.scene.render();
  }

  dispose(): void {
    this.scene.dispose();
    this.engine.dispose();
  }
}
