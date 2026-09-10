import * as T from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildHeadphones } from './headphone-model';

export const CAMERA = { fov: 36, framing: 1.22, closeDistance: 1.8 };
export function createStudio(canvas: HTMLCanvasElement) {
  const mobile = matchMedia('(max-width: 700px)').matches;
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: !mobile, powerPreference: 'low-power' });
  renderer.debug.onShaderError = () => { throw new Error('Studio shader compilation failed'); };
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.25 : 1.75));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(CAMERA.fov, 1, .05, 30);
  const model = buildHeadphones(mobile); scene.add(model.root);
  const pmrem = new T.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  let environment: T.WebGLRenderTarget | undefined;
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
  const ctx = shadowCanvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(64, 64, 5, 64, 64, 64); gradient.addColorStop(0, 'rgba(42,35,26,.22)'); gradient.addColorStop(1, 'rgba(42,35,26,0)'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, 128, 128);
  const shadowTexture = new T.CanvasTexture(shadowCanvas);
  const shadowMaterial = new T.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false });
  const shadowGeometry = new T.PlaneGeometry(3.4, 2.1);
  const shadow = new T.Mesh(shadowGeometry, shadowMaterial); shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.84; scene.add(shadow);
  const key = new T.DirectionalLight('#fff5e8', 3); key.position.set(-3, 5, 4); scene.add(key);
  const rim = new T.DirectionalLight('#fff0d9', 1.2); rim.position.set(3, 2, -3); scene.add(rim);
  const pose = { pull: 0, turn: -.38, lift: -.05, left: 0, right: 0, approach: 0 };
  let disposed = false;
  function dispose() {
    if (disposed) return; disposed = true;
    model.dispose(); shadowTexture.dispose(); shadowMaterial.dispose(); shadowGeometry.dispose();
    environment?.dispose(); room.dispose(); pmrem.dispose(); renderer.dispose();
  }
  function render() {
    if (disposed) return;
    if (renderer.getContext().isContextLost()) throw new Error('WebGL context lost');
    const width = canvas.clientWidth || 500, height = canvas.clientHeight || 500;
    if (canvas.width !== Math.floor(width * renderer.getPixelRatio()) || canvas.height !== Math.floor(height * renderer.getPixelRatio())) renderer.setSize(width, height, false);
    camera.aspect = width / height; camera.updateProjectionMatrix();
    const distance = CAMERA.framing * 1.5 / Math.tan(T.MathUtils.degToRad(CAMERA.fov / 2)) / Math.min(1, camera.aspect);
    const close = new T.Vector3(1.65, .06, CAMERA.closeDistance);
    const wide = new T.Vector3(distance * .43, .9, distance * .90);
    camera.position.lerpVectors(close, wide, pose.pull).multiplyScalar(1 - pose.approach);
    camera.lookAt(new T.Vector3(.85, -.18, 0).lerp(new T.Vector3(0, .35, 0), pose.pull));
    model.root.rotation.y = pose.turn; model.root.position.y = pose.lift;
    model.left.rotation.z = pose.left; model.right.rotation.z = -pose.right;
    renderer.render(scene, camera);
  }
  try {
    environment = pmrem.fromScene(room, .04); scene.environment = environment.texture;
    room.dispose(); pmrem.dispose();
    render();
  } catch (error) { dispose(); throw error; }
  return { pose, render, dispose };
}
