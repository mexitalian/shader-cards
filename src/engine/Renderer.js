export default class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl");

    if (!this.gl) {
      console.error("WebGL not supported");
      return;
    }

    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  createProgram(vertexSource, fragmentSource) {
    const gl = this.gl;
    const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.createShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentSource
    );

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return null;
    }

    return program;
  }

  initQuad() {
    const gl = this.gl;
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Create a full-screen quad
    const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return positionBuffer;
  }

  clear() {
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }
}
