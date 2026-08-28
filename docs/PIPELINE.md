# Pipeline de assets — mapa para investigar

Resumen del pipeline definido en `CLAUDE.md` §24.2, pensado como **punto de partida
para buscar información**, no como tutorial.

Cada bloque trae: qué es, qué se decidió, y **qué buscar** — los términos van en inglés
porque es donde está la documentación y los tutoriales. Los enlaces son puntos de entrada
oficiales; verifícalos, pueden cambiar.

---

## El pipeline de un vistazo

```
Blender / IA 3D          modelado low-poly
      ↓
   esqueleto             UN humanoide compartido, 26 huesos, T-pose
      ↓
   skinning              máx. 4 influencias por vértice
      ↓
  export .glb            glTF 2.0 binario, escala 1, sellado con skeletonVersion
      ↓
   validador             rechaza lo que se desvía del manifest
      ↓
   Babylon.js            carga, ensambla el avatar, tinta, anima
```

---

## 1. Formato: glTF 2.0 / `.glb`

**Decidido:** `.glb` (binario, un fichero) para runtime. `.blend` fuera del repo.
Compresión existe como etapa pero **apagada** hasta que un presupuesto la exija.

glTF es el estándar de Khronos para 3D en la web. Se le llama "el JPEG del 3D".
Babylon lo carga de forma nativa.

**Qué buscar:**
- `glTF 2.0 specification` — la espec oficial
- `glb vs gltf difference` — por qué binario
- `Blender glTF export settings` — la parte que más se equivoca la gente
- `KHR_materials_unlit` — extensión clave para toon: desactiva la iluminación PBR
- `EXT_meshopt_compression`, `KHR_texture_basisu` — compresión, para cuando toque

**Entradas:** [khronos.org/gltf](https://www.khronos.org/gltf/) ·
[sandbox.babylonjs.com](https://sandbox.babylonjs.com/) (arrastra un `.glb` y lo inspecciona)

---

## 2. Modelado low-poly estilizado

**Decidido:** ~1.200 tris y texturas 256×256 como orden de magnitud por personaje.
A distancia de cámara isométrica es suficiente — ver §24.8 sobre por qué la lámina
comparativa engañaba en esto.

**Qué buscar:**
- `stylized low poly character Blender tutorial`
- `hand painted texture low poly character`
- `retopology` — convertir malla sucia (típico de IA) en topología limpia
- `UV unwrapping basics`

---

## 3. Esqueleto y rig

**Decidido:** un solo humanoide de 26 huesos, nomenclatura Mixamo **sin** el prefijo
`mixamorig:`, T-pose, origen entre los pies, 1 unidad = 1 metro.
Sin huesos de dedos en la v1.

En Blender el esqueleto se llama **armature**; los huesos que deforman la malla son
**deform bones**; asignar qué vértice sigue a qué hueso es **weight painting** o
**skinning**.

**Qué buscar:**
- `Blender armature basics` / `weight painting tutorial`
- `humanoid bone naming convention` — por qué existe un estándar
- `Mixamo auto-rigger custom character` — riggea automático cualquier humanoide, gratis
- `Blender limit total weights 4` — el límite de 4 influencias, es una operación con nombre
- `glTF JOINTS_0 WEIGHTS_0` — cómo se guarda el skinning en el formato

**Entradas:** [mixamo.com](https://www.mixamo.com/) (auto-rig + biblioteca de animaciones)

---

## 4. Sockets — puntos de anclaje

**Decidido:** 7 sockets `SKT_*` que **nunca llevan peso**. Los objetos rígidos (sombreros,
capas, objetos en mano) se cuelgan de ahí, no del hueso de deformación.

**Qué buscar:**
- `attachment sockets modular character` — el concepto, viene de Unreal/Unity pero aplica igual
- `Babylon.js attachToBone` — la API concreta
- `bone parenting Blender`

---

## 5. Avatar modular

**Decidido:** cuerpo partido en 15 mallas por región; cada prenda declara qué regiones
oculta; ocultar es `setEnabled(false)`. Prendas que deforman = skinned al esqueleto
compartido. Objetos rígidos = socket.

Este es el concepto central y donde más te conviene leer. Los tutoriales de Unity y Unreal
sirven: **el problema es el mismo, cambia la API**.

**Qué buscar:**
- `modular character system shared skeleton`
- `skinned mesh swapping same armature`
- `character customization hide body parts clipping` — el problema del clipping
- `Babylon.js share skeleton between meshes`

---

## 6. Animación

**Decidido:** animaciones en ficheros aparte de las mallas, para que un set sirva a todos
los cuerpos. Esto **solo funciona si los nombres de hueso están congelados** — de ahí la
convención.

**Qué buscar:**
- `Mixamo animations download` — cientos gratis, T-pose compatible
- `glTF animation only file` / `share animations between glTF models`
- `Babylon.js AnimationGroup retarget` — cómo aplicar una animación a otro esqueleto
- `animation blending walk idle` — mezclar entre estados

**Ojo:** Mixamo está hecho para proporciones humanas realistas. Sobre un personaje
estilizado de proporciones exageradas puede dar deslizamiento de pies o brazos que
atraviesan el cuerpo. A distancia isométrica se perdona bastante; de cerca no.
Buscar `animation retargeting proportions foot sliding`.

---

## 7. Toon shading — la pieza crítica del look

**Decidido:** Node Material Editor de Babylon, sin escribir GLSL a mano.
Es lo que más rápido responde "¿parece ilustración o parece juego 3D genérico?".

Un toon shader suele combinar tres cosas: una **rampa** que corta la luz en escalones en
vez de degradado, una **luz de borde** (rim light) y un **contorno** (outline).

**Qué buscar:**
- `Babylon.js Node Material Editor tutorial`
- `cel shading ramp texture` / `toon shading gradient ramp`
- `outline inverted hull` — la técnica clásica de contorno
- `rim light shader`
- `KHR_materials_unlit` — la vía más barata: sin iluminación, todo el color en la textura

**Entradas:** [nme.babylonjs.com](https://nme.babylonjs.com/) (editor visual de materiales) ·
[doc.babylonjs.com](https://doc.babylonjs.com/)

---

## 8. Variantes de color por máscara de tintes

**Decidido:** una textura máscara cuyos canales R, G y B seleccionan cuál de tres tintes
se aplica a cada téxel. El material expone `tintPrimary`, `tintAccent`, `tintDetail`.
Una geometría → infinitas combinaciones de color, sin draw call extra.

Es una técnica estándar en juegos multijugador — la de los "colores de equipo".

**Qué buscar:**
- `RGB mask texture tinting shader`
- `team color shader mask`
- `material color variants single texture`

---

## 9. Cámara ortográfica / isométrica

**Decidido:** ortográfica, sin rotación **por ahora** (§24.5 la marca como revisable, así
que no se hornean optimizaciones que la den por fija).

**Qué buscar:**
- `Babylon.js orthographic camera setup`
- `isometric camera angle 3D` — los ángulos clásicos (30°/45°) y por qué
- `true isometric vs dimetric` — casi todo lo que se llama isométrico no lo es

---

## 10. Movimiento y pathfinding

**Decidido:** navmesh con el plugin Recast que trae Babylon, para click-to-move.
Es la única pieza "de motor" que hace falta construir.

**Alternativa que mencionaste:** A* sobre rejilla de tiles. Es más simple y perfectamente
válido **si el mundo es de tiles**. Navmesh gana en mundos de geometría libre. Merece
comparación explícita antes de elegir.

**Qué buscar:**
- `Babylon.js RecastJSPlugin navigation mesh`
- `recast detour navmesh crowd agent`
- `A* pathfinding grid tilemap` — la alternativa
- `navmesh vs grid pathfinding` — la comparación

---

## 11. Validación — lo que impide que la convención se degrade

**Decidido:** un `skeleton.manifest.json` como fuente de verdad y un validador en CI que
rechace cualquier `.glb` que renombre huesos, ponga peso en un `SKT_*`, pase de 4
influencias, no esté a escala 1, o mezcle `skeletonVersion`.

La herramienta para construirlo es **glTF-Transform**: librería de Node para inspeccionar
y transformar `.glb` por programa. Es exactamente lo que hace falta.

**Qué buscar:**
- `glTF-Transform` — la librería
- `gltf-validator Khronos` — validador oficial de conformidad del formato

**Entradas:** [gltf-transform.dev](https://gltf-transform.dev/) ·
[github.com/KhronosGroup/glTF-Validator](https://github.com/KhronosGroup/glTF-Validator)

---

## 12. De dónde salen los assets (§24.8)

**Gratis y ya riggeados** — para la maqueta, cero bloqueo:
- Quaternius — [quaternius.com](https://quaternius.com/)
- Kenney (CC0) — [kenney.nl/assets](https://kenney.nl/assets)

**De pago, modulares sobre esqueleto compartido:**
- Synty POLYGON — [syntystore.com](https://syntystore.com/)

**IA 3D** — sirve para props, entorno y personajes completos; **no** resuelve cosméticos
modulares sobre tu esqueleto:
- Meshy — [meshy.ai](https://www.meshy.ai/) · Tripo — [tripo3d.ai](https://www.tripo3d.ai/)
- Buscar: `AI 3D model generator low poly game ready`, `AI auto rigging humanoid`

---

## 13. Medir en el dispositivo real

§24.8 deja abierto el **suelo de dispositivo**, pero la exigencia técnica es probar en un
móvil de gama media **desde la primera maqueta**, no al final.

**Qué buscar:**
- `Babylon.js Inspector performance` — el panel de depuración integrado
- `Spector.js WebGL debugging`
- `chrome://inspect remote debugging android` — depurar el navegador del móvil desde el PC
- `WebGL mobile texture memory limits`

---

## Orden sugerido para investigar

Si vas a leer sobre una sola cosa primero, que sea la **5 (avatar modular)**: es el concepto
que sostiene toda la apuesta del proyecto, y es donde los tutoriales de Unity y Unreal te
sirven igual aunque la API sea otra.

Después la **7 (toon shading)**, porque es la que responde antes la pregunta que de verdad
te importa: si el 3D puede parecer ilustración.
