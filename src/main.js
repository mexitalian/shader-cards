import Renderer from "./engine/Renderer.js";
import UniformManager from "./engine/UniformManager.js";
import HelloWorldCard from "./cards/HelloWorld/index.js";
import "./style.css";

const canvas = document.querySelector("#canvas");
const renderer = new Renderer(canvas);
const uniforms = new UniformManager();

// Initialize the first card
const activeCard = new HelloWorldCard(renderer, uniforms);

function animate() {
  uniforms.update();
  renderer.clear();

  if (activeCard) {
    activeCard.render();
  }

  requestAnimationFrame(animate);
}

animate();
