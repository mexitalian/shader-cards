precision highp float;

uniform float u_time;           // seconds
uniform vec2  u_resolution;     // pixels (width, height)
uniform vec2  u_mouse;          // normalized 0..1 (from your app)
uniform vec2  u_tilt;           // normalized -1..1

// 0.0 = outward, 1.0 = inward
uniform float u_inward;
// +1.0 = original direction, -1.0 = reverse rotation
uniform float u_direction;

const float MATH_PI = 3.14159265359;

void Rotate(inout vec2 p, float a) {
    p = cos(a) * p + sin(a) * vec2(p.y, -p.x);
}

float saturate(float x) {
    return clamp(x, 0.0, 1.0);
}

void main() {
    // Shadertoy-style fragCoord
    vec2 fragCoord = gl_FragCoord.xy;

    // Convert normalized mouse to pixel coords (if you want to use it)
    vec2 mousePx = u_mouse * u_resolution;

    // Base coordinate mapping, then apply a subtle tilt-based offset & rotation
    vec2 p = (2.0 * fragCoord - u_resolution.xy) / u_resolution.x * 1000.0;

    // Use tilt to nudge the pattern in screen space
    // u_tilt in [-1,1], scale to a small range in scene space
    vec2 tiltOffset = u_tilt * 150.0;
    p += tiltOffset;

    // Also use tilt.x as a small extra angular bias
    float tiltAngle = u_tilt.x * 0.5; // radians
    Rotate(p, tiltAngle);

    float sdf = 1e6;
    float dirX = 0.0;

    // Circle “trails”
    for (float iCircle = 1.0; iCircle < 16.0 * 4.0 - 1.0; iCircle += 1.0) {
        float circleN = iCircle / (16.0 * 4.0 - 1.0);

    // One full cycle is 12 seconds: [0..4) -> 0.0, [4..12) -> 1.0
    float cycleLen = 12.0;
    float cyclePos = mod(u_time, cycleLen);

    // inwardState: 0.0 for first 4s, 1.0 for next 8s
    float inwardState = (cyclePos < 4.0) ? 0.0 : 1.0;

    // continuous phase, independent of mode
    float basePhase = circleN + u_time * 0.2;

    // direction sign (still from your uniform)
    float dirSign = (u_direction >= 0.0) ? 1.0 : -1.0;
    float phaseDir = basePhase * dirSign;

    // base 0..1 phase
    float t = fract(phaseDir);

    // inward/outward remap using inwardState
    float tFlow = mix(t, 1.0 - t, inwardState);

    // offset and radius driven by tFlow
    float offset = -180.0 - 330.0 * tFlow;

    float angle = fract(
        iCircle / 16.0 +
        u_time * 0.01 * dirSign +
        circleN / 8.0
    );

    float radius = mix(
        50.0,
        0.0,
        1.0 - saturate(1.2 * (1.0 - abs(2.0 * tFlow - 1.0)))
    );

    vec2 p2 = p;
    Rotate(p2, -angle * 2.0 * MATH_PI);
    p2 += vec2(-offset, 0.0);

    float dist = length(p2) - radius;
    if (dist < sdf) {
        // guard radius to avoid division by zero
        float safeRadius = max(radius, 1e-3);
        dirX = p2.x / safeRadius;
        sdf  = dist;
    }
}

    // Base colors
    vec3 colorA = vec3(24.0, 30.0, 28.0);
    vec3 colorB = vec3(249.0, 249.0, 249.0);

    // Chromatic-ish aberration based on direction
    vec3 abberr = colorB;
    abberr = mix(abberr, vec3(205.0, 80.0, 28.0), saturate(dirX));
    abberr = mix(abberr, vec3(38.0, 119.0, 208.0), saturate(-dirX));

    // Use tilt.y to modulate the aberration strength a bit
    float tiltMix = 0.5 + 0.5 * clamp(u_tilt.y, -1.0, 1.0);
    float aberrationAmount = smoothstep(0.0, 1.0, (sdf + 5.0) * 0.1) * tiltMix;

    colorB = mix(
        colorB,
        abberr,
        aberrationAmount
    );

    vec3 color = mix(
        colorA,
        colorB,
        vec3(1.0 - smoothstep(0.0, 1.0, sdf * 0.3))
    );

    gl_FragColor = vec4(color / 255.0, 1.0);
}
