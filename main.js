import * as THREE from "three";
import "./style.css";
import { gsap } from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// create scene
const scene = new THREE.Scene();

// Create our Sphere - the shape
// *RADIUS, WIDTH SEGMENT, HEIGHT SEGMENT
const geometery = new THREE.SphereGeometry(3, 64, 64);
// Set Material
// This sets the color and texture
const material = new THREE.MeshStandardMaterial({
  color: "#013d9f",
  roughness: 0.5,
});

// Mesh combines the geometery and material
const mesh = new THREE.Mesh(geometery, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10); //position = x, y, z
light.intensity = 1.25;
scene.add(light);

// CAMERA
// Values: FOV, Aspect Ratio (800 x 600)
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
// Define how big our canvas is
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // Update Camera
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();

// Timeline Magic
const tl = gsap.timeline({ defaults: { duration: 1.5 } });
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
tl.fromTo("nav", { y: "-100%" }, { y: "0%" });
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 });

// Mouse Animation Color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseUp", () => (mouseDown = false));

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageX / sizes.width) * 255),
      150,
    ];
    // Animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
    });
  }
});
