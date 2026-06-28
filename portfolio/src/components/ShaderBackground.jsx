import { useEffect, useRef } from 'react';

export default function ShaderBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      const w = Math.max(canvas.clientWidth || 1280, 1);
      const h = Math.max(canvas.clientHeight || 720, 1);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

float circle(vec2 p, float r, float blur) {
  return smoothstep(r + blur, r - blur, length(p));
}

void main() {
  vec2 uv = v_texCoord;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.5;
  float pulse = 0.5 + 0.5 * sin(t * 1.2 + length(p) * 4.0);
  float lines = 0.03 * sin((uv.y + t * 0.6) * 20.0) + 0.02 * cos((uv.x - t * 0.8) * 18.0);

  vec2 mouse = u_mouse / u_resolution;
  vec2 mouseP = mouse * 2.0 - 1.0;
  mouseP.x *= u_resolution.x / u_resolution.y;
  float dist = length(p - mouseP);
  float glow = 0.25 / (dist * dist + 0.04);

  vec3 base = mix(vec3(0.03, 0.02, 0.08), vec3(0.08, 0.02, 0.16), uv.y);
  vec3 neon = vec3(0.95, 0.95, 0.2) * (0.18 + 0.22 * pulse) * circle(p + vec2(sin(t) * 0.35, cos(t * 0.8) * 0.25), 0.55, 0.12);
  neon += vec3(0.55, 0.16, 0.88) * (0.12 + lines);
  neon += vec3(1.0, 0.96, 0.22) * glow * 0.8;

  vec3 color = base + neon;
  color = pow(color, vec3(0.95));
  color *= 1.1;

  gl_FragColor = vec4(color, 1.0);
}`;

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const program = gl.createProgram();
    if (!program) return;

    const vertexShader = compileShader(gl.VERTEX_SHADER, vs);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let mouse = { x: canvas.width / 2, y: canvas.height / 2 };
    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = 1.0 - (event.clientY - rect.top) / rect.height;
      mouse.x = nx * canvas.width;
      mouse.y = ny * canvas.height;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null;
    if (resizeObserver) {
      resizeObserver.observe(canvas);
    }
    syncSize();

    let frameId = 0;
    function render(time) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uResolution) gl.uniform2f(uResolution, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      frameId = requestAnimationFrame(render);
    }

    frameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeObserver) resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvasRef} className="block w-full h-full" style={{ display: 'block' }} />
    </div>
  );
}
