var e=40,t=5,n=[[[.88,.32,.16],[.97,.79,.37]],[[.34,.92,1],[.24,.4,.8]],[[1,.66,.37],[.62,.36,.84]],[[1,.87,.54],[.8,.3,.17]],[[.9,.36,.2],[.46,.9,.8]]];function r(r=e,i=t,a=n.length,o=24301){let s=o>>>0,c=()=>{s=s+1831565813>>>0;let e=s;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296},l=Array(r*i),u=(e,t)=>e>=0&&e<r&&t>=0?l[t*r+e]:-1;for(let e=0;e<i;e+=1)for(let t=0;t<r;t+=1){let n=[u(t-1,e),u(t-2,e),u(t,e-1)],i=[u(t-1,e-1),u(t+1,e-1)],o=[];for(let e=0;e<a;e+=1)n.includes(e)||o.push(e);let s=o.filter(e=>!i.includes(e)),d=s.length?s:o;l[e*r+t]=d[Math.floor(c()*d.length)]}return l}var i=`attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`,a=`
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform float uDim;
uniform vec3 uWax[5];
uniform vec3 uLiq[5];
uniform sampler2D uColors;

const float COLS = ${e.toFixed(1)};
const float ROWS = ${t.toFixed(1)};

float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }

float colorAt(float cell, float row) {
  float c = clamp(cell, 0.0, COLS - 1.0);
  return floor(texture2D(uColors, vec2((c + 0.5) / COLS, (row + 0.5) / ROWS)).r * 255.0 / 51.0 + 0.5);
}
void pal(float k, out vec3 w, out vec3 l) {
  w = uWax[0]; l = uLiq[0];
  for (int i = 1; i < 5; i++) { if (float(i) == k) { w = uWax[i]; l = uLiq[i]; } }
}

// the classic flat-top lamp: cone base, tapered bottle, short cap
float lampW(float v, out float part) {
  part = -1.0;
  if (v < 0.0) return 0.0;
  if (v < 0.30) { part = 0.0; return mix(0.168, 0.098, v / 0.30); }
  if (v < 0.86) { part = 1.0; return mix(0.098, 0.064, (v - 0.30) / 0.56); }
  if (v < 0.965) { part = 2.0; return mix(0.074, 0.060, (v - 0.86) / 0.105); }
  return 0.0;
}
float gw(float v) { float p; return lampW(clamp(v, 0.301, 0.859), p); }

vec4 lamp(vec2 q, float seed, float pxw, float e, vec3 wax, vec3 liq) {
  float part; float w = lampW(q.y, part);
  if (part < 0.0) return vec4(0.0);
  float a = smoothstep(w + pxw, w - pxw, abs(q.x));
  float nx = clamp(q.x / w, -1.0, 1.0);
  vec3 S;
  if (part == 1.0) {
    float t = (q.y - 0.30) / 0.56;
    float bulb = exp(-t * 2.4);
    vec3 L = liq * ((0.78 + 1.05 * bulb) * e + 0.18);
    float f = 0.0;
    float b0 = gw(0.32);
    { vec2 dd = (q - vec2(0.0, 0.308)) * vec2(1.0, 2.4); float r = b0 * 0.72; f += r * r / (dot(dd, dd) + 1e-5); }
    for (int j = 0; j < 3; j++) {
      float fj = float(j);
      float h1 = hash(seed + fj * 3.1), h2 = hash(seed + fj * 5.7), h3 = hash(seed + fj * 9.3);
      float cyc = 0.5 - 0.5 * cos(6.2831 * (uT * (0.03 + 0.03 * h1) + h2));
      float y = mix(0.335, 0.79, pow(cyc, 1.35));
      float gy = gw(y);
      float x = gy * 0.35 * sin(uT * 0.2 * (0.6 + h3) + h1 * 6.28);
      float r = gy * mix(0.36, 0.55, h3);
      vec2 dd = q - vec2(x, y);
      f += r * r / (dot(dd, dd) + 1e-5);
    }
    float wa = smoothstep(0.92, 1.08, f);
    vec3 Wx = wax * ((0.70 + 1.15 * bulb) * e + 0.2) * (0.9 + 0.2 * smoothstep(1.0, 2.5, f));
    S = mix(L, Wx, wa);
    S += vec3(1.0) * 0.5 * exp(-pow((nx + 0.55) / 0.12, 2.0));
  } else {
    float env = 0.5 + 0.45 * smoothstep(0.95, 0.15, abs(nx)) + 0.5 * exp(-pow((nx + 0.46) / 0.14, 2.0));
    S = vec3(0.86, 0.82, 0.74) * env * (part == 0.0 ? 0.74 : 0.65);
    if (part == 0.0) S += liq * 0.5 * e * exp(-pow((q.y - 0.30) / 0.03, 2.0));
  }
  return vec4(S, a);
}

// the lobby wall, seen from a camera standing to its left; the wall starts
// well off-frame so every edge shows lamps
const float YAW = 0.24, Z0 = 1.2, FOCAL = 1.5, CAM_Y = 2.44, WALL_START = -9.0, CW = 0.46;

vec3 wallView(vec2 c, float pxScale, float e) {
  const float z0 = Z0, f = FOCAL, camY = CAM_Y, wallStart = WALL_START;
  float sn = sin(YAW), cs = cos(YAW);
  float den = f * cs - c.x * sn;
  if (den <= 0.02) return vec3(0.045, 0.041, 0.038);
  float X = c.x * z0 / den;
  float z = z0 + X * sn;
  float Y = c.y * z / f + camY;
  float pxw = z / (f * pxScale);
  float cw = CW, L = 0.74, board = 0.07;
  vec3 col;
  float row = floor(Y);
  float fy = Y - row;
  if (row < 0.0) {
    col = vec3(0.07, 0.063, 0.056) + vec3(0.22, 0.16, 0.09) * exp(Y * 3.0);
  } else if (row >= ROWS) {
    col = vec3(0.1, 0.086, 0.073) * (1.0 - 0.3 * smoothstep(ROWS, ROWS + 1.5, Y));
  } else if (X < wallStart || X > wallStart + COLS * cw) {
    float edgeD = X < wallStart ? (wallStart - X) : (X - (wallStart + COLS * cw));
    col = vec3(0.09, 0.08, 0.07) + vec3(0.30, 0.22, 0.14) * exp(-edgeD * 2.2) * 0.4;
  } else {
    float cell = floor((X - wallStart) / cw);
    float fx = (X - wallStart) - cell * cw - cw * 0.5;
    float seed = cell * 17.3 + row * 31.7;
    vec3 wx, lq; pal(colorAt(cell, row), wx, lq);
    // every glass lights the wall around it; the light crosses cubby edges
    // and blends with its neighbours instead of filling a block
    vec3 light = vec3(0.0);
    for (int k = -2; k <= 2; k++) {
      float nc = cell + float(k);
      if (nc < 0.0 || nc > COLS - 1.0) continue;
      vec3 w2, l2; pal(colorAt(nc, row), w2, l2);
      float dx = fx - float(k) * cw;
      float dy = fy - 0.5;
      float d2 = dx * dx + dy * dy * 0.5;
      light += mix(l2, w2, 0.45) * (0.55 * exp(-d2 / 0.012) + 0.28 * exp(-d2 / 0.06));
    }
    col = vec3(0.12, 0.106, 0.095) + light * e;
    if (fy < board) col = vec3(0.62, 0.58, 0.53) * (0.58 + 0.42 * fy / board) * mix(0.72, 1.0, e) + light * 0.38 * e;
    vec4 lp = lamp(vec2(fx, fy - board) / L, seed, pxw / L, e, wx, lq);
    col = mix(col, lp.rgb, lp.a);
  }
  col = mix(col, vec3(0.11, 0.095, 0.083), smoothstep(4.0, 12.0, z) * 0.6);
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 c = uv * 2.0 - 1.0;
  float aspect = uRes.x / uRes.y;
  float e = mix(1.0, 0.18, uDim);
  // pan so the frame's left edge falls just before a lamp at any width: the
  // first lamp sits whole at the edge instead of a sliver and a gap
  float sn = sin(YAW), cs = cos(YAW);
  float edge = -aspect - 0.2;
  float edgeX = edge * Z0 / (FOCAL * cs - edge * sn);
  float lampIndex = floor((edgeX - WALL_START + 0.15) / CW);
  float targetX = WALL_START + (lampIndex + 0.5) * CW - 0.15;
  float pan = targetX * FOCAL * cs / (Z0 + targetX * sn) + aspect;
  vec3 col = wallView(vec2(c.x * aspect + pan, c.y), uRes.y * 0.5, e);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(lum), col, 0.97);
  col = col * vec3(0.97, 1.0, 1.02) + vec3(0.0, 0.01, 0.014);
  col *= 1.0 - 0.41 * pow(length(c * vec2(0.8, 1.0)) / 1.3, 2.3);
  gl_FragColor = vec4(1.0 - exp(-col * 1.45), 1.0);
}`;function o({canvas:o,reducedMotion:s=!1}){let c=o.getContext(`webgl`,{antialias:!1,alpha:!1,powerPreference:`low-power`});if(!c)return null;let l=(e,t)=>{let n=c.createShader(e);if(c.shaderSource(n,t),c.compileShader(n),!c.getShaderParameter(n,c.COMPILE_STATUS))throw Error(c.getShaderInfoLog(n)||`lava feed shader`);return n},u=c.createProgram();if(c.attachShader(u,l(c.VERTEX_SHADER,i)),c.attachShader(u,l(c.FRAGMENT_SHADER,a)),c.linkProgram(u),!c.getProgramParameter(u,c.LINK_STATUS))throw Error(c.getProgramInfoLog(u)||`lava feed program`);c.useProgram(u),c.bindBuffer(c.ARRAY_BUFFER,c.createBuffer()),c.bufferData(c.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),c.STATIC_DRAW);let d=c.getAttribLocation(u,`p`);c.enableVertexAttribArray(d),c.vertexAttribPointer(d,2,c.FLOAT,!1,0,0);let f=e=>c.getUniformLocation(u,e),p=f(`uRes`),m=f(`uT`),h=f(`uDim`);c.uniform3fv(f(`uWax`),n.flatMap(e=>e[0])),c.uniform3fv(f(`uLiq`),n.flatMap(e=>e[1]));let g=c.createTexture();c.activeTexture(c.TEXTURE0),c.bindTexture(c.TEXTURE_2D,g),c.pixelStorei(c.UNPACK_ALIGNMENT,1),c.texImage2D(c.TEXTURE_2D,0,c.LUMINANCE,e,t,0,c.LUMINANCE,c.UNSIGNED_BYTE,Uint8Array.from(r(),e=>e*51)),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MIN_FILTER,c.NEAREST),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_MAG_FILTER,c.NEAREST),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_S,c.CLAMP_TO_EDGE),c.texParameteri(c.TEXTURE_2D,c.TEXTURE_WRAP_T,c.CLAMP_TO_EDGE),c.uniform1i(f(`uColors`),0);let _=!1,v=0,y=0,b=60,x=0,S=0,C=()=>{c.uniform2f(p,o.width,o.height),c.uniform1f(m,b),c.uniform1f(h,x),c.drawArrays(c.TRIANGLES,0,3)},w=e=>{let t=y?Math.min(.05,(e-y)/1e3):0;y=e,x+=(S-x)*(1-Math.exp(-t*(S>x?1.6:1))),b+=t*(1-.7*x),C(),v=_?requestAnimationFrame(w):0},T=()=>{let e=Math.min(window.devicePixelRatio||1,2),t=o.getBoundingClientRect(),n=Math.max(1,Math.round(t.width*e)),r=Math.max(1,Math.round(t.height*e));o.width===n&&o.height===r||(o.width=n,o.height=r,c.viewport(0,0,n,r),v||C())},E=0,D=new ResizeObserver(()=>{cancelAnimationFrame(E),E=requestAnimationFrame(T)});D.observe(o),T();let O=()=>{v||s||(y=0,v=requestAnimationFrame(w))};return{setActive(e){_=e,_?O():v&&(cancelAnimationFrame(v),v=0)},setDim(e){S=+!!e,s&&(x=S,C())},dispose(){_=!1,v&&cancelAnimationFrame(v),v=0,cancelAnimationFrame(E),D.disconnect(),c.getExtension(`WEBGL_lose_context`)?.loseContext()}}}export{o as createLavaFeed};