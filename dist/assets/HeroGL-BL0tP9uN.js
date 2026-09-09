import{r as s,j as e,C as M,S as b,u as j,a as h,F as w}from"./r3f-HltY-S_g.js";import{d as y,Z as E,_ as R,$ as S,x as F,M as v}from"./three-FmAhfSQY.js";import{E as T,B as C,a as g,C as A}from"./postfx-Br6R0F7Y.js";const f=typeof window<"u"&&matchMedia("(pointer: coarse)").matches,p=f?80:320;function P(){const n=s.useRef(new y(0,0));return s.useEffect(()=>{if(f)return;const t=i=>{n.current.x=i.clientX/window.innerWidth*2-1,n.current.y=-(i.clientY/window.innerHeight*2-1)};return window.addEventListener("mousemove",t,{passive:!0}),()=>window.removeEventListener("mousemove",t)},[]),n}const L=`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv       = uv;
    vNormal   = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,z=`
  uniform float uTime;
  uniform vec2  uMouse;
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vPosition;

  void main() {
    vec3  red    = vec3(0.87, 0.106, 0.11);
    vec3  hot    = vec3(1.0,  0.165, 0.165);
    vec3  black  = vec3(0.0);

    // Fresnel rim
    float rim    = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.8);

    // Animated scan line
    float scan   = step(0.49, fract(vUv.y * 14.0 + uTime * 0.35));

    // Mouse-driven iridescence shift
    float shift  = dot(vNormal.xy, uMouse) * 0.5;
    float irid   = 0.5 + 0.5 * sin(uTime * 0.7 + vUv.x * 6.0 + shift * 3.14);

    vec3  col    = mix(black, red, rim * 0.85);
    col         += hot * irid * rim * 0.4;
    col         += red * scan * 0.06;

    // Subtle face fill
    col         += red * 0.07;

    gl_FragColor  = vec4(col, rim * 0.9 + 0.08);
  }
`;function H({mouse:n}){const t=s.useRef(null),i=s.useRef(null),o=s.useMemo(()=>{const c=new E,m=6,u=1.2;for(let l=0;l<=m;l++){const d=l/m*Math.PI*2-Math.PI/6;l===0?c.moveTo(Math.cos(d)*u,Math.sin(d)*u):c.lineTo(Math.cos(d)*u,Math.sin(d)*u)}return new R(c,{depth:.22,bevelEnabled:!0,bevelThickness:.06,bevelSize:.04,bevelSegments:4})},[]);s.useEffect(()=>()=>{o.dispose()},[o]);const r=s.useMemo(()=>new S(o),[o]);s.useEffect(()=>()=>{r.dispose()},[r]);const a=s.useMemo(()=>({uTime:{value:0},uMouse:{value:new y(0,0)}}),[]);return h(({clock:c})=>{i.current&&(i.current.uniforms.uTime.value=c.elapsedTime,i.current.uniforms.uMouse.value.lerp(n.current,.06)),t.current&&(t.current.rotation.y+=.004,t.current.rotation.x=v.lerp(t.current.rotation.x,n.current.y*.25,.04))}),e.jsxs(w,{speed:1.4,rotationIntensity:.3,floatIntensity:.6,children:[e.jsx("mesh",{ref:t,geometry:o,position:[0,0,0],children:e.jsx("shaderMaterial",{ref:i,vertexShader:L,fragmentShader:z,uniforms:a,transparent:!0,side:F})}),e.jsx("lineSegments",{geometry:r,children:e.jsx("lineBasicMaterial",{color:"#de1b1c",opacity:.25,transparent:!0})})]})}function I({mouse:n}){const t=s.useRef(null),{positions:i,speeds:o}=s.useMemo(()=>{const r=new Float32Array(p*3),a=new Float32Array(p);for(let c=0;c<p;c++)r[c*3]=(Math.random()-.5)*20,r[c*3+1]=(Math.random()-.5)*16,r[c*3+2]=(Math.random()-.5)*14,a[c]=.003+Math.random()*.005;return{positions:r,speeds:a}},[]);return h(({clock:r})=>{if(!t.current)return;const a=t.current.geometry.attributes.position.array,c=r.elapsedTime;for(let m=0;m<p;m++){const u=m*3;if(a[u+1]-=o[m],a[u+1]<-8&&(a[u+1]=8),!f){const l=a[u]-n.current.x*6,d=a[u+1]-n.current.y*4,x=Math.sqrt(l*l+d*d);x<1.5&&(a[u]+=l/x*.04,a[u+1]+=d/x*.03)}}t.current.geometry.attributes.position.needsUpdate=!0,t.current.rotation.y=c*.015}),e.jsxs("points",{ref:t,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",array:i,count:p,itemSize:3})}),e.jsx("pointsMaterial",{color:"#de1b1c",size:.055,sizeAttenuation:!0,transparent:!0,opacity:.55,depthWrite:!1})]})}function U(){const n=[s.useRef(null),s.useRef(null),s.useRef(null)],t=[1.9,2.5,3.2],i=[.008,-.005,.004];return h(()=>{n.forEach((o,r)=>{o.current&&(o.current.rotation.z+=i[r])})}),e.jsx(e.Fragment,{children:t.map((o,r)=>e.jsxs("mesh",{ref:n[r],rotation:[Math.PI/2,0,r*Math.PI/3],children:[e.jsx("torusGeometry",{args:[o,.008,6,80]}),e.jsx("meshBasicMaterial",{color:"#de1b1c",transparent:!0,opacity:.18-r*.04})]},r))})}function G(){const n=s.useRef(0);return s.useEffect(()=>{const t=()=>{const{scrollTop:i,scrollHeight:o,clientHeight:r}=document.documentElement;n.current=o>r?i/(o-r):0};return window.addEventListener("scroll",t,{passive:!0}),()=>window.removeEventListener("scroll",t)},[]),n}function _({mouse:n}){const{camera:t}=j(),i=G();return h(()=>{const o=i.current,r=6-o*3.5,a=o*.8;t.position.x=v.lerp(t.position.x,n.current.x*.8,.03),t.position.y=v.lerp(t.position.y,n.current.y*.5-a,.03),t.position.z=v.lerp(t.position.z,r,.025),t.lookAt(0,0,0)}),null}const k=new y(.002,.002);function D(){return f?null:e.jsxs(T,{children:[e.jsx(C,{luminanceThreshold:.18,luminanceSmoothing:.9,intensity:1.6,blendFunction:g.ADD}),e.jsx(A,{radialModulation:!1,modulationOffset:0,blendFunction:g.NORMAL,offset:k})]})}function N(){const n=P();return e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{intensity:.15}),e.jsx("pointLight",{color:"#de1b1c",intensity:3,position:[2,2,3],distance:12,decay:2}),e.jsx("pointLight",{color:"#ff4444",intensity:1.5,position:[-3,-2,2],distance:10,decay:2}),e.jsx(_,{mouse:n}),e.jsx(H,{mouse:n}),e.jsx(U,{}),e.jsx(I,{mouse:n}),e.jsx(b,{radius:60,depth:30,count:f?300:800,factor:2,fade:!0,speed:.4}),e.jsx(D,{})]})}function O(){return e.jsx("div",{style:{position:"absolute",inset:0,background:"radial-gradient(ellipse at 50% 40%, rgba(222,27,28,0.12) 0%, transparent 70%)",zIndex:0},"aria-hidden":"true"})}function W(){const n=s.useMemo(()=>{try{const t=document.createElement("canvas");return!!(t.getContext("webgl2")||t.getContext("webgl")||t.getContext("experimental-webgl"))}catch{return!1}},[]);return e.jsx("div",{style:{position:"absolute",inset:0,zIndex:0,pointerEvents:"none"},"aria-hidden":"true",children:n?e.jsx(M,{camera:{position:[0,0,6],fov:52},gl:{antialias:!f,alpha:!0,powerPreference:"high-performance"},dpr:f?1:[1,1.5],style:{background:"transparent"},children:e.jsx(N,{})}):e.jsx(O,{})})}export{W as default};
//# sourceMappingURL=HeroGL-BL0tP9uN.js.map
