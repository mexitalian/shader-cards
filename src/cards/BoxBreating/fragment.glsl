precision highp float;

uniform float u_time;       // seconds
uniform vec2  u_resolution; // pixels (width, height)

const vec3 OFF_WHITE = vec3(0.94, 0.94, 0.94);
const vec3 OFF_BLACK = vec3(0.06, 0.06, 0.06);

void main() {
    vec2 fragCoord = gl_FragCoord.xy;

    vec2 uv = fragCoord / u_resolution;
    vec2 center = vec2(0.5, 0.5);
    vec2 p = uv - center;

    float aspect = u_resolution.x / u_resolution.y;
    p.x *= aspect;
    float dist = length(p);

    float time = mod(u_time, 16.0);
    vec3 color = OFF_BLACK; // inverted start

    // PHASE 1: 0-4s | Radial Fill (center out to white)
    if (time < 4.0) {
        float progress = time / 4.0;
        float mask = step(progress * 1.5, dist);
        color = mix(OFF_WHITE, OFF_BLACK, mask);
    }
    // PHASE 2: 4-8s | Global Fade (white to black)
    else if (time < 8.0) {
        float progress = (time - 4.0) / 4.0;
        color = mix(OFF_WHITE, OFF_BLACK, progress);
    }
    // PHASE 3: 8-12s | Radial Shrink (black inwards to white)
    else if (time < 12.0) {
        float progress = (time - 8.0) / 4.0;
        float mask = step(1.5 * (1.0 - progress), dist);
        color = mix(OFF_BLACK, OFF_WHITE, mask);
    }
    // PHASE 4: 12-16s | Global Fade (white to black)
    else {
        float progress = (time - 12.0) / 4.0;
        color = mix(OFF_WHITE, OFF_BLACK, progress);
    }

    gl_FragColor = vec4(color, 1.0);
}
