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
  }

  render() {
    const gl = this.gl;

    gl.useProgram(this.program);

    // Setup uniforms
    this.uniforms.setUniforms(gl, this.program);

    // Setup attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.positionLoc);
    gl.vertexAttribPointer(this.positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
