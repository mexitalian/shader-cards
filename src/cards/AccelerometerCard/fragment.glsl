precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec2 u_tilt;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Shift UVs based on tilt
    vec2 tiltedUv = uv + u_tilt * 0.2;
    
    // Create a dynamic pattern based on time and tilt
    float ripple = sin(distance(tiltedUv, vec2(0.5)) * 10.0 - u_time * 2.0);
    
    vec3 color = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0, 2, 4) + u_tilt.xyx);
    
    // Mix in the ripple effect
    color += ripple * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
}
