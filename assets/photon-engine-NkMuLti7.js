import{At as e,C as t,Dt as n,Ht as r,K as i,M as a,S as o,T as s,Tt as c,U as l,V as u,Vt as d,Wt as f,Yt as p,_t as m,a as ee,c as h,dn as g,f as _,gt as v,in as y,l as b,mt as x,n as te,pt as S,r as ne,s as C,t as re,un as ie,ut as w,v as ae,vt as T,wt as E}from"./prewarm-DWb0AaQg.js";import{a as oe,i as se,n as ce,r as le,t as ue}from"./OutputPass-DkcFgdyI.js";var de=class extends f{constructor(){super(),this.name=`RoomEnvironment`,this.position.y=-3.5;let t=new ae;t.deleteAttribute(`uv`);let n=new T({side:1}),r=new T,a=new e(16777215,900,28,2);a.position.set(.418,16.199,.3),this.add(a);let o=new S(t,n);o.position.set(-.757,13.219,.717),o.scale.set(31.713,28.305,28.591),this.add(o);let s=new i(t,r,6),c=new E;c.position.set(-10.906,2.009,1.846),c.rotation.set(0,-.195,0),c.scale.set(2.328,7.905,4.651),c.updateMatrix(),s.setMatrixAt(0,c.matrix),c.position.set(-5.607,-.754,-.758),c.rotation.set(0,.994,0),c.scale.set(1.97,1.534,3.955),c.updateMatrix(),s.setMatrixAt(1,c.matrix),c.position.set(6.167,.857,7.803),c.rotation.set(0,.561,0),c.scale.set(3.927,6.285,3.687),c.updateMatrix(),s.setMatrixAt(2,c.matrix),c.position.set(-2.017,.018,6.124),c.rotation.set(0,.333,0),c.scale.set(2.002,4.566,2.064),c.updateMatrix(),s.setMatrixAt(3,c.matrix),c.position.set(2.291,-.756,-2.621),c.rotation.set(0,-.286,0),c.scale.set(1.546,1.552,1.496),c.updateMatrix(),s.setMatrixAt(4,c.matrix),c.position.set(-2.193,-.369,-5.547),c.rotation.set(0,.516,0),c.scale.set(3.875,3.487,2.986),c.updateMatrix(),s.setMatrixAt(5,c.matrix),this.add(s);let l=new S(t,D(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let u=new S(t,D(50));u.position.set(-16.109,18.021,-8.207),u.scale.set(.1,2.425,2.751),this.add(u);let d=new S(t,D(17));d.position.set(14.904,12.198,-1.832),d.scale.set(.15,4.265,6.331),this.add(d);let f=new S(t,D(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);let p=new S(t,D(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);let m=new S(t,D(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){let e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(let t of e)t.dispose()}};function D(e){return new v({color:0,emissive:16777215,emissiveIntensity:e})}var fe={name:`FXAAShader`,uniforms:{tDiffuse:{value:null},resolution:{value:new ie(1/1024,1/512)}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec2 resolution;
		varying vec2 vUv;

		#define EDGE_STEP_COUNT 6
		#define EDGE_GUESS 8.0
		#define EDGE_STEPS 1.0, 1.5, 2.0, 2.0, 2.0, 4.0
		const float edgeSteps[EDGE_STEP_COUNT] = float[EDGE_STEP_COUNT]( EDGE_STEPS );

		float _ContrastThreshold = 0.0312;
		float _RelativeThreshold = 0.063;
		float _SubpixelBlending = 1.0;

		vec4 Sample( sampler2D  tex2D, vec2 uv ) {

			return texture( tex2D, uv );

		}

		float SampleLuminance( sampler2D tex2D, vec2 uv ) {

			return dot( Sample( tex2D, uv ).rgb, vec3( 0.3, 0.59, 0.11 ) );

		}

		float SampleLuminance( sampler2D tex2D, vec2 texSize, vec2 uv, float uOffset, float vOffset ) {

			uv += texSize * vec2(uOffset, vOffset);
			return SampleLuminance(tex2D, uv);

		}

		struct LuminanceData {

			float m, n, e, s, w;
			float ne, nw, se, sw;
			float highest, lowest, contrast;

		};

		LuminanceData SampleLuminanceNeighborhood( sampler2D tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData l;
			l.m = SampleLuminance( tex2D, uv );
			l.n = SampleLuminance( tex2D, texSize, uv,  0.0,  1.0 );
			l.e = SampleLuminance( tex2D, texSize, uv,  1.0,  0.0 );
			l.s = SampleLuminance( tex2D, texSize, uv,  0.0, -1.0 );
			l.w = SampleLuminance( tex2D, texSize, uv, -1.0,  0.0 );

			l.ne = SampleLuminance( tex2D, texSize, uv,  1.0,  1.0 );
			l.nw = SampleLuminance( tex2D, texSize, uv, -1.0,  1.0 );
			l.se = SampleLuminance( tex2D, texSize, uv,  1.0, -1.0 );
			l.sw = SampleLuminance( tex2D, texSize, uv, -1.0, -1.0 );

			l.highest = max( max( max( max( l.n, l.e ), l.s ), l.w ), l.m );
			l.lowest = min( min( min( min( l.n, l.e ), l.s ), l.w ), l.m );
			l.contrast = l.highest - l.lowest;
			return l;

		}

		bool ShouldSkipPixel( LuminanceData l ) {

			float threshold = max( _ContrastThreshold, _RelativeThreshold * l.highest );
			return l.contrast < threshold;

		}

		float DeterminePixelBlendFactor( LuminanceData l ) {

			float f = 2.0 * ( l.n + l.e + l.s + l.w );
			f += l.ne + l.nw + l.se + l.sw;
			f *= 1.0 / 12.0;
			f = abs( f - l.m );
			f = clamp( f / l.contrast, 0.0, 1.0 );

			float blendFactor = smoothstep( 0.0, 1.0, f );
			return blendFactor * blendFactor * _SubpixelBlending;

		}

		struct EdgeData {

			bool isHorizontal;
			float pixelStep;
			float oppositeLuminance, gradient;

		};

		EdgeData DetermineEdge( vec2 texSize, LuminanceData l ) {

			EdgeData e;
			float horizontal =
				abs( l.n + l.s - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.se - 2.0 * l.e ) +
				abs( l.nw + l.sw - 2.0 * l.w );
			float vertical =
				abs( l.e + l.w - 2.0 * l.m ) * 2.0 +
				abs( l.ne + l.nw - 2.0 * l.n ) +
				abs( l.se + l.sw - 2.0 * l.s );
			e.isHorizontal = horizontal >= vertical;

			float pLuminance = e.isHorizontal ? l.n : l.e;
			float nLuminance = e.isHorizontal ? l.s : l.w;
			float pGradient = abs( pLuminance - l.m );
			float nGradient = abs( nLuminance - l.m );

			e.pixelStep = e.isHorizontal ? texSize.y : texSize.x;

			if (pGradient < nGradient) {

				e.pixelStep = -e.pixelStep;
				e.oppositeLuminance = nLuminance;
				e.gradient = nGradient;

			} else {

				e.oppositeLuminance = pLuminance;
				e.gradient = pGradient;

			}

			return e;

		}

		float DetermineEdgeBlendFactor( sampler2D  tex2D, vec2 texSize, LuminanceData l, EdgeData e, vec2 uv ) {

			vec2 uvEdge = uv;
			vec2 edgeStep;
			if (e.isHorizontal) {

				uvEdge.y += e.pixelStep * 0.5;
				edgeStep = vec2( texSize.x, 0.0 );

			} else {

				uvEdge.x += e.pixelStep * 0.5;
				edgeStep = vec2( 0.0, texSize.y );

			}

			float edgeLuminance = ( l.m + e.oppositeLuminance ) * 0.5;
			float gradientThreshold = e.gradient * 0.25;

			vec2 puv = uvEdge + edgeStep * edgeSteps[0];
			float pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
			bool pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !pAtEnd; i++ ) {

				puv += edgeStep * edgeSteps[i];
				pLuminanceDelta = SampleLuminance( tex2D, puv ) - edgeLuminance;
				pAtEnd = abs( pLuminanceDelta ) >= gradientThreshold;

			}

			if ( !pAtEnd ) {

				puv += edgeStep * EDGE_GUESS;

			}

			vec2 nuv = uvEdge - edgeStep * edgeSteps[0];
			float nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
			bool nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			for ( int i = 1; i < EDGE_STEP_COUNT && !nAtEnd; i++ ) {

				nuv -= edgeStep * edgeSteps[i];
				nLuminanceDelta = SampleLuminance( tex2D, nuv ) - edgeLuminance;
				nAtEnd = abs( nLuminanceDelta ) >= gradientThreshold;

			}

			if ( !nAtEnd ) {

				nuv -= edgeStep * EDGE_GUESS;

			}

			float pDistance, nDistance;
			if ( e.isHorizontal ) {

				pDistance = puv.x - uv.x;
				nDistance = uv.x - nuv.x;

			} else {

				pDistance = puv.y - uv.y;
				nDistance = uv.y - nuv.y;

			}

			float shortestDistance;
			bool deltaSign;
			if ( pDistance <= nDistance ) {

				shortestDistance = pDistance;
				deltaSign = pLuminanceDelta >= 0.0;

			} else {

				shortestDistance = nDistance;
				deltaSign = nLuminanceDelta >= 0.0;

			}

			if ( deltaSign == ( l.m - edgeLuminance >= 0.0 ) ) {

				return 0.0;

			}

			return 0.5 - shortestDistance / ( pDistance + nDistance );

		}

		vec4 ApplyFXAA( sampler2D  tex2D, vec2 texSize, vec2 uv ) {

			LuminanceData luminance = SampleLuminanceNeighborhood( tex2D, texSize, uv );
			if ( ShouldSkipPixel( luminance ) ) {

				return Sample( tex2D, uv );

			}

			float pixelBlend = DeterminePixelBlendFactor( luminance );
			EdgeData edge = DetermineEdge( texSize, luminance );
			float edgeBlend = DetermineEdgeBlendFactor( tex2D, texSize, luminance, edge, uv );
			float finalBlend = max( pixelBlend, edgeBlend );

			if (edge.isHorizontal) {

				uv.y += edge.pixelStep * finalBlend;

			} else {

				uv.x += edge.pixelStep * finalBlend;

			}

			return Sample( tex2D, uv );

		}

		void main() {

			gl_FragColor = ApplyFXAA( tDiffuse, resolution.xy, vUv );

		}`},pe=2500,O=.79,k=e=>Math.min(1,Math.max(0,e)),A=e=>{let t=k(e);return t*t*(3-2*t)},me=e=>1-(1-k(e))**3,j=(e,t,n)=>Math.max(0,1-Math.abs(e-t)/n),he=e=>e<0?0:k(A((e-.1)/.28)*(.58+j(e,.58,.5)*.42));function M(e=30117){let t=e>>>0;return()=>(t=t*1664525+1013904223>>>0,t/4294967296)}function N(e,t,n,r,i,a,o=0,s=0,c=0){let l=new S(new h(t,n,r,5,i),a);return l.position.set(o,s,c),l.castShadow=!0,l.receiveShadow=!0,e.add(l),l}function P(e,t,n,r,i=48,a=7){let o=new S(new y(t,i,n,a,!1),r);return o.castShadow=!0,o.receiveShadow=!0,e.add(o),o}function F(e,t=0){let n=new s(e);return n.multiplyScalar(2.15),new x({color:n,transparent:!0,opacity:t,depthWrite:!1,blending:2,toneMapped:!1})}function I(e){let t=document.createElement(`canvas`);t.width=256,t.height=256;let n=t.getContext(`2d`),r=n.createImageData(256,256),i=M(91427);for(let e=0;e<r.data.length;e+=4){let t=Math.round(116+i()*32);r.data[e]=t,r.data[e+1]=t,r.data[e+2]=t,r.data[e+3]=255}n.putImageData(r,0,0);let a=new o(t);return a.wrapS=d,a.wrapT=d,a.repeat.set(7,3),a.anisotropy=Math.min(16,e.capabilities.getMaxAnisotropy()),a.colorSpace=``,a}function ge(e){let t=I(e);return{bump:t,case:new T({color:13153159,roughness:.76,metalness:.02,bumpMap:t,bumpScale:.024,envMapIntensity:.72}),caseRaised:new T({color:11967598,roughness:.64,metalness:.04,bumpMap:t,bumpScale:.018,envMapIntensity:.85}),caseDark:new T({color:7166523,roughness:.86,metalness:.04,bumpMap:t,bumpScale:.014}),titanium:new m({color:3354153,roughness:.22,metalness:.9,clearcoat:.24,clearcoatRoughness:.28,envMapIntensity:1.55}),blackMetal:new m({color:789774,roughness:.2,metalness:.82,clearcoat:.28,clearcoatRoughness:.22,envMapIntensity:1.5}),silver:new m({color:12172992,roughness:.17,metalness:.98,clearcoat:.16,clearcoatRoughness:.2,envMapIntensity:1.8}),gold:new m({color:13213525,roughness:.18,metalness:.96,clearcoat:.12,envMapIntensity:1.75})}}function _e(n){let r=new u,i=new u;r.add(i);let a=N(i,10.18,3.08,1.12,.19,new m({color:1386032,roughness:.035,metalness:0,transmission:.9,thickness:1.4,ior:1.58,dispersion:.72,iridescence:.55,iridescenceIOR:1.46,iridescenceThicknessRange:[90,520],attenuationColor:new s(1525584),attenuationDistance:2.6,transparent:!0,opacity:.96,depthWrite:!1,envMapIntensity:2}),0,0,.91);a.renderOrder=6;let o=n.blackMetal.clone();o.color.setHex(329996),N(i,9.54,2.48,.18,.12,o,0,0,.75);let l=[5761791,8567039,13929727,16754271,16768905,8319190],d=[],f=new p(.095,24,16);for(let e=0;e<13;e+=1){let n=-1.04+2.08/12*e,r=(e-6)*.055,a=new t([new g(-5.25,n,.91),new g(-2.75,n+r,1.02),new g(0,n*.48,1.22),new g(2.75,n-r,1.02),new g(5.25,n,.91)],!1,`centripetal`,.48),o=new x({color:new s(l[e%l.length]).multiplyScalar(.52),transparent:!0,opacity:.16,depthWrite:!1,blending:2,toneMapped:!1}),c=P(i,a,.023,o,72,6);c.castShadow=!1,c.renderOrder=3;let u=F(l[e%l.length]),p=P(i,a,.036,u,72,7);p.castShadow=!1,p.visible=!1,p.renderOrder=4;let m=new S(f,F(l[e%l.length],1));m.visible=!1,m.renderOrder=5,i.add(m),d.push({curve:a,baseFiberMaterial:o,liveFiber:p,liveMaterial:u,bead:m,offset:e/12})}let ee=new m({color:14679295,roughness:.02,metalness:0,transmission:.94,thickness:1.15,ior:1.7,dispersion:1,iridescence:1,iridescenceIOR:1.6,iridescenceThicknessRange:[100,760],attenuationColor:new s(8640219),attenuationDistance:2,transparent:!0,opacity:.96,depthWrite:!1,envMapIntensity:2.4}),h=new S(new c(1.08,2),ee);h.scale.set(.74,1.1,.78),h.rotation.set(.18,.38,Math.PI*.25),h.position.z=1.47,h.castShadow=!0,h.renderOrder=7,i.add(h);let _=F(16765067,.18),v=new S(new c(.38,1),_);v.position.z=1.47,v.renderOrder=8,i.add(v);let y=new e(9433087,.5,6.5,2);y.position.set(0,0,2.1),r.add(y);let b=new e(16757355,0,5.5,2);return b.position.set(5.6,0,1.7),r.add(b),{group:r,duration:pe,update({time:e,reveal:t,power:n,pointer:r,openOnly:o=!1}){let s=me(t);i.scale.setScalar(.96+s*.04),a.rotation.x=(1-s)*.12-r.y*.01,a.rotation.y=r.x*.012,h.rotation.y=.38+e*11e-5,h.rotation.x=.18+Math.sin(e*55e-5)*.035;let c=.12+Math.sin(e*.0012)*.035,l=0;if(n>=0&&(l=n<.22?A((n-.025)/.195):o||n<.79?1:1-A((n-.79)/.21)),h.visible=l>.08,v.visible=l>.08,y.intensity=l*(.3+c),n>=0){d.forEach((e,t)=>{let r=t*.013,i=o?O-r:.52,a=A((n-.23-r)/i),s=A((n-.2-r)/.16),c=o?1:1-A((n-.75)/.12);e.liveMaterial.opacity=s*c*(.48+j(a,.55,.55)*.46),e.liveFiber.visible=e.liveMaterial.opacity>.01,e.bead.visible=a>.015&&(a<1||o&&t===d.length-1),e.bead.position.copy(e.curve.getPointAt(k(a))),e.bead.scale.setScalar(.68+j(n,.5,.5)*.75),e.baseFiberMaterial.opacity=.16+s*c*.24});let e=j(n,.59,.27);_.opacity=.16+e*.84,v.scale.setScalar(1+e*.55),h.scale.set(.74+e*.06,1.1+e*.08,.78+e*.08),y.intensity=.6+e*9.4,b.intensity=j(n,.74,.1)*12}else d.forEach((t,n)=>{t.liveMaterial.opacity=0,t.liveFiber.visible=!1,t.bead.visible=!1,t.baseFiberMaterial.opacity=.13+Math.sin(e*.001+n)*.025}),_.opacity=.16+c*.35,v.scale.setScalar(1),h.scale.set(.74,1.1,.78),b.intensity=0},reset(){d.forEach(e=>{e.liveMaterial.opacity=0,e.liveFiber.visible=!1,e.bead.visible=!1}),b.intensity=0,h.visible=!1,v.visible=!1}}}async function L({canvas:t,stage:i,reducedMotion:o=!1,onOpenStart:s}={}){let c=new _({canvas:t,alpha:!0,antialias:!1,depth:!1,premultipliedAlpha:!1,powerPreference:`high-performance`,stencil:!1});c.outputColorSpace=r,c.toneMapping=6,c.toneMappingExposure=.86,c.setClearColor(0,0),c.shadowMap.enabled=!0,c.shadowMap.type=1;let d=new f,p=new n(26,1,.1,60);p.position.set(0,.15,19),p.lookAt(0,0,0),await C(()=>{});let m=new b(c),h=new de;await te(c,h,p),await C(()=>{});let g=m.fromScene(h,.025).texture;d.environment=g,h.dispose(),m.dispose(),await C(()=>{});let v=ge(c),y=new u;d.add(y);let x=new l(16773332,2430734,.72);d.add(x);let S=new a(16767396,2.65);S.position.set(-5.5,7.2,9.5),S.castShadow=!0,S.shadow.mapSize.set(2048,2048),S.shadow.camera.left=-9,S.shadow.camera.right=9,S.shadow.camera.top=5,S.shadow.camera.bottom=-5,S.shadow.bias=-3e-4,d.add(S);let ae=new a(9551847,.58);ae.position.set(6.2,-3.8,7.5),d.add(ae);let T=new e(16767131,2.4,18,2);T.position.set(3.8,1.4,5.4),d.add(T);let E=_e(v);y.add(E.group);let D=new se(c);D.addPass(new le(d,p));let O=new ce(new ie(1,1),.38,.28,.86);O.threshold=1.02,O.strength=.22,O.radius=.18,O.blendMaterial.fragmentShader=O.blendMaterial.fragmentShader.replace(`gl_FragColor = opacity * texel;`,`gl_FragColor = vec4(opacity * texel.rgb, 0.0);`),O.blendMaterial.needsUpdate=!0,D.addPass(O);let k=new oe(fe);D.addPass(k);let me=new ue;D.addPass(me);let j=!1,M=!0,N=null,P=!1,F=!1,I=!1,L=!1,R=0,z=performance.now(),ve=performance.now()+80,B=`closed`,V=-1,H=0,ye=0,U=null,W=null,G=0,K=1,be={width:0,height:0},q=null,xe=0,J=!1,Y={x:o?.18:-.55,y:.08,tx:.18,ty:.08,vx:0,vy:0},X=document.createElement(`div`);X.className=`photon-recess`,X.setAttribute(`aria-hidden`,`true`),X.innerHTML=[`bed`,`top`,`left`,`right`,`bottom`,`grain`].map(e=>`<span class="photon-recess-${e}"></span>`).join(``),i.prepend(X);let Se=(e=0,t=0)=>{let n=be;if(!n.width||!n.height)return;let r=w.degToRad(p.fov*.5),a=2*Math.tan(r)*p.position.z,o=n.height/a*p.position.z/(p.position.z-.55),s=4.9*o*K;i.style.setProperty(`--photon-recess-width`,`${14*o*K}px`),i.style.setProperty(`--photon-recess-height`,`${s}px`),i.style.setProperty(`--photon-recess-offset`,`${-.28*o*K}px`),i.style.setProperty(`--photon-cut-inset`,`${(1-e)*50}%`),i.style.setProperty(`--photon-block-inset`,`${Math.max(0,(n.height-s*e)/2)}px`),i.style.setProperty(`--photon-alcove-light`,t.toFixed(3)),i.style.setProperty(`--photon-outer-light`,(t*.72).toFixed(3)),i.classList.toggle(`has-opened`,e>.001)},Z=({dormant:e=!1}={})=>{if(L)return;let t=i.getBoundingClientRect();if(!t.width||!t.height)return;be={width:t.width,height:t.height};let n=e?1:window.devicePixelRatio||1,r=t.width<520,a=window.matchMedia?.(`(pointer: coarse)`).matches??!1,o=r||a,s=o?Math.min(Math.max(n,2),3):Math.min(Math.max(n,2),2.25),l=e?32:t.width,u=e?32:t.height,d=e?1:s,f=ee(c,l,u,d);f&&(J=!1);let m=o?4:0;if(D.renderTarget1.samples!==m&&(J=!1,D.renderTarget1.dispose(),D.renderTarget2.dispose(),D.renderTarget1.samples=m,D.renderTarget2.samples=m),f&&D.setSize(Math.floor(l*d),Math.floor(u*d)),k.enabled=!o,k.enabled){let e=c.getDrawingBufferSize(new ie);k.material.uniforms.resolution.value.set(1/Math.max(1,e.x),1/Math.max(1,e.y))}M=e,I=!1,p.aspect=t.width/t.height;let h=window.matchMedia?.(`(min-width: 1041px)`).matches?1.22:1;K=(p.aspect<1.7?1.04:1)*h*(t.width<520?1.25:1);let g=w.degToRad(p.fov*.5),_=8.65/(2*Math.tan(g)),v=18.65/(2*Math.tan(g)*p.aspect);p.position.z=Math.max(_,v),p.position.y=.12,p.lookAt(0,0,0),p.updateProjectionMatrix(),E.group.scale.setScalar(K),Se(V<0?0:A((V-.08)/.3),he(V))},Q=(e=performance.now())=>{F||(F=!0,ve=e+80);let t=o?1:A((e-ve)/1450);Se(V<0?0:A((V-.08)/.3),he(V)),E.update({time:e,reveal:t,power:V,pointer:Y,openOnly:!0}),T.position.set(Y.x*7.2,1+Y.y*3.2,4.4),y.rotation.x=-.024+Y.y*.012,y.rotation.y=.012+Y.x*.016,D.render(),i.classList.contains(`is-webgl`)||i.classList.add(`is-webgl`)},Ce=()=>{M||(c.setSize(1,1,!1),D.setSize(1,1),M=!0,J=!1,I=!1)},we=()=>{if(!M){if(document.body.classList.contains(`dossier-on`)){Ce();return}D.renderTarget1.dispose(),D.renderTarget2.dispose(),O.renderTargetBright.dispose();for(let e of[...O.renderTargetsHorizontal,...O.renderTargetsVertical])e.dispose();I=!0,J=!1}},Te=()=>{I&&!j&&B!==`opening`&&document.body.classList.contains(`dossier-on`)&&Ce()},Ee=()=>(N||(N=(async()=>{let e=[];d.traverse(t=>{t.visible||(e.push(t),t.visible=!0)});try{if(await te(c,d,p),await ne(c,[...D.passes.flatMap(e=>re(e).map(t=>[t,e===me])),...re(D.copyPass).map(e=>[e,!1])]),L)return;(!j||M)&&(Z({dormant:!0}),D.render())}finally{for(let t of e)t.visible=!1;!L&&B===`closed`&&E.reset()}P=!0})().catch(()=>{P=!0})),N),De=()=>{if(J||L||!P||B!==`closed`||((M||I)&&Z(),M))return;let e=[];d.traverse(t=>{t.visible||(e.push(t),t.visible=!0)});try{D.render(),J=!0}finally{for(let t of e)t.visible=!1;E.reset(),Q()}},Oe=(e=performance.now())=>{if(B!==`opening`)return;clearTimeout(G),G=0,H=1,V=1,B=`open`,i.dataset.photonState=B,i.classList.remove(`is-photon-opening`),i.classList.add(`is-photon-open`),M||Q(e),j||(i.classList.remove(`is-motion-active`),Ce());let t=W;W=null,U=null,!j||M||document.hidden?t?.():requestAnimationFrame(()=>t?.())},ke=(e,t,n,r)=>{Y[n]+=((t-Y[e])*112-Y[n]*21)*r,Y[e]+=Y[n]*r},Ae=e=>{if(R=0,L||document.hidden)return;let t=Math.min((e-z)/1e3,.04);if(z=e,ke(`x`,Y.tx,`vx`,t),ke(`y`,Y.ty,`vy`,t),B===`opening`&&(H=Math.min(1,(e-ye)/pe),V=H),B===`opening`&&H>=1){Oe(e);return}M||Q(e);let n=Math.abs(Y.vx)+Math.abs(Y.vy)+Math.abs(Y.tx-Y.x)+Math.abs(Y.ty-Y.y)>.002,r=!o&&e<ve+1450;(B===`opening`||n||r)&&(R=requestAnimationFrame(Ae))},$=()=>{R||L||!P||!j&&B!==`opening`||(z=performance.now(),R=requestAnimationFrame(Ae))},je=e=>{if(!L){if(j=e,i.classList.toggle(`is-motion-active`,e||B===`opening`),!e&&B!==`opening`){cancelAnimationFrame(R),R=0,we();return}if(!P){Ee().then(()=>{!j||L||(Z(),De(),$())});return}(M||I)&&Z(),De(),$()}},Me=()=>L||o||B===`open`?Promise.resolve():B===`opening`&&U?U:((M||I)&&Z(),B=`opening`,i.classList.add(`is-motion-active`),V=0,H=0,ye=performance.now(),i.dataset.photonState=B,i.classList.add(`is-photon-opening`),i.classList.remove(`is-photon-open`),s?.(),U=new Promise(e=>{W=e}),G=window.setTimeout(Oe,2680),$(),U),Ne=()=>{if(L||o)return Promise.resolve();if(q)return q;let e=xe,t=Ee().then(()=>{if(!(L||e!==xe))return De(),Me()}).finally(()=>{q===t&&(q=null)});return q=t,t},Pe=()=>{if(L)return;xe++,q=null,clearTimeout(G),G=0,B=`closed`,j||i.classList.remove(`is-motion-active`),V=-1,H=0,E.reset(),i.dataset.photonState=B,i.classList.remove(`is-photon-opening`,`is-photon-open`);let e=W;W=null,U=null,e?.(),j&&!M&&Q()},Fe=e=>{if(o||e.pointerType===`touch`)return;let t=i.getBoundingClientRect();Y.tx=w.clamp((e.clientX-t.left)/t.width*2-1,-1,1),Y.ty=w.clamp(-((e.clientY-t.top)/t.height*2-1),-.8,.8),$()},Ie=()=>{Y.tx=.18,Y.ty=.08,$()};i.addEventListener(`pointermove`,Fe,{passive:!0}),i.addEventListener(`pointerleave`,Ie,{passive:!0});let Le=new ResizeObserver(()=>{!j||L||!P||(Z(),$())});Le.observe(i);let Re=()=>{document.hidden||$()};document.addEventListener(`visibilitychange`,Re);let ze=()=>{if(L)return;L=!0,clearTimeout(G),cancelAnimationFrame(R),Le.disconnect(),i.removeEventListener(`pointermove`,Fe),i.removeEventListener(`pointerleave`,Ie),document.removeEventListener(`visibilitychange`,Re),i.style.removeProperty(`--photon-recess-width`),i.style.removeProperty(`--photon-recess-height`),i.style.removeProperty(`--photon-recess-offset`),i.style.removeProperty(`--photon-cut-inset`),i.style.removeProperty(`--photon-block-inset`),i.style.removeProperty(`--photon-alcove-light`),i.style.removeProperty(`--photon-outer-light`),i.classList.remove(`has-opened`,`is-motion-active`),X.remove();let e=W;W=null,e?.(),d.traverse(e=>{e.geometry?.dispose();let t=e=>{e.map?.dispose(),e.bumpMap?.dispose(),e.dispose?.()};Array.isArray(e.material)?e.material.forEach(t):e.material&&t(e.material)}),D.dispose(),g.dispose(),c.dispose(),M=!0};return E.reset(),i.dataset.photonState=B,{open:Ne,resetClosed:Pe,resize:Z,requestRender:$,setActive:je,prewarm:Ee,flushSuspend:Te,dispose:ze,get state(){return B},get progress(){return H},get surfaceSuspended(){return M}}}export{L as createPhotonEngine};