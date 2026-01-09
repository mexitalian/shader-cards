import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

export default class SpiralFlowCard {
  constructor(renderer, uniformManager) {
    this.renderer = renderer;
    this.gl = renderer.gl;
    this.uniforms = uniformManager;

    this.program = renderer.createProgram(vertexShader, fragmentShader);
    this.positionBuffer = renderer.initQuad();

    this.positionLoc = this.gl.getAttribLocation(this.program, "a_position");
    
    // Interactive state
    this.inward = 0.0;
    this.direction = 1.0;

    this.onCanvasClick = () => {
      this.inward = this.inward === 0.0 ? 1.0 : 0.0;
    };
    this.onCanvasRightClick = (ev) => {
      ev.preventDefault();
      this.direction = this.direction === 1.0 ? -1.0 : 1.0;
    };

    this.renderer.canvas.addEventListener("click", this.onCanvasClick);
    this.renderer.canvas.addEventListener("contextmenu", this.onCanvasRightClick);
  }

  destroy() {
    this.renderer.canvas.removeEventListener("click", this.onCanvasClick);
    this.renderer.canvas.removeEventListener("contextmenu", this.onCanvasRightClick);
  }

  render() {
    const gl = this.gl;

    gl.useProgram(this.program);

    // Setup uniforms
    this.uniforms.setUniforms(gl, this.program);

    // Custom uniforms
    const inwardLoc = gl.getUniformLocation(this.program, "u_inward");
    if (inwardLoc) gl.uniform1f(inwardLoc, this.inward);

    const dirLoc = gl.getUniformLocation(this.program, "u_direction");
    if (dirLoc) gl.uniform1f(dirLoc, this.direction);

    // Setup attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.positionLoc);
    gl.vertexAttribPointer(this.positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
