import * as T from 'three';

export const MATERIALS = { shell: '#aaa08f', leather: '#342b25', fabric: '#1c1915', roughness: .78 };

export function buildHeadphones(mobile: boolean) {
  const root = new T.Group();
  const textures: T.Texture[] = [];
  const materials: T.Material[] = [];
  const geometries: T.BufferGeometry[] = [];
  const segments = mobile ? 48 : 80;
  function weave() {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#888'; ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 128; i += 4) {
      ctx.fillStyle = '#999'; ctx.fillRect(i, 0, 1, 128);
      ctx.fillStyle = '#777'; ctx.fillRect(0, i, 128, 1);
    }
    const texture = new T.CanvasTexture(c);
    texture.wrapS = texture.wrapT = T.RepeatWrapping; texture.repeat.set(4, 4);
    textures.push(texture); return texture;
  }
  const grain = weave();
  const shellMaterial = new T.MeshStandardMaterial({ color: MATERIALS.shell, metalness: 0, roughness: MATERIALS.roughness });
  const trim = new T.MeshStandardMaterial({ color: '#746a59', metalness: .25, roughness: .65 });
  const leather = new T.MeshStandardMaterial({ color: MATERIALS.leather, roughness: .86, bumpMap: grain, bumpScale: .003 });
  const fabric = new T.MeshStandardMaterial({ color: MATERIALS.fabric, roughness: 1, bumpMap: grain, bumpScale: .004 });
  materials.push(shellMaterial, trim, leather, fabric);
  function mesh(g: T.BufferGeometry, m: T.Material, parent: T.Object3D, x = 0, y = 0, z = 0) {
    geometries.push(g); const object = new T.Mesh(g, m); object.position.set(x, y, z); parent.add(object); return object;
  }
  // Swept rectangular arc: actual front-to-back width, radial thickness and capped ends.
  function band(radius: number, thickness: number, width: number, start: number, end: number) {
    const shape = new T.Shape();
    shape.absarc(0, 0, radius + thickness / 2, start, end, false);
    shape.absarc(0, 0, radius - thickness / 2, end, start, true); shape.closePath();
    const g = new T.ExtrudeGeometry(shape, { depth: width, bevelEnabled: true, bevelSize: .012, bevelThickness: .012, bevelSegments: 3, steps: 1, curveSegments: segments });
    g.translate(0, 0, -width / 2); return g;
  }
  mesh(band(1.02, .065, .24, .12, Math.PI - .12), shellMaterial, root, 0, .43);
  mesh(band(.963, .075, .22, .32, Math.PI - .32), leather, root, 0, .43);
  // Elliptical ring with a smooth rounded cross-section. Its center remains open.
  function ring(ry: number, rz: number, tube: number, depth: number) {
    const positions: number[] = [], uv: number[] = [], indices: number[] = [];
    const cross = mobile ? 12 : 20;
    for (let i = 0; i <= segments; i++) for (let j = 0; j <= cross; j++) {
      const a = i / segments * Math.PI * 2, b = j / cross * Math.PI * 2;
      positions.push(Math.sin(b) * depth, (ry + Math.cos(b) * tube) * Math.cos(a), (rz + Math.cos(b) * tube) * Math.sin(a));
      uv.push(i / segments, j / cross);
      if (i < segments && j < cross) { const n = i * (cross + 1) + j; indices.push(n, n + cross + 1, n + 1, n + 1, n + cross + 1, n + cross + 2); }
    }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(positions, 3)); g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2)); g.setIndex(indices); g.computeVertexNormals(); return g;
  }
  const pivots: T.Group[] = [];
  for (const side of [-1, 1]) {
    // Telescoping rail meets the band end and the fixed hinge at y=.12.
    mesh(new T.BoxGeometry(.055, .48, .10), trim, root, side * 1.012, .34);
    mesh(new T.BoxGeometry(.025, .29, .12), trim, root, side * 1.012, .22);
    const pivot = new T.Group(); pivot.position.set(side * 1.012, .12, 0); root.add(pivot); pivots.push(pivot);
    const hinge = mesh(new T.CylinderGeometry(.085, .085, .17, 24), trim, root, side * 1.012, .12); hinge.rotation.x = Math.PI / 2;
    const screw = mesh(new T.CylinderGeometry(.025, .025, .012, 16), leather, root, side * 1.012, .12, .09); screw.rotation.x = Math.PI / 2;
    // Fork is parented with the cup, so every component follows the real hinge.
    for (const z of [-.18, .18]) mesh(new T.BoxGeometry(.065, .33, .05), trim, pivot, 0, -.15, z);
    const cup = new T.Group(); cup.position.set(0, -.43, 0); pivot.add(cup);
    const shell = mesh(new T.SphereGeometry(1, segments, mobile ? 20 : 32), shellMaterial, cup, side * .035); shell.scale.set(.15, .43, .32);
    mesh(ring(.377, .267, .018, .02), trim, cup, -side * .035);
    mesh(ring(.32, .225, .094, .105), leather, cup, -side * .145);
    mesh(ring(.367, .273, .006, .008), leather, cup, side * .11);
    const inside = mesh(new T.SphereGeometry(1, 32, 16), fabric, cup, -side * .106); inside.scale.set(.013, .28, .185);
    // Button and recessed port on lower shell, kept small relative to the earcup.
    const button = mesh(new T.CylinderGeometry(.026, .026, .015, 16), trim, cup, side * .075, -.36, .13); button.rotation.x = .35;
    mesh(new T.BoxGeometry(.035, .014, .065), fabric, cup, side * .055, -.419, -.07);
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const ctx = c.getContext('2d')!; ctx.fillStyle = '#a5a59c'; ctx.font = '32px Arial'; ctx.textAlign = 'center'; ctx.fillText(side < 0 ? 'L' : 'R', 32, 43);
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; textures.push(t);
    const label = new T.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false }); materials.push(label);
    mesh(new T.PlaneGeometry(.075, .075), label, pivot, 0, -.06, .208);
  }
  return { root, left: pivots[0], right: pivots[1], dispose() { geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => t.dispose()); } };
}
