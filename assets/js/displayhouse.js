import * as THREE from "/build/three.module.js";
import { GLTFLoader } from "/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "/jsm/controls/OrbitControls.js";

let renderer;
let scene;
let camera;
let model_container;
let house;
const canvasSize = document.querySelector(".canvas-element");

const init = () => {
  // creating a scene
  scene = new THREE.Scene();

  // creating a camera
  camera = new THREE.PerspectiveCamera(
    60, // fov
    canvasSize.offsetWidth / canvasSize.offsetHeight, // aspect ratio
    0.1, // near
    1000 // far
  );
  camera.position.set(0, 0, 5);
  scene.add(camera);

  // calling the container - canvas
  model_container = document.querySelector(".web-gl");

  // renderering
  renderer = new THREE.WebGLRenderer({
    canvas: model_container,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(canvasSize.offsetWidth, canvasSize.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
  renderer.autoClear = false;
  renderer.setClearColor(0xffffff, 0.0);

  // control orbit
  const controls = new OrbitControls(camera, renderer.domElement);

  // adding lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);

  //loading gtlf model
  const loader = new GLTFLoader();
  loader.load(
    "./assets/3d/scene.gltf",
    (gltf) => {
      house = gltf.scene.children[0];
      house.scale.set(0.15, 0.15, 0.15);
      house.rotation.x = Math.PI / -2;

      // centering the object
      const box = new THREE.Box3().setFromObject(house);
      const center = box.getCenter(new THREE.Vector3());
      house.position.z += house.position.z - center.z;
      house.position.x += house.position.x - center.x;
      house.position.y += house.position.y - center.y;

      scene.add(gltf.scene);
    },
    // called while loading is progressing
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
    }
  );

  animate();
};

const render = () => {
  renderer.render(scene, camera);
};

const animate = () => {
  requestAnimationFrame(animate);
  render();
};

// making the render responsive
const windowResize = () => {
  camera.aspect = canvasSize.offsetWidth / canvasSize.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvasSize.offsetWidth, canvasSize.offsetHeight);
  render();
};

window.addEventListener("resize", windowResize, false);
window.onload = init;
