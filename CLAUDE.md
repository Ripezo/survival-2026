# Project Direction --- Working Context for AI Development

## 1. Purpose of this document

This document is the shared strategic and technical context for the
project. It is intended to be read by Claude Code and other AI
development agents before making architectural or implementation
decisions.

The project has two distinct roles:

-   **General direction / game direction:** ChatGPT acts as an advisor
    on product vision, game systems, experience, scope, and major
    strategic decisions.
-   **Principal technical development:** Claude Code is expected to act
    as the primary implementation agent, translating the agreed
    direction into architecture and code.

Technical convenience must not silently redefine the game. When an
implementation decision could materially affect the game experience, art
direction, economy, or long-term product direction, surface the
trade-off before committing to it.

------------------------------------------------------------------------

# 2. Core vision

This is **not a personal-finance course disguised as a videogame**.

It is a videogame in which players learn resource management because
they need it to survive, progress, gain freedom, and improve their
position in the world.

The intended learning model is:

> **Experience → consequence → adaptation → mastery**

rather than:

> Lesson → quiz → correct answer.

The player should ideally learn financial principles without feeling
that the game is teaching a financial curriculum.

The world, its rules, scarcity, opportunities, mistakes and consequences
are the teacher.

------------------------------------------------------------------------

# 3. Personal origin of the concept

Two experiences are foundational references for the project's direction.

## Tibia

Tibia is important not primarily as a graphical reference, but as an
example of **emergent learning through scarcity and survival**.

Playing Tibia taught the project creator to manage resources:

-   money;
-   equipment;
-   consumables;
-   risk;
-   rewards;
-   inventory;
-   opportunity cost;
-   preparation;
-   recovery after losses.

The game did not need to explain these concepts as financial theory.
They mattered because wasting resources had consequences.

This is a fundamental design principle for this project.

A player should eventually understand concepts such as cash flow,
reserves, investment, debt, productive assets and risk because mastering
them improves their ability to live and progress inside the game.

## Rich Dad Poor Dad / Robert Kiyosaki

The book later helped formalize concepts that had already been
experienced intuitively through games.

The important influence is therefore **conceptual**, not literary.

The game must NOT become a digital version of *Rich Dad Poor Dad* or a
collection of Kiyosaki lessons.

Useful conceptual inspirations include:

-   cash flow;
-   assets versus liabilities;
-   passive income;
-   financial freedom;
-   the "rat race";
-   decisions involving risk and opportunity;
-   lifestyle inflation;
-   the relationship between income and expenses.

These concepts should become **game systems**, not textbook chapters.

------------------------------------------------------------------------

# 4. Fundamental design thesis

A useful north-star statement is:

> **Create a persistent social world where players learn to manage
> scarce resources, risk, work, consumption and investment because doing
> so is necessary to survive, progress and eventually gain economic
> freedom.**

The game should be enjoyable even for someone who has zero interest in
learning personal finance.

If the educational layer is removed from the marketing description, the
remaining product should still sound like a videogame worth playing.

------------------------------------------------------------------------

# 5. References and what they mean

## Wakfu

Primary reference for:

-   visual identity;
-   colorful stylized fantasy;
-   readable silhouettes;
-   exaggerated proportions;
-   cartoon/toon appearance;
-   isometric presentation;
-   appealing characters;
-   environments that feel illustrated rather than realistic.

The objective is NOT to reproduce Wakfu assets or intellectual property.

"Wakfu-like" should be understood internally as a shorthand for the
desired qualities: stylized, colorful, readable, charming, slightly
exaggerated, fantasy/cartoon and strongly art-directed.

## Tibia

Reference for:

-   early-game simplicity;
-   resource scarcity;
-   progression;
-   learning through systems;
-   consequences;
-   the feeling that possessions and resources matter;
-   a world in which economic decisions naturally emerge from gameplay.

Tibia is **not** the primary visual target.

## Cashflow / Kiyosaki

Reference for:

-   financial-system concepts;
-   cash-flow thinking;
-   the transition from dependence on active income toward economic
    freedom;
-   assets, liabilities, expenses and opportunities.

Again, these concepts must be transformed into gameplay.

------------------------------------------------------------------------

# 6. Current game-design state

The story, world lore and narrative structure are intentionally **not
yet defined**.

Do not invent permanent lore merely to unblock implementation.

The project is currently establishing foundations.

Early concepts previously discussed include:

-   multiplayer/social participation;
-   player avatars;
-   jobs or active-income mechanisms;
-   expenses;
-   assets;
-   liabilities;
-   investment opportunities;
-   passive income;
-   progression toward financial independence;
-   a possible conceptual victory state where passive income exceeds
    recurring expenses.

These are exploratory foundations rather than a finished Game Design
Document.

The exact economy must be designed later and should be treated as one of
the project's core systems.

------------------------------------------------------------------------

# 7. Browser-first strategy

The first meaningful playable demo will run in a **web browser**.

This is a deliberate product decision.

Benefits include:

-   extremely low friction for trying the game;
-   sharing through a URL;
-   rapid iteration;
-   easy deployment;
-   no initial app-store dependency;
-   good fit for public demos and testing.

Native applications are NOT ruled out.

If the project succeeds, native clients or ports may be considered
later.

However:

> **Do not compromise the browser-first prototype merely to optimize
> prematurely for hypothetical native ports.**

At the same time, game-domain logic should preferably remain
sufficiently decoupled from rendering and UI that future clients are
possible.

------------------------------------------------------------------------

# 8. Rendering decision

## Chosen direction

**Babylon.js + modular 3D avatars + isometric/orthographic camera + toon
rendering**

This supersedes the earlier idea of building the game primarily with
PixiJS.

## Why 3D instead of pure 2D sprites

PixiJS would be an excellent choice for a strict 2D isometric game and
would likely provide outstanding raw rendering performance.

However, modular character customization is expected to become
strategically important.

With sprite-based characters, every wearable item can require multiple:

-   directions;
-   animation frames;
-   poses;
-   layers;
-   compatibility adjustments.

The asset-production burden increases rapidly.

With modular 3D characters, an accessory can generally be modeled once
and attached to the appropriate character bone or slot.

The same asset can then participate in:

-   walking;
-   running;
-   idling;
-   emotes;
-   social interactions;
-   profile rendering;
-   shops;
-   houses;
-   future animations.

This makes 3D particularly attractive for a long-lived social game.

------------------------------------------------------------------------

# 9. Why Babylon.js

Babylon.js was selected over the current alternatives primarily because
this is a **browser-first game**.

It provides a mature game-oriented 3D stack while remaining native to
the JavaScript/TypeScript ecosystem.

Expected advantages:

-   TypeScript-friendly development;
-   browser-native deployment;
-   WebGL/WebGPU capabilities;
-   scene management;
-   cameras;
-   lighting;
-   materials;
-   animation;
-   skeletal animation;
-   asset loading;
-   picking;
-   particles;
-   game-oriented abstractions;
-   good integration with a conventional web application.

## Why not Unreal Engine

Unreal is not considered an appropriate foundation for the browser-first
version.

Its strengths are oriented toward high-end native game production, while
web delivery is not its primary modern deployment target.

It would introduce substantial complexity and weight without providing
proportional value for this project's initial goals.

## Why not Unity as the primary implementation

Unity remains a credible option for games targeting native platforms
broadly.

However, for this project the priority order is reversed:

1.  Browser
2.  Excellent accessibility and iteration
3.  Potential native expansion later

A JavaScript/TypeScript-native web stack provides a more natural fit for
that strategy.

## Why not Three.js

Three.js is an excellent rendering library and offers substantial
flexibility.

Babylon.js is preferred because it provides more game-engine-level
facilities out of the box.

The objective is to spend development effort on **the game**, not on
unnecessarily recreating engine infrastructure.

------------------------------------------------------------------------

# 10. Visual direction

The game will use real-time 3D but should NOT pursue realism.

Target characteristics:

-   toon/cartoon rendering;
-   orthographic or isometric-feeling camera;
-   compact readable characters;
-   slightly exaggerated proportions;
-   strong silhouettes;
-   controlled color palettes;
-   relatively simple geometry;
-   stylized materials;
-   efficient textures;
-   environments that can visually resemble illustrated 2D scenes.

A player looking at a screenshot should not immediately think:

> "generic 3D game."

The desired reaction is closer to:

> "This looks like a living illustrated/isometric world."

This distinction is important.

------------------------------------------------------------------------

# 11. Camera philosophy

The current preferred presentation is an **orthographic camera creating
an isometric or near-isometric view**.

The world may be fully 3D even if the player's visual experience
resembles a traditional isometric game.

Camera rotation is not currently required.

A constrained camera provides:

-   stronger art direction;
-   simpler environment composition;
-   predictable visibility;
-   easier gameplay readability;
-   reduced asset requirements;
-   a stronger visual identity.

Do not assume a freely rotating third-person camera unless the project
direction changes.

------------------------------------------------------------------------

# 12. Character architecture

Characters should be designed as **modular avatars** from early in
development.

Conceptual slots may include:

-   body;
-   face;
-   hair;
-   headwear;
-   torso;
-   hands;
-   legs;
-   feet;
-   back;
-   accessories;
-   pet/companion;
-   cosmetic effects.

A shared humanoid skeleton should be preferred where practical.

Example conceptual appearance state:

``` json
{
  "body": "female_01",
  "hair": "hair_07",
  "hairColor": "#6A3F21",
  "hat": "forest_hat_03",
  "shirt": "adventurer_white",
  "pants": "green_02",
  "boots": "boots_04",
  "back": "cape_leaf_01"
}
```

This is illustrative, not a finalized schema.

Appearance should remain logically separated from gameplay attributes.

------------------------------------------------------------------------

# 13. Cosmetics and long-term monetization

If the game gains meaningful participation, cosmetic monetization is a
likely business model.

Potential cosmetic categories include:

-   clothing;
-   hats;
-   hairstyles;
-   footwear;
-   capes;
-   backpacks;
-   pets;
-   visual effects;
-   emotes;
-   animations;
-   housing decoration.

This requirement strongly influenced the decision to use modular 3D
characters.

Where appropriate, assets should support material/color variations so
one geometry asset can produce multiple visual variants.

Example:

``` text
Forest Hat
├── primary color
├── accent color
└── feather color
```

Cosmetic systems should be architected independently from
economic/gameplay power.

The current direction strongly favors avoiding **pay-to-win** mechanics.

A premium outfit should change appearance, not financial competence or
player power.

------------------------------------------------------------------------

# 14. Proposed frontend technology stack

Current strategic stack:

``` text
Vite
React
TypeScript
Babylon.js
MUI
```

Possible supporting libraries should be introduced only when justified.

Previously considered:

-   Zustand for application/game UI state.

State architecture should distinguish between:

1.  rendering state;
2.  local game/application state;
3.  authoritative multiplayer/server state.

Do not put every kind of state into React.

Babylon's render loop should remain independent from unnecessary React
re-renders.

------------------------------------------------------------------------

# 15. UI philosophy

Babylon.js owns the game world.

React/MUI should generally own application-oriented interfaces such as:

-   menus;
-   account screens;
-   inventory management where appropriate;
-   financial dashboards;
-   shops;
-   settings;
-   social interfaces;
-   dialogs;
-   player profile;
-   administrative interfaces.

The visual UI should eventually be art-directed to match the game rather
than looking like stock Material Design.

MUI is an implementation foundation, not the final visual identity.

------------------------------------------------------------------------

# 16. Suggested high-level client separation

A desirable conceptual architecture is:

``` text
Web Client
│
├── Application Shell
│   ├── React
│   ├── MUI
│   └── routing / menus / overlays
│
├── Game Client
│   ├── Babylon.js
│   ├── scene
│   ├── world
│   ├── camera
│   ├── avatars
│   ├── animation
│   └── rendering
│
├── Game Domain
│   ├── economy
│   ├── inventory
│   ├── progression
│   ├── resources
│   └── rules
│
└── Networking
    ├── API
    └── realtime multiplayer
```

Exact architecture is not yet frozen.

The important principle is **separation of concerns**.

------------------------------------------------------------------------

# 17. Multiplayer direction

The game is expected to have a social/multiplayer dimension.

Therefore, do not design core economic rules assuming the browser is
authoritative.

Anything valuable or exploitable should eventually be
server-authoritative.

Examples include:

-   currency;
-   ownership;
-   inventory;
-   transactions;
-   rewards;
-   progression;
-   purchased cosmetics.

The networking/backend architecture has NOT yet been selected.

Do not prematurely lock the project into a multiplayer framework before
the gameplay prototype proves the core loop.

------------------------------------------------------------------------

# 18. Performance philosophy

The visual target should intentionally favor stylization over
brute-force graphical complexity.

Useful principles:

-   low/moderate polygon counts;
-   reusable materials;
-   texture atlases where appropriate;
-   instancing for repeated world objects;
-   LOD only when justified;
-   constrained lighting;
-   controlled shadow usage;
-   aggressive asset reuse;
-   lazy/streamed asset loading where useful;
-   measurable performance budgets.

A cartoon aesthetic is an advantage, not a limitation.

The goal is for the game to run well on ordinary consumer hardware and
remain approachable through a browser.

------------------------------------------------------------------------

# 19. AI-assisted development philosophy

AI materially changes the feasibility of this project for a small team.

AI agents may assist with:

-   architecture;
-   implementation;
-   tests;
-   refactoring;
-   shaders;
-   asset pipelines;
-   Blender scripting;
-   tooling;
-   documentation;
-   prototyping.

However:

> AI-generated complexity is still complexity.

Do not introduce systems simply because an AI can generate them quickly.

Prefer:

-   understandable architecture;
-   small vertical slices;
-   documented decisions;
-   tests around important domain rules;
-   incremental complexity.

------------------------------------------------------------------------

# 20. Development methodology

Favor **vertical slices** over building an enormous engine before
anything is playable.

An early slice might eventually contain only:

1.  a small 3D isometric environment;
2.  one modular avatar;
3.  movement;
4.  interaction with one object/NPC;
5.  one resource;
6.  one meaningful economic decision;
7.  a visible consequence.

That is more valuable than implementing dozens of disconnected systems.

The first milestone should prove:

> **Is managing resources inside this world actually fun?**

Not:

> "Have we implemented a complete financial simulator?"

------------------------------------------------------------------------

# 21. Guardrails for Claude Code

Before making major technical decisions, preserve these constraints:

### DO

-   optimize for browser-first delivery;
-   use TypeScript;
-   treat Babylon.js as the primary world renderer;
-   preserve modular avatars;
-   preserve toon/isometric visual direction;
-   separate game-domain logic from rendering;
-   design systems so multiplayer authority can move/remain server-side;
-   keep the prototype small;
-   document meaningful architecture decisions;
-   surface trade-offs when a decision affects future product direction.

### DO NOT

-   turn the game into financial courseware;
-   expose financial terminology unnecessarily just because the
    underlying model uses it;
-   introduce realism as the graphical goal;
-   replace the constrained isometric presentation with third-person
    gameplay without discussion;
-   couple economy rules directly to Babylon scene objects;
-   make React the game loop;
-   overengineer multiplayer before validating the core loop;
-   assume purchased cosmetics grant gameplay advantages;
-   invent permanent lore without explicit direction;
-   copy copyrighted Wakfu/Tibia assets or characters.

------------------------------------------------------------------------

# 22. Decision log --- current foundational decisions

  ------------------------------------------------------------------------
  Decision                 Status                  Reason
  ------------------------ ----------------------- -----------------------
  Browser-first            **Accepted**            Low friction,
                                                   shareability, rapid
                                                   iteration

  Native app               **Future possibility**  Not required for
                                                   initial demo

  2D PixiJS                **Not selected for main Excellent performance
                           renderer**              but higher modular
                                                   cosmetic production
                                                   cost

  Babylon.js               **Accepted**            Browser-native,
                                                   TypeScript-friendly,
                                                   game-oriented 3D engine

  3D world                 **Accepted**            Flexibility, reusable
                                                   assets, future cosmetic
                                                   system

  Orthographic/isometric   **Accepted direction**  Preserves
  camera                                           illustrated/isometric
                                                   identity

  Toon rendering           **Accepted direction**  Wakfu-inspired
                                                   stylization without
                                                   realism

  Modular avatars          **Accepted**            Character customization
                                                   and scalable cosmetics

  React                    **Accepted**            Web application
                                                   shell/UI

  MUI                      **Accepted foundation** Product UI development
                                                   speed; later art
                                                   direction required

  TypeScript               **Accepted**            Shared language across
                                                   web/game tooling

  Story/lore               **Undecided**           Must be deliberately
                                                   designed later

  Backend                  **Undecided**           Avoid premature
                                                   architecture

  Multiplayer technology   **Undecided**           Validate core gameplay
                                                   first

  Monetization             **Direction only**      Cosmetics favored;
                                                   avoid pay-to-win
  ------------------------------------------------------------------------

------------------------------------------------------------------------

# 23. The question that should guide the project

When uncertain about a design decision, ask:

> **Does this make resource management an interesting part of living in
> the game world, or does it make the game feel more like a financial
> lesson?**

Prefer the former.

The player's desired realization after many hours should be something
like:

> "I became good at managing money and resources because I needed to
> become good at this game."

That is the project's core ambition.

------------------------------------------------------------------------

# 24. Technical governance and open technical debt

Added 2026-08-28 by Claude Code, with authority explicitly granted by the
project creator. Sections 1--23 are the direction document and are not
modified by this section; this one only records the technical decisions
that were left undefined there.

## 24.1 Division of authority

Section 1 assigns roles. This is the boundary where they overlap.

  ---------------------------------------------------------------------
  Claude Code decides                 Creator / direction advisor decide
  ----------------------------------- ---------------------------------
  Architecture, module boundaries,    How the game feels, economy,
  data formats                        progression

  Rig conventions, skeleton, asset    Art direction, palette, style,
  pipeline                            silhouette

  Library choice and its cost         Camera and presentation *as an
                                      experience decision*

  Test strategy, performance *as      Performance budgets *as a product
  technique*                          target*

  Netcode and authority model         Lore, narrative, monetization
  ---------------------------------------------------------------------

The rule from section 1 stands, and cuts both ways:

-   if a technical decision changes the game, it is surfaced before
    being executed;
-   if a design decision carries a large technical cost, that cost is
    put on the table with a number, not silently absorbed.

## 24.2 Rig convention --- CLOSED, skeleton version 1

Closed 2026-08-28 under the authority granted in 24.1. The strategic case
for 3D (sections 8, 12, 13) rests entirely on modular avatars working.
This is what makes them work.

**These decisions are frozen.** Changing them is a `skeletonVersion`
bump, which is a deliberate reviewed act, not an edit.

### Format

-   **glTF 2.0 / `.glb`** (binary, one file per asset). `.gltf` JSON is
    never shipped.
-   `.blend` files are the authoring source and stay **out of the code
    repository** (already in `.gitignore`).
-   Mesh compression (Meshopt) and texture compression (KTX2/Basis) are
    **pipeline stages that exist but start disabled**. Turn them on when
    an asset budget demands it, not before (section 24.6).

### Units, orientation, rest pose

-   1 unit = 1 metre. Scale applied before export --- every exported
    object is at scale `(1,1,1)`.
-   Origin **between the feet, at world zero**.
-   Rest pose is a **T-pose**. A-pose deforms shoulders better on
    stylized proportions, but T-pose is what every retargeting tool
    assumes, and free animation libraries are worth more than marginal
    shoulder quality during the mock-up phase.
-   Author in Blender's axis convention and let the exporter convert.
    **Orientation is never corrected with a rotation in code** --- it is
    corrected in the source file. A rotation offset in the loader is the
    beginning of a pipeline nobody can reason about.

### The skeleton --- frozen bone list

One shared humanoid skeleton. Every body and every deforming garment
binds to *this* skeleton, unchanged.

Names follow the Mixamo/standard humanoid convention **with the
`mixamorig:` prefix stripped**. The convention buys compatibility with
retargeting tools and free animation libraries; the prefix buys nothing
and its colon breaks some tooling.

```text
Root                      (motion root, at origin — enables root motion)
└── Hips
    ├── Spine → Spine1 → Spine2
    │   ├── Neck → Head → HeadTop_End
    │   ├── LeftShoulder  → LeftArm  → LeftForeArm  → LeftHand
    │   └── RightShoulder → RightArm → RightForeArm → RightHand
    ├── LeftUpLeg  → LeftLeg  → LeftFoot  → LeftToeBase  → LeftToe_End
    └── RightUpLeg → RightLeg → RightFoot → RightToeBase → RightToe_End
```

26 bones. `HeadTop_End` and `*Toe_End` are leaf orientation helpers kept
for retargeting compatibility and **carry no vertex weights**.

**No finger bones in version 1.** A full hand rig is 40 bones for
something the isometric camera renders at a handful of pixels. Fingers
are a leaf-only addition, which is backward compatible with existing
weighted assets, so this is deferred without cost. Revisit only if a
close-up profile or shop view demands it.

Hard limits:

-   **maximum 4 bone influences per vertex**, a single `JOINTS_0` set;
-   deform bone count stays under 64.

### Sockets --- rigid attachment points

Sockets are bones that exist only as attachment points. They are named
`SKT_*` and **must never appear in any vertex weight**; the validator
enforces this.

```text
SKT_Head    SKT_Face    SKT_Back
SKT_HandL   SKT_HandR   SKT_HipL   SKT_HipR
```

Rigid items parent to a socket rather than to a deform bone directly, so
an artist can move an attachment point in Blender without touching the
deform skeleton, and the offset lives in the rig instead of as a magic
number in code.

### Slots and attach modes

  ----------------------------------------------------------------------
  Slot            Mode      Anchor / notes
  --------------- --------- --------------------------------------------
  body            skinned   base mesh, split into regions (below)

  hair            rigid     `SKT_Head`

  headwear        rigid     `SKT_Head`

  face            rigid     `SKT_Face`

  torso           skinned

  hands           skinned

  legs            skinned

  feet            skinned   deforms at the ankle

  back            rigid     `SKT_Back` — capes stay rigid in v1;
                            skinning or simulation is a later decision

  held            rigid     `SKT_HandL` / `SKT_HandR`

  fx              rigid     any socket, declared per item

  pet             none      a separate entity that follows the avatar,
                            never parented to its skeleton
  ----------------------------------------------------------------------

### Body regions and clipping

Clipping is solved by **hiding what a garment covers**, not by modelling
a new body per outfit. The body is authored as separate named meshes:

```text
Head  Neck  Torso
ArmUpper.L/R  ArmLower.L/R  Hand.L/R
LegUpper.L/R  LegLower.L/R  Foot.L/R
```

Each cosmetic declares the regions it hides. At runtime hiding is
`setEnabled(false)` --- no geometry work. This costs draw calls, which is
acceptable at mock-up scale and can be merged later if profiling says so.

### Colour variants --- one geometry, many looks

Section 13 requires that one asset produce multiple visual variants
(the Forest Hat: primary / accent / feather). Implementation:

-   a **tint mask texture** whose R, G and B channels select which of
    three tint parameters applies to each texel;
-   the toon material exposes `tintPrimary`, `tintAccent`, `tintDetail`.

One geometry, one mask, unlimited colourways, and no extra draw call.
This is what makes a seasonal cosmetic cheap to produce.

### Catalogue entry

Cosmetics are catalogue entries, which is what appearance state
references by ID (section 24.4). Shape:

``` text
id, slot, mesh (glb path), attach ("skinned" | socket name),
hides [regions], tintChannels, skeletonVersion
```

Validated with `zod` --- the same schemas that validate player state
(sections 24.4, 24.7).

### Enforcement

A convention nobody checks is a convention that decays. Two artefacts,
to be built before the first avatar is authored:

1.  **`skeleton.manifest.json`** --- the frozen bone list, socket list,
    body regions and `skeletonVersion`. The single source of truth. Every
    exported `.glb` is stamped with its `skeletonVersion` in glTF
    `extras`.
2.  **A validator** run in CI and pre-commit, which rejects any `.glb`
    that: renames, adds or drops a bone relative to the manifest; puts a
    weight on an `SKT_*` bone or a leaf helper; exceeds 4 influences per
    vertex; is not at scale 1; declares a `hides` region that does not
    exist; or mixes `skeletonVersion`s.

The version stamp is what makes "frozen" survivable: if the skeleton ever
must change, it bumps, and the validator refuses to mix generations
instead of failing silently at runtime.

## 24.3 Game domain must be isomorphic --- accepted

Section 17 requires that authority be movable to the server. That is an
aspiration unless this constraint is enforced:

> The `Game Domain` module is **pure, isomorphic TypeScript**: no Babylon
> import, no React import, no `window`, no direct network access. It must
> run unchanged in a Node test, in the client, and --- once it exists ---
> on the server.

Consequences:

-   enforced by a dependency lint rule, not by discipline;
-   the domain has mandatory tests; the renderer does not.

## 24.4 Appearance state and persistence --- accepted

-   Appearance is **player-owned data** and must be server-validatable.
    The illustrative schema in section 12 embeds a free-form hex colour
    (`"hairColor": "#6A3F21"`); that is unbounded input and cannot
    distinguish a premium colour from a free one. Appearance fields
    reference **catalogue IDs**.
-   Appearance stays logically separate from gameplay attributes
    (already required by section 12).
-   **Player state is versioned from day one**, with a migration path.
    In a persistent world with owned items this is a day-one concern.
    For the mock-up: `localStorage` plus a versioned schema.

## 24.5 Camera --- revisable direction, not a frozen commitment

Confirmed 2026-08-28: the isometric view is *currently under
consideration*, not settled. Transmedia references under review include
Wakfu / Ankama material.

Because it is revisable, the following optimisations are **not** applied,
even though a fixed camera would allow them: baked lighting, impostors
for distant objects, fixed occlusion assumptions. The camera stays a
swappable module. This costs performance that the project can currently
afford, and keeps the option open.

Note: the Wakfu look is achieved with 2D sprites in isometric
projection. This project chose 3D. Resembling it is therefore a matter of
**toon shading + camera + art direction** --- deliberate work, not a side
effect of the engine choice.

## 24.6 What is NOT built for the mock-up

The goal is a functional mock-up in the medium term to test look and feel
as early as possible. The most important list is what is not built:

-   **no ECS** (bitECS, Miniplex) --- plain TS classes and a simple
    registry. Adopting one now is precisely the trap in section 19;
-   **no netcode** --- already required by section 17;
-   **no physics**, unless physical interaction becomes part of the feel
    test. If it does: Havok, Babylon's official engine.

Lean on what already exists instead of writing it:

-   **Babylon Node Material Editor** for toon/cel shading without
    hand-written GLSL --- on the critical path for the look-and-feel
    question;
-   **Recast navmesh plugin** (ships with Babylon) for isometric
    click-to-move with pathfinding --- the only real "engine" piece
    needed;
-   **Babylon skeleton + animation blending** for modular avatars;
-   `@babylonjs/loaders` for glTF.

The mock-up should answer three visual questions, in order:

1.  does toon shading under an orthographic camera read as an
    illustration, or as a generic 3D game?
2.  does a modular avatar of 3--4 pieces read well at that camera
    distance?
3.  does movement feel good?

## 24.7 UI library --- shadcn/ui, accepted

Decided 2026-08-28. Supersedes `MUI = Accepted` in section 22 **for this
project only**; `shop-manager` and `tia-gloria` keep MUI, and no
unification is intended.

Chosen: **shadcn/ui** --- Radix primitives + Tailwind, with component
source copied into the repository.

Reasons:

-   Radix matches or exceeds MUI on accessibility and cross-browser
    component behaviour, which was the original reason for choosing a
    component base;
-   seasonal re-theming is strictly better. MUI theming changes colour
    and typography but not the Material language itself (ripple,
    elevation, floating-label field anatomy, density). Owning the
    component source lets a season change shape, border, texture and
    ornament --- which is what a seasonal visual identity should mean in
    a game;
-   Tailwind is static CSS with no runtime, on a page that also runs a
    Babylon render loop; MUI + Emotion injects styles at runtime.

Decisive factor: no code existed yet, so migration cost was zero.

Accepted costs, stated openly:

-   Tailwind is the real learning curve;
-   shadcn is code the project owns and maintains, not a dependency ---
    an advantage and a responsibility;
-   the creator explicitly chose this partly to gain first-hand
    experience of both approaches and form an independent judgement.

Standing rule, independent of this decision:

> **The UI library must not leak outside the UI layer.** No shadcn (or
> any UI-kit) component inside `Game Domain` or `Game Client`.

Forms pair with `react-hook-form` + `zod`. The `zod` schemas are also
what validates player state (section 24.4).

## 24.8 Art production --- the dominant risk

Recorded 2026-08-28. **Revised 2026-08-28** after the creator corrected
the record: see the capability section below. The original entry assumed
a skills gap that does not exist, and the correction changes which
solutions apply.

Sections 8--13 commit the project to modular 3D. Nothing in sections
1--23 addresses **who sustains that art production**, which is the
largest risk the project carries --- larger than any engine or
architecture decision.

### What the project actually has --- corrected

An earlier version of this section stated "no modeller, rigger,
animator". **That was wrong.** The creator is formally trained in
modelling, rigging and animation.

What the project has:

-   **Art direction --- confirmed.** Multi-view character turnarounds,
    expression sheets, defined palettes, characters kept consistent
    across views, produced with AI image tools.
-   **Modelling, rigging and animation --- confirmed**, by training.

What the project lacks is **neither of those**. It lacks *throughput*:
one person, over years, alongside everything else the project needs.
The creator's stated concern is precise and worth quoting in substance
--- they know exactly how much work is ahead **because** they have done
it before.

**This distinction decides which solutions are valid**, and the original
entry got it backwards:

  ------------------------------------------------------------------
  If the gap were...        The answer would be...
  ------------------------- ----------------------------------------
  **Capability**            hire, buy, outsource, generate --- find
  (assumed, and wrong)      someone or something able to make it

  **Throughput**            reduce how much must be authored at all;
  (actual)                  automate production from a single
                            authored source; choose a style with a
                            lower per-asset cost
  ------------------------------------------------------------------

Buying a modular pack or generating meshes with AI answers a capability
gap. Neither answers a throughput gap by much --- both still require a
trained person to integrate, retopologise, re-rig to the manifest and
maintain the result. Solutions must be judged against **authored assets
per shipped cosmetic**, not against "can this be made at all".

### Correction to the earlier comparison material

The 3D/2D comparison sheet used in evaluation is **not a reliable cost
reference**. It labels a render "~1,200 tris / 256×256" while showing
soft shading, ambient occlusion, cloth folds and individual hair strands
--- which those numbers do not produce. It also renders the character
roughly five times larger in linear size than the isometric game camera
will ever show it.

At true game distance, 1,200 tris and a 256×256 toon texture are
adequate --- the second reference image (a real gameplay capture) is the
honest quality target. **Any future look-and-feel evaluation must be
rendered at real camera distance with real budgets**, never as a
character sheet.

### 2D: it depends entirely on where the sprites come from

Retreating to 2D was considered. The answer splits, and the split is the
whole point:

**AI-generated sprites --- rejected.** Not viable, and not for lack of
quality:

-   AI image tools produce excellent *reference sheets* but not
    *animation frames*; frame-to-frame coherence across 8 directions ×
    N frames is precisely their weakest area;
-   the combinatorial cost of section 8 is unchanged --- every cosmetic ×
    every direction × every frame, each one a fresh generation that may
    not match its neighbours.

This route is a sideways move into a harder problem, not a step down to
an easier one.

**Sprites pre-rendered from the project's own 3D --- viable, and
strong.** Same output format, completely different economics. See
"Pre-rendering 3D to sprites" below.

The instinct toward 2D is sound. The mistake is only in the source.

### Routes available, with honest limits

  ----------------------------------------------------------------------
  Route              Gives                    Does not give
  ------------------ ------------------------ --------------------------
  **AI 3D**          props, environment,      modular cosmetics bound to
  (Meshy, Tripo)     whole characters;        *this* skeleton with clean
                     low-poly with            weights --- a generated
                     controlled poly counts;  garment will not fit the
                     one-click auto-rig;      shared rig
                     motion preset libraries

  **Bought modular   stylized modular         a look that is the
  packs** (Synty,    characters already       project's own
  Kenney,            rigged on a shared
  Quaternius)        skeleton --- exactly the
                     structure section 24.2
                     describes. Free to ~USD
                     200

  **Voxel**          the lowest per-asset     compatibility with the
  (MagicaVoxel)      authoring cost of any    Wakfu direction in sections
                     3D style, and the        5 and 10 --- a **direction
                     creator can execute it   decision, not a technical
                     well. Under a            one**
                     *throughput* constraint
                     this is the strongest
                     entry in this table

  **Pre-render to    modular reuse at build   camera freedom --- it
  sprites**          time; frame coherence    permanently freezes the
                     for free; uses exactly   camera against section 24.5
                     the skills available

  **Hiring**         throughput               affordability, at present
  ----------------------------------------------------------------------

Mixamo auto-rigging remains free and applies to any humanoid mesh.

**How to read this table after the correction:** every row must be judged
by how much it reduces *authored assets per shipped cosmetic*, not by
whether it can produce an asset at all. AI generation and bought packs
score well on capability and only moderately on throughput --- both still
require a trained person to retopologise, re-rig to the manifest and
maintain the result. Models pulled from an AI gallery are **base meshes,
not final assets**: check the pose (anything not in T-pose is materially
more expensive to rig) and check the licence before investing time,
especially with cosmetic monetization in the plan.

### Rejected: building on a third-party platform

Building the game as content inside another product (Hytale was the
specific proposal) is **rejected**:

-   it is a game with modding tools, not an engine --- the product would
    belong to someone else;
-   it eliminates the browser-first strategy (section 7) entirely, along
    with the whole accessibility argument;
-   cosmetic monetization (section 13) becomes impossible without owning
    the storefront;
-   platform risk is demonstrated, not hypothetical: that project was
    cancelled in June 2025 and revived in November 2025 when its founder
    repurchased it, reaching Early Access on 2026-01-13.

### Pre-rendering 3D to sprites --- promoted to a first-class option

**3D authoring can always be pre-rendered to 2D sprites. 2D pixel art
cannot be converted into 3D models.** (Diablo II shipped exactly this
way.)

This asymmetry --- not the cosmetic-cost argument of section 8 --- is the
strongest justification for the 3D decision. **The 3D choice is the
reversible one.**

The original entry filed this as an emergency exit. Under the corrected
capability picture it is **a first-class option**, because it is the
best available answer to a *throughput* problem:

-   it needs exactly the skills the creator has --- model once, rig
    once, animate once;
-   the expensive part, producing 8 directions × N frames × every
    cosmetic, becomes **a build step, not authoring work**;
-   frame-to-frame coherence is free, because it is a render rather than
    a generation. This is precisely what AI sprite generation cannot do,
    and the reason "just ask the AI for a sprite sheet" fails: AI
    produces excellent single views and cannot hold a character stable
    across the frames of a walk cycle;
-   **modular reuse survives.** A hat modelled once is rendered into
    every direction and frame automatically. Choosing sprites this way
    does not mean giving up reuse --- it moves reuse from runtime to
    build time.

Cost, stated honestly: pre-rendering **permanently freezes the camera**,
which contradicts section 24.5, and every added direction or animation
multiplies output size. It is a real decision with a real price, not a
free win.

### OPEN --- device floor

Browser delivery reaches PC and mobile quickly for 2D. For 3D it does
so **with conditions**: WebGL on mid-and-low-range Android is fragile
(texture memory limits, thermal throttling, battery), and touch controls
with isometric UI density on a 6-inch screen is a design problem in its
own right.

The project must choose a **minimum supported device** and treat it as a
product target. Per 24.1 this is the creator's decision, not Claude
Code's. Until it is made, the standing technical requirement is: **test
on a real mid-range phone from the first mock-up**, not at the end.

### Decision --- defer the art strategy, do not let it block

The first milestone (section 20) asks *"is managing resources in this
world fun?"*. That question is answerable **with capsules and
cylinders**. Section 24.2 already isolates the body mesh from the
domain, the camera and the economy, so the art can be replaced later
without touching them.

Therefore:

1.  build the mock-up with free pre-rigged assets (Quaternius, Kenney)
    --- zero cost, zero blocking;
2.  spend one session running a single character through an AI low-poly
    + auto-rig pipeline into Babylon --- one afternoon of evidence beats
    weeks of deliberation about whether the pipeline is viable;
3.  answer the fun question;
4.  decide the art strategy afterwards, with a playable prototype in
    hand and better tooling than exists today.

The art decision is currently being made far earlier than anything
actually requires.

**Revision note.** Steps 1 and 2 above were written to answer a
capability gap that does not exist. They remain useful --- free rigged
assets still unblock the mock-up at zero cost, and one afternoon of AI
pipeline testing is still cheap evidence --- but they are no longer the
point. The real question is now:

> Which route produces the most shipped cosmetics per authored asset,
> using skills the creator already has?

On current evidence the two leading candidates are **voxel** and
**pre-rendering 3D to sprites**, and they are not mutually exclusive.
Neither is decided; both should be judged with a prototype in hand
rather than in the abstract. Spike `spikes/tiles-vs-voxel/` exists to
supply the first piece of that evidence.
