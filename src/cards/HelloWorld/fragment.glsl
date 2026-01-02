precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    
    // Create a dynamic color based on time and mouse
    vec3 color = 0.5 + 0.5 * cos(u_time + uv.xyx + vec3(0, 2, 4));
    
    // Influence brightness with mouse position
    float dist = distance(uv, u_mouse);
    color *= smoothstep(0.8, 0.2, dist);
    
    gl_FragColor = vec4(color, 1.0);
}
