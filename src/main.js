import Renderer from "./engine/Renderer.js";
import UniformManager from "./engine/UniformManager.js";
import HelloWorldCard from "./cards/HelloWorld/index.js";
import AccelerometerCard from "./cards/AccelerometerCard/index.js";
import SpiralFlowCard from "./cards/SpiralFlow/index.js";
import "./style.css";

const canvas = document.querySelector("#canvas");
const renderer = new Renderer(canvas);
const uniforms = new UniformManager();

let activeCard = null;
let animationFrameId = null;

const CARDS = [
  {
    id: "hello-world",
    title: "Hello World",
    description: "A simple dynamic color gradient.",
    Class: HelloWorldCard,
    needsSensor: false,
  },
  {
    id: "accelerometer",
    title: "Accelerometer",
    description: "Reactive ripples based on device tilt.",
    Class: AccelerometerCard,
    needsSensor: true,
  },
  {
    id: "spiral",
    title: "Spiral",
    description: "Spiralling circle flow.",
    Class: SpiralFlowCard,
    needsSensor: false,
  },
];

const galleryOverlay = document.createElement("div");
galleryOverlay.id = "gallery-overlay";
renderGallery();
document.body.appendChild(galleryOverlay);

const backButton = document.createElement("button");
backButton.id = "back-button";
backButton.innerText = "← Gallery";
backButton.style.display = "none";
document.body.appendChild(backButton);

backButton.addEventListener("click", () => {
  stopApp();
  galleryOverlay.style.display = "flex";
  backButton.style.display = "none";
});

function renderGallery() {
  galleryOverlay.innerHTML = `
    <div class="gallery-content">
      <h1>Shader Cards</h1>
      <div class="card-grid">
        ${CARDS.map(
          (card) => `
          <div class="card-item" data-id="${card.id}">
            <h3>${card.title}</h3>
            <p>${card.description}</p>
          </div>
        `
        ).join("")}
      </div>
    </div>
  `;

  galleryOverlay.querySelectorAll(".card-item").forEach((item) => {
    item.addEventListener("click", () => {
      const cardId = item.getAttribute("data-id");
      const cardConfig = CARDS.find((c) => c.id === cardId);
      startCard(cardConfig);
    });
  });
}

async function startCard(config) {
  if (config.needsSensor) {
    const granted = await uniforms.requestPermissions();
    if (!granted) {
      alert("Sensor permission denied.");
    }
  }

  galleryOverlay.style.display = "none";
  backButton.style.display = "block";

  activeCard = new config.Class(renderer, uniforms);
  animate();
}

function stopApp() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  activeCard = null;
  renderer.clear();
}

function animate() {
  uniforms.update();
  renderer.clear();

  if (activeCard) {
    activeCard.render();
  }

  animationFrameId = requestAnimationFrame(animate);
}
