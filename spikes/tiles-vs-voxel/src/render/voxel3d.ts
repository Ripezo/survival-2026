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

const VIEW = 22; // altura visible en unidades de mundo — controla el "zoom"

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
  private ground: Mesh;
  private blocked: Mesh;
  private actor: Mesh;

  constructor(private canvas: HTMLCanvasElement, world: World) {
    this.engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: false });
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.106, 0.141, 0.188, 1);

    const { grid } = world;
    const cx = grid.width / 2;
    const cz = grid.height / 2;

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

    const grassMat = new StandardMaterial("grass", this.scene);
    grassMat.diffuseColor = Color3.FromHexString("#7ba34d");
    grassMat.specularColor = Color3.Black();

    const rockMat = new StandardMaterial("rock", this.scene);
    rockMat.diffuseColor = Color3.FromHexString("#7a4b3a");
    rockMat.specularColor = Color3.Black();

    this.ground = MeshBuilder.CreateBox("ground", { size: 1 }, this.scene);
    this.ground.material = grassMat;
    this.blocked = MeshBuilder.CreateBox("blocked", { size: 1 }, this.scene);
    this.blocked.material = rockMat;

    // Una matriz por cubo. Se calcula una vez: el terreno no cambia.
    const walkable: Matrix[] = [];
    const walls: Matrix[] = [];
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const cell = grid.at(x, y)!;
        const target = cell.walkable ? walkable : walls;
        // apila desde el suelo hasta su altura: aspecto de mundo de bloques
        for (let h = 0; h <= cell.height; h++) {
          target.push(Matrix.Translation(x, h, y));
        }
      }
    }
    this.ground.thinInstanceAdd(walkable);
    this.blocked.thinInstanceAdd(walls);

    const actorMat = new StandardMaterial("actor", this.scene);
    actorMat.diffuseColor = Color3.FromHexString("#e05a47");
    actorMat.specularColor = Color3.Black();
    this.actor = MeshBuilder.CreateBox("actor", { width: 0.6, height: 1.2, depth: 0.6 }, this.scene);
    this.actor.material = actorMat;

    this.resize();
  }

  resize(): void {
    this.engine.resize();
    const aspect = this.engine.getRenderWidth() / this.engine.getRenderHeight();
    this.camera.orthoTop = VIEW / 2;
    this.camera.orthoBottom = -VIEW / 2;
    this.camera.orthoLeft = (-VIEW * aspect) / 2;
    this.camera.orthoRight = (VIEW * aspect) / 2;
  }

  /** Rayo de cámara contra los cubos: devuelve la celda tocada. */
  pick(screenX: number, screenY: number) {
    const rect = this.canvas.getBoundingClientRect();
    const hit = this.scene.pick(screenX - rect.left, screenY - rect.top, (m) => m === this.ground);
    if (!hit?.hit || !hit.pickedPoint) return null;
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
