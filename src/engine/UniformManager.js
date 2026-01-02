export default class UniformManager {
  constructor() {
    this.mouse = { x: 0, y: 0 };
    this.resolution = { x: window.innerWidth, y: window.innerHeight };
    this.startTime = Date.now();
    this.time = 0;

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX / window.innerWidth;
      this.mouse.y = 1.0 - e.clientY / window.innerHeight; // Normalize for GLSL
    });

    window.addEventListener("resize", () => {
      this.resolution.x = window.innerWidth;
      this.resolution.y = window.innerHeight;
    });
  }

  update() {
    this.time = (Date.now() - this.startTime) / 1000.0;
  }

  setUniforms(gl, program) {
    const timeLoc = gl.getUniformLocation(program, "u_time");
    if (timeLoc) gl.uniform1f(timeLoc, this.time);

    const resLoc = gl.getUniformLocation(program, "u_resolution");
    if (resLoc) gl.uniform2f(resLoc, this.resolution.x, this.resolution.y);

    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    if (mouseLoc) gl.uniform2f(mouseLoc, this.mouse.x, this.mouse.y);
  }
}
