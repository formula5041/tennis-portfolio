import './style.css';
import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

// const geometry = new THREE.TorusGeometry(9, 2, 10, 100);
// const material = new THREE.MeshStandardMaterial({ color: 0xffff49 });
// const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);

// const directionLight = new THREE.DirectionalLight(0xffffff,100)
// directionLight.position.set(0,1,0)
// directionLight.castShadow = true

const light1 = new THREE.PointLight(0xc4c4c4c4, 10)
light1.position.set(0,-10,5)


scene.add(pointLight, ambientLight, light1);




// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);


// Background

const spaceTexture = new THREE.TextureLoader().load('ground.jpg');
scene.background = spaceTexture;

// Avatar

const tennisTexture = new THREE.TextureLoader().load('tennis.png');

const tennis = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: tennisTexture }));

tennis.position.z = -5;
tennis.position.x = 2;

scene.add(tennis);



// GLTFLoader get racquet
const loader = new GLTFLoader()
const racquet = await loader.loadAsync('./gltf/tennis_racket_pink/scene.gltf')
.then((res)=>{
  return res.scenes[0].children[0]
})
racquet.position.setY(-5);
racquet.position.setX(-7);
racquet.position.setZ(-12);
scene.add(racquet)

// Ball

const ball = await loader.loadAsync('./gltf/tennis_ball_red/scene.gltf')
.then((res)=>{
  return res.scenes[0].children[0]
})

ball.position.z = 30;
ball.position.setX(-10);

scene.add(ball);

// Random Ball
async function addBall() {
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));
  const randomBall = await loader.loadAsync('./gltf/tennis_ball/scene.gltf')
  .then((gltf)=>{
    gltf.scene.scale.set(0.0001, 0.0001, 0.0001); 
    return gltf.scenes[0].children[0]
  })

  randomBall.position.set(x, y, z);
  scene.add(randomBall);
}

Array(100).fill().forEach(addBall);

// Tennis Rabit
const rabit = await loader.loadAsync('./gltf/tennis_rabit/scene.gltf')
.then((res)=>{
  return res.scenes[0].children[0]
})

rabit.position.z = 45;
rabit.position.setX(-15);
rabit.position.setY(-2);
rabit.rotation.z = 14.7;

scene.add(rabit);


// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  ball.rotation.x += 0.05;
  ball.rotation.y += 0.075;
  ball.rotation.z += 0.05;

  tennis.rotation.y += 0.01;
  tennis.rotation.z += 0.01;



  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  racquet.rotation.x += 0.01;
  racquet.rotation.y += 0.005;
  racquet.rotation.z += 0.01;

  ball.rotation.x += 0.005;

  // controls.update();

  renderer.render(scene, camera);
}

animate();


// https://www.youtube.com/watch?v=Q7AOvWpIVHU