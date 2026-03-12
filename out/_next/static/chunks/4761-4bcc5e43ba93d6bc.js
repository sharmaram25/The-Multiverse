"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4761],{8401:(e,t,n)=>{let i,a;n.d(t,{l:()=>D});var o=n(88945),r=n(12115),s=n(85339),l=n(40264);let c=new s.NRn,u=new s.Pq0;class d extends s.CmU{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new s.qtW([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new s.qtW([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new s.LuO(t,6,1);return this.setAttribute("instanceStart",new s.eHs(n,3,0)),this.setAttribute("instanceEnd",new s.eHs(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let i=new s.LuO(n,2*t,1);return this.setAttribute("instanceColorStart",new s.eHs(i,t,0)),this.setAttribute("instanceColorEnd",new s.eHs(i,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new s.XJ7(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new s.NRn);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),c.setFromBufferAttribute(t),this.boundingBox.union(c))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new s.iyt),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let i=0;for(let a=0,o=e.count;a<o;a++)u.fromBufferAttribute(e,a),i=Math.max(i,n.distanceToSquared(u)),u.fromBufferAttribute(t,a),i=Math.max(i,n.distanceToSquared(u));this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}var f=n(87548);let m=parseInt(s.sPf.replace(/\D+/g,""));class p extends s.BKk{constructor(e){super({type:"LineMaterial",uniforms:s.LlO.clone(s.LlO.merge([f.UniformsLib.common,f.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new s.I9Y(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${m>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let h=m>=125?"uv1":"uv2",v=new s.IUQ,g=new s.Pq0,b=new s.Pq0,y=new s.IUQ,x=new s.IUQ,w=new s.IUQ,S=new s.Pq0,E=new s.kn4,A=new s.cZY,M=new s.Pq0,P=new s.NRn,L=new s.iyt,_=new s.IUQ;function O(e,t,n){return _.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),_.multiplyScalar(1/_.w),_.x=a/n.width,_.y=a/n.height,_.applyMatrix4(e.projectionMatrixInverse),_.multiplyScalar(1/_.w),Math.abs(Math.max(_.x,_.y))}class C extends s.eaF{constructor(e=new d,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,i=new Float32Array(2*t.count);for(let e=0,a=0,o=t.count;e<o;e++,a+=2)g.fromBufferAttribute(t,e),b.fromBufferAttribute(n,e),i[a]=0===a?0:i[a-1],i[a+1]=i[a]+g.distanceTo(b);let a=new s.LuO(i,2,1);return e.setAttribute("instanceDistanceStart",new s.eHs(a,1,0)),e.setAttribute("instanceDistanceEnd",new s.eHs(a,1,1)),this}raycast(e,t){let n,o,r=this.material.worldUnits,l=e.camera;null!==l||r||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let c=void 0!==e.params.Line2&&e.params.Line2.threshold||0;i=e.ray;let u=this.matrixWorld,d=this.geometry,f=this.material;if(a=f.linewidth+c,null===d.boundingSphere&&d.computeBoundingSphere(),L.copy(d.boundingSphere).applyMatrix4(u),r)n=.5*a;else{let e=Math.max(l.near,L.distanceToPoint(i.origin));n=O(l,e,f.resolution)}if(L.radius+=n,!1!==i.intersectsSphere(L)){if(null===d.boundingBox&&d.computeBoundingBox(),P.copy(d.boundingBox).applyMatrix4(u),r)o=.5*a;else{let e=Math.max(l.near,P.distanceToPoint(i.origin));o=O(l,e,f.resolution)}P.expandByScalar(o),!1!==i.intersectsBox(P)&&(r?function(e,t){let n=e.matrixWorld,o=e.geometry,r=o.attributes.instanceStart,l=o.attributes.instanceEnd,c=Math.min(o.instanceCount,r.count);for(let o=0;o<c;o++){A.start.fromBufferAttribute(r,o),A.end.fromBufferAttribute(l,o),A.applyMatrix4(n);let c=new s.Pq0,u=new s.Pq0;i.distanceSqToSegment(A.start,A.end,u,c),u.distanceTo(c)<.5*a&&t.push({point:u,pointOnLine:c,distance:i.origin.distanceTo(u),object:e,face:null,faceIndex:o,uv:null,[h]:null})}}(this,t):function(e,t,n){let o=t.projectionMatrix,r=e.material.resolution,l=e.matrixWorld,c=e.geometry,u=c.attributes.instanceStart,d=c.attributes.instanceEnd,f=Math.min(c.instanceCount,u.count),m=-t.near;i.at(1,w),w.w=1,w.applyMatrix4(t.matrixWorldInverse),w.applyMatrix4(o),w.multiplyScalar(1/w.w),w.x*=r.x/2,w.y*=r.y/2,w.z=0,S.copy(w),E.multiplyMatrices(t.matrixWorldInverse,l);for(let t=0;t<f;t++){if(y.fromBufferAttribute(u,t),x.fromBufferAttribute(d,t),y.w=1,x.w=1,y.applyMatrix4(E),x.applyMatrix4(E),y.z>m&&x.z>m)continue;if(y.z>m){let e=y.z-x.z,t=(y.z-m)/e;y.lerp(x,t)}else if(x.z>m){let e=x.z-y.z,t=(x.z-m)/e;x.lerp(y,t)}y.applyMatrix4(o),x.applyMatrix4(o),y.multiplyScalar(1/y.w),x.multiplyScalar(1/x.w),y.x*=r.x/2,y.y*=r.y/2,x.x*=r.x/2,x.y*=r.y/2,A.start.copy(y),A.start.z=0,A.end.copy(x),A.end.z=0;let c=A.closestPointToPointParameter(S,!0);A.at(c,M);let f=s.cj9.lerp(y.z,x.z,c),p=f>=-1&&f<=1,v=S.distanceTo(M)<.5*a;if(p&&v){A.start.fromBufferAttribute(u,t),A.end.fromBufferAttribute(d,t),A.start.applyMatrix4(l),A.end.applyMatrix4(l);let a=new s.Pq0,o=new s.Pq0;i.distanceSqToSegment(A.start,A.end,o,a),n.push({point:o,pointOnLine:a,distance:i.origin.distanceTo(o),object:e,face:null,faceIndex:t,uv:null,[h]:null})}}}(this,l,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(v),this.material.uniforms.resolution.value.set(v.z,v.w))}}class T extends d{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let i=0;i<t;i+=3)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,i=new Float32Array(2*n);if(3===t)for(let a=0;a<n;a+=t)i[2*a]=e[a],i[2*a+1]=e[a+1],i[2*a+2]=e[a+2],i[2*a+3]=e[a+3],i[2*a+4]=e[a+4],i[2*a+5]=e[a+5];else for(let a=0;a<n;a+=t)i[2*a]=e[a],i[2*a+1]=e[a+1],i[2*a+2]=e[a+2],i[2*a+3]=e[a+3],i[2*a+4]=e[a+4],i[2*a+5]=e[a+5],i[2*a+6]=e[a+6],i[2*a+7]=e[a+7];return super.setColors(i,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class z extends C{constructor(e=new T,t=new p({color:0xffffff*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let R=r.forwardRef(function({points:e,color:t=0xffffff,vertexColors:n,linewidth:i,lineWidth:a,segments:c,dashed:u,...f},m){var h,v;let g=(0,l.C)(e=>e.size),b=r.useMemo(()=>c?new C:new z,[c]),[y]=r.useState(()=>new p),x=(null==n||null==(h=n[0])?void 0:h.length)===4?4:3,w=r.useMemo(()=>{let i=c?new d:new T,a=e.map(e=>{let t=Array.isArray(e);return e instanceof s.Pq0||e instanceof s.IUQ?[e.x,e.y,e.z]:e instanceof s.I9Y?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(i.setPositions(a.flat()),n){t=0xffffff;let e=n.map(e=>e instanceof s.Q1f?e.toArray():e);i.setColors(e.flat(),x)}return i},[e,c,n,x]);return r.useLayoutEffect(()=>{b.computeLineDistances()},[e,b]),r.useLayoutEffect(()=>{u?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[u,y]),r.useEffect(()=>()=>{w.dispose(),y.dispose()},[w]),r.createElement("primitive",(0,o.A)({object:b,ref:m},f),r.createElement("primitive",{object:w,attach:"geometry"}),r.createElement("primitive",(0,o.A)({object:y,attach:"material",color:t,vertexColors:!!n,resolution:[g.width,g.height],linewidth:null!=(v=null!=i?i:a)?v:1,dashed:u,transparent:4===x},f)))}),D=r.forwardRef(({threshold:e=15,geometry:t,...n},i)=>{let a=r.useRef(null);r.useImperativeHandle(i,()=>a.current,[]);let l=r.useMemo(()=>[0,0,0,1,0,0],[]),c=r.useRef(null),u=r.useRef(null);return r.useLayoutEffect(()=>{let n=a.current.parent,i=null!=t?t:null==n?void 0:n.geometry;if(!i||c.current===i&&u.current===e)return;c.current=i,u.current=e;let o=new s.TDQ(i,e).attributes.position.array;a.current.geometry.setPositions(o),a.current.geometry.attributes.instanceStart.needsUpdate=!0,a.current.geometry.attributes.instanceEnd.needsUpdate=!0,a.current.computeLineDistances()}),r.createElement(R,(0,o.A)({segments:!0,points:l,ref:a,raycast:()=>null},n))})},16750:(e,t,n)=>{n.d(t,{N:()=>v});var i=n(88945),a=n(40264),o=n(12115),r=n(85339),s=Object.defineProperty;class l{constructor(){((e,t,n)=>((e,t,n)=>t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n)(e,"symbol"!=typeof t?t+"":t,void 0))(this,"_listeners")}addEventListener(e,t){void 0===this._listeners&&(this._listeners={});let n=this._listeners;void 0===n[e]&&(n[e]=[]),-1===n[e].indexOf(t)&&n[e].push(t)}hasEventListener(e,t){if(void 0===this._listeners)return!1;let n=this._listeners;return void 0!==n[e]&&-1!==n[e].indexOf(t)}removeEventListener(e,t){if(void 0===this._listeners)return;let n=this._listeners[e];if(void 0!==n){let e=n.indexOf(t);-1!==e&&n.splice(e,1)}}dispatchEvent(e){if(void 0===this._listeners)return;let t=this._listeners[e.type];if(void 0!==t){e.target=this;let n=t.slice(0);for(let t=0,i=n.length;t<i;t++)n[t].call(this,e);e.target=null}}}var c=Object.defineProperty,u=(e,t,n)=>(((e,t,n)=>t in e?c(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n)(e,"symbol"!=typeof t?t+"":t,n),n);let d=new r.RlV,f=new r.Zcv,m=Math.cos(Math.PI/180*70),p=(e,t)=>(e%t+t)%t;class h extends l{constructor(e,t){super(),u(this,"object"),u(this,"domElement"),u(this,"enabled",!0),u(this,"target",new r.Pq0),u(this,"minDistance",0),u(this,"maxDistance",1/0),u(this,"minZoom",0),u(this,"maxZoom",1/0),u(this,"minPolarAngle",0),u(this,"maxPolarAngle",Math.PI),u(this,"minAzimuthAngle",-1/0),u(this,"maxAzimuthAngle",1/0),u(this,"enableDamping",!1),u(this,"dampingFactor",.05),u(this,"enableZoom",!0),u(this,"zoomSpeed",1),u(this,"enableRotate",!0),u(this,"rotateSpeed",1),u(this,"enablePan",!0),u(this,"panSpeed",1),u(this,"screenSpacePanning",!0),u(this,"keyPanSpeed",7),u(this,"zoomToCursor",!1),u(this,"autoRotate",!1),u(this,"autoRotateSpeed",2),u(this,"reverseOrbit",!1),u(this,"reverseHorizontalOrbit",!1),u(this,"reverseVerticalOrbit",!1),u(this,"keys",{LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"}),u(this,"mouseButtons",{LEFT:r.kBv.ROTATE,MIDDLE:r.kBv.DOLLY,RIGHT:r.kBv.PAN}),u(this,"touches",{ONE:r.wtR.ROTATE,TWO:r.wtR.DOLLY_PAN}),u(this,"target0"),u(this,"position0"),u(this,"zoom0"),u(this,"_domElementKeyEvents",null),u(this,"getPolarAngle"),u(this,"getAzimuthalAngle"),u(this,"setPolarAngle"),u(this,"setAzimuthalAngle"),u(this,"getDistance"),u(this,"getZoomScale"),u(this,"listenToKeyEvents"),u(this,"stopListenToKeyEvents"),u(this,"saveState"),u(this,"reset"),u(this,"update"),u(this,"connect"),u(this,"dispose"),u(this,"dollyIn"),u(this,"dollyOut"),u(this,"getScale"),u(this,"setScale"),this.object=e,this.domElement=t,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>h.phi,this.getAzimuthalAngle=()=>h.theta,this.setPolarAngle=e=>{let t=p(e,2*Math.PI),i=h.phi;i<0&&(i+=2*Math.PI),t<0&&(t+=2*Math.PI);let a=Math.abs(t-i);2*Math.PI-a<a&&(t<i?t+=2*Math.PI:i+=2*Math.PI),v.phi=t-i,n.update()},this.setAzimuthalAngle=e=>{let t=p(e,2*Math.PI),i=h.theta;i<0&&(i+=2*Math.PI),t<0&&(t+=2*Math.PI);let a=Math.abs(t-i);2*Math.PI-a<a&&(t<i?t+=2*Math.PI:i+=2*Math.PI),v.theta=t-i,n.update()},this.getDistance=()=>n.object.position.distanceTo(n.target),this.listenToKeyEvents=e=>{e.addEventListener("keydown",ee),this._domElementKeyEvents=e},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener("keydown",ee),this._domElementKeyEvents=null},this.saveState=()=>{n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=()=>{n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(i),n.update(),l=s.NONE},this.update=(()=>{let t=new r.Pq0,a=new r.Pq0(0,1,0),o=new r.PTz().setFromUnitVectors(e.up,a),u=o.clone().invert(),p=new r.Pq0,y=new r.PTz,x=2*Math.PI;return function(){let w=n.object.position;o.setFromUnitVectors(e.up,a),u.copy(o).invert(),t.copy(w).sub(n.target),t.applyQuaternion(o),h.setFromVector3(t),n.autoRotate&&l===s.NONE&&D(2*Math.PI/60/60*n.autoRotateSpeed),n.enableDamping?(h.theta+=v.theta*n.dampingFactor,h.phi+=v.phi*n.dampingFactor):(h.theta+=v.theta,h.phi+=v.phi);let S=n.minAzimuthAngle,E=n.maxAzimuthAngle;isFinite(S)&&isFinite(E)&&(S<-Math.PI?S+=x:S>Math.PI&&(S-=x),E<-Math.PI?E+=x:E>Math.PI&&(E-=x),S<=E?h.theta=Math.max(S,Math.min(E,h.theta)):h.theta=h.theta>(S+E)/2?Math.max(S,h.theta):Math.min(E,h.theta)),h.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,h.phi)),h.makeSafe(),!0===n.enableDamping?n.target.addScaledVector(b,n.dampingFactor):n.target.add(b),n.zoomToCursor&&C||n.object.isOrthographicCamera?h.radius=F(h.radius):h.radius=F(h.radius*g),t.setFromSpherical(h),t.applyQuaternion(u),w.copy(n.target).add(t),n.object.matrixAutoUpdate||n.object.updateMatrix(),n.object.lookAt(n.target),!0===n.enableDamping?(v.theta*=1-n.dampingFactor,v.phi*=1-n.dampingFactor,b.multiplyScalar(1-n.dampingFactor)):(v.set(0,0,0),b.set(0,0,0));let A=!1;if(n.zoomToCursor&&C){let i=null;if(n.object instanceof r.ubm&&n.object.isPerspectiveCamera){let e=t.length();i=F(e*g);let a=e-i;n.object.position.addScaledVector(_,a),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let e=new r.Pq0(O.x,O.y,0);e.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/g)),n.object.updateProjectionMatrix(),A=!0;let a=new r.Pq0(O.x,O.y,0);a.unproject(n.object),n.object.position.sub(a).add(e),n.object.updateMatrixWorld(),i=t.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;null!==i&&(n.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(i).add(n.object.position):(d.origin.copy(n.object.position),d.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(d.direction))<m?e.lookAt(n.target):(f.setFromNormalAndCoplanarPoint(n.object.up,n.target),d.intersectPlane(f,n.target))))}else n.object instanceof r.qUd&&n.object.isOrthographicCamera&&(A=1!==g)&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/g)),n.object.updateProjectionMatrix());return g=1,C=!1,!!(A||p.distanceToSquared(n.object.position)>c||8*(1-y.dot(n.object.quaternion))>c)&&(n.dispatchEvent(i),p.copy(n.object.position),y.copy(n.object.quaternion),A=!1,!0)}})(),this.connect=e=>{n.domElement=e,n.domElement.style.touchAction="none",n.domElement.addEventListener("contextmenu",et),n.domElement.addEventListener("pointerdown",K),n.domElement.addEventListener("pointercancel",$),n.domElement.addEventListener("wheel",J)},this.dispose=()=>{var e,t,i,a,o,r;n.domElement&&(n.domElement.style.touchAction="auto"),null==(e=n.domElement)||e.removeEventListener("contextmenu",et),null==(t=n.domElement)||t.removeEventListener("pointerdown",K),null==(i=n.domElement)||i.removeEventListener("pointercancel",$),null==(a=n.domElement)||a.removeEventListener("wheel",J),null==(o=n.domElement)||o.ownerDocument.removeEventListener("pointermove",Q),null==(r=n.domElement)||r.ownerDocument.removeEventListener("pointerup",$),null!==n._domElementKeyEvents&&n._domElementKeyEvents.removeEventListener("keydown",ee)};let n=this,i={type:"change"},a={type:"start"},o={type:"end"},s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},l=s.NONE,c=1e-6,h=new r.YHV,v=new r.YHV,g=1,b=new r.Pq0,y=new r.I9Y,x=new r.I9Y,w=new r.I9Y,S=new r.I9Y,E=new r.I9Y,A=new r.I9Y,M=new r.I9Y,P=new r.I9Y,L=new r.I9Y,_=new r.Pq0,O=new r.I9Y,C=!1,T=[],z={};function R(){return Math.pow(.95,n.zoomSpeed)}function D(e){n.reverseOrbit||n.reverseHorizontalOrbit?v.theta+=e:v.theta-=e}function j(e){n.reverseOrbit||n.reverseVerticalOrbit?v.phi+=e:v.phi-=e}let I=(()=>{let e=new r.Pq0;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),b.add(e)}})(),U=(()=>{let e=new r.Pq0;return function(t,i){!0===n.screenSpacePanning?e.setFromMatrixColumn(i,1):(e.setFromMatrixColumn(i,0),e.crossVectors(n.object.up,e)),e.multiplyScalar(t),b.add(e)}})(),N=(()=>{let e=new r.Pq0;return function(t,i){let a=n.domElement;if(a&&n.object instanceof r.ubm&&n.object.isPerspectiveCamera){let o=n.object.position;e.copy(o).sub(n.target);let r=e.length();I(2*t*(r*=Math.tan(n.object.fov/2*Math.PI/180))/a.clientHeight,n.object.matrix),U(2*i*r/a.clientHeight,n.object.matrix)}else a&&n.object instanceof r.qUd&&n.object.isOrthographicCamera?(I(t*(n.object.right-n.object.left)/n.object.zoom/a.clientWidth,n.object.matrix),U(i*(n.object.top-n.object.bottom)/n.object.zoom/a.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function k(e){n.object instanceof r.ubm&&n.object.isPerspectiveCamera||n.object instanceof r.qUd&&n.object.isOrthographicCamera?g=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function B(e){if(!n.zoomToCursor||!n.domElement)return;C=!0;let t=n.domElement.getBoundingClientRect(),i=e.clientX-t.left,a=e.clientY-t.top,o=t.width,r=t.height;O.x=i/o*2-1,O.y=-(a/r*2)+1,_.set(O.x,O.y,1).unproject(n.object).sub(n.object.position).normalize()}function F(e){return Math.max(n.minDistance,Math.min(n.maxDistance,e))}function H(e){y.set(e.clientX,e.clientY)}function Y(e){S.set(e.clientX,e.clientY)}function V(){if(1==T.length)y.set(T[0].pageX,T[0].pageY);else{let e=.5*(T[0].pageX+T[1].pageX),t=.5*(T[0].pageY+T[1].pageY);y.set(e,t)}}function q(){if(1==T.length)S.set(T[0].pageX,T[0].pageY);else{let e=.5*(T[0].pageX+T[1].pageX),t=.5*(T[0].pageY+T[1].pageY);S.set(e,t)}}function G(){let e=T[0].pageX-T[1].pageX,t=T[0].pageY-T[1].pageY,n=Math.sqrt(e*e+t*t);M.set(0,n)}function W(e){if(1==T.length)x.set(e.pageX,e.pageY);else{let t=ei(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);x.set(n,i)}w.subVectors(x,y).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(D(2*Math.PI*w.x/t.clientHeight),j(2*Math.PI*w.y/t.clientHeight)),y.copy(x)}function X(e){if(1==T.length)E.set(e.pageX,e.pageY);else{let t=ei(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);E.set(n,i)}A.subVectors(E,S).multiplyScalar(n.panSpeed),N(A.x,A.y),S.copy(E)}function Z(e){var t;let i=ei(e),a=e.pageX-i.x,o=e.pageY-i.y,r=Math.sqrt(a*a+o*o);P.set(0,r),L.set(0,Math.pow(P.y/M.y,n.zoomSpeed)),t=L.y,k(g/t),M.copy(P)}function K(e){var t,i,o;!1!==n.enabled&&(0===T.length&&(null==(t=n.domElement)||t.ownerDocument.addEventListener("pointermove",Q),null==(i=n.domElement)||i.ownerDocument.addEventListener("pointerup",$)),o=e,T.push(o),"touch"===e.pointerType?function(e){switch(en(e),T.length){case 1:switch(n.touches.ONE){case r.wtR.ROTATE:if(!1===n.enableRotate)return;V(),l=s.TOUCH_ROTATE;break;case r.wtR.PAN:if(!1===n.enablePan)return;q(),l=s.TOUCH_PAN;break;default:l=s.NONE}break;case 2:switch(n.touches.TWO){case r.wtR.DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&G(),n.enablePan&&q(),l=s.TOUCH_DOLLY_PAN;break;case r.wtR.DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&G(),n.enableRotate&&V(),l=s.TOUCH_DOLLY_ROTATE;break;default:l=s.NONE}break;default:l=s.NONE}l!==s.NONE&&n.dispatchEvent(a)}(e):function(e){let t;switch(e.button){case 0:t=n.mouseButtons.LEFT;break;case 1:t=n.mouseButtons.MIDDLE;break;case 2:t=n.mouseButtons.RIGHT;break;default:t=-1}switch(t){case r.kBv.DOLLY:if(!1===n.enableZoom)return;B(e),M.set(e.clientX,e.clientY),l=s.DOLLY;break;case r.kBv.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enablePan)return;Y(e),l=s.PAN}else{if(!1===n.enableRotate)return;H(e),l=s.ROTATE}break;case r.kBv.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(!1===n.enableRotate)return;H(e),l=s.ROTATE}else{if(!1===n.enablePan)return;Y(e),l=s.PAN}break;default:l=s.NONE}l!==s.NONE&&n.dispatchEvent(a)}(e))}function Q(e){!1!==n.enabled&&("touch"===e.pointerType?function(e){switch(en(e),l){case s.TOUCH_ROTATE:if(!1===n.enableRotate)return;W(e),n.update();break;case s.TOUCH_PAN:if(!1===n.enablePan)return;X(e),n.update();break;case s.TOUCH_DOLLY_PAN:if(!1===n.enableZoom&&!1===n.enablePan)return;n.enableZoom&&Z(e),n.enablePan&&X(e),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(!1===n.enableZoom&&!1===n.enableRotate)return;n.enableZoom&&Z(e),n.enableRotate&&W(e),n.update();break;default:l=s.NONE}}(e):function(e){if(!1!==n.enabled)switch(l){case s.ROTATE:if(!1===n.enableRotate)return;x.set(e.clientX,e.clientY),w.subVectors(x,y).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(D(2*Math.PI*w.x/t.clientHeight),j(2*Math.PI*w.y/t.clientHeight)),y.copy(x),n.update();break;case s.DOLLY:var i,a;if(!1===n.enableZoom)return;(P.set(e.clientX,e.clientY),L.subVectors(P,M),L.y>0)?(i=R(),k(g/i)):L.y<0&&(a=R(),k(g*a)),M.copy(P),n.update();break;case s.PAN:if(!1===n.enablePan)return;E.set(e.clientX,e.clientY),A.subVectors(E,S).multiplyScalar(n.panSpeed),N(A.x,A.y),S.copy(E),n.update()}}(e))}function $(e){var t,i,a;(function(e){delete z[e.pointerId];for(let t=0;t<T.length;t++)if(T[t].pointerId==e.pointerId)return void T.splice(t,1)})(e),0===T.length&&(null==(t=n.domElement)||t.releasePointerCapture(e.pointerId),null==(i=n.domElement)||i.ownerDocument.removeEventListener("pointermove",Q),null==(a=n.domElement)||a.ownerDocument.removeEventListener("pointerup",$)),n.dispatchEvent(o),l=s.NONE}function J(e){if(!1!==n.enabled&&!1!==n.enableZoom&&(l===s.NONE||l===s.ROTATE)){var t,i;e.preventDefault(),n.dispatchEvent(a),(B(e),e.deltaY<0)?(t=R(),k(g*t)):e.deltaY>0&&(i=R(),k(g/i)),n.update(),n.dispatchEvent(o)}}function ee(e){if(!1!==n.enabled&&!1!==n.enablePan){let t=!1;switch(e.code){case n.keys.UP:N(0,n.keyPanSpeed),t=!0;break;case n.keys.BOTTOM:N(0,-n.keyPanSpeed),t=!0;break;case n.keys.LEFT:N(n.keyPanSpeed,0),t=!0;break;case n.keys.RIGHT:N(-n.keyPanSpeed,0),t=!0}t&&(e.preventDefault(),n.update())}}function et(e){!1!==n.enabled&&e.preventDefault()}function en(e){let t=z[e.pointerId];void 0===t&&(t=new r.I9Y,z[e.pointerId]=t),t.set(e.pageX,e.pageY)}function ei(e){return z[(e.pointerId===T[0].pointerId?T[1]:T[0]).pointerId]}this.dollyIn=(e=R())=>{k(g*e),n.update()},this.dollyOut=(e=R())=>{k(g/e),n.update()},this.getScale=()=>g,this.setScale=e=>{k(e),n.update()},this.getZoomScale=()=>R(),void 0!==t&&this.connect(t),this.update()}}let v=o.forwardRef(({makeDefault:e,camera:t,regress:n,domElement:r,enableDamping:s=!0,keyEvents:l=!1,onChange:c,onStart:u,onEnd:d,...f},m)=>{let p=(0,a.C)(e=>e.invalidate),v=(0,a.C)(e=>e.camera),g=(0,a.C)(e=>e.gl),b=(0,a.C)(e=>e.events),y=(0,a.C)(e=>e.setEvents),x=(0,a.C)(e=>e.set),w=(0,a.C)(e=>e.get),S=(0,a.C)(e=>e.performance),E=t||v,A=r||b.connected||g.domElement,M=o.useMemo(()=>new h(E),[E]);return(0,a.D)(()=>{M.enabled&&M.update()},-1),o.useEffect(()=>(l&&M.connect(!0===l?A:l),M.connect(A),()=>void M.dispose()),[l,A,n,M,p]),o.useEffect(()=>{let e=e=>{p(),n&&S.regress(),c&&c(e)},t=e=>{u&&u(e)},i=e=>{d&&d(e)};return M.addEventListener("change",e),M.addEventListener("start",t),M.addEventListener("end",i),()=>{M.removeEventListener("start",t),M.removeEventListener("end",i),M.removeEventListener("change",e)}},[c,u,d,M,p,y]),o.useEffect(()=>{if(e){let e=w().controls;return x({controls:M}),()=>x({controls:e})}},[e,M]),o.createElement("primitive",(0,i.A)({ref:m,object:M,enableDamping:s},f))})},20063:(e,t,n)=>{var i=n(47260);n.o(i,"usePathname")&&n.d(t,{usePathname:function(){return i.usePathname}}),n.o(i,"useRouter")&&n.d(t,{useRouter:function(){return i.useRouter}})},21046:(e,t,n)=>{n.d(t,{n:()=>r});var i=n(12115),a=n(40264),o=n(85339);let r=i.forwardRef(({children:e,enabled:t=!0,speed:n=1,rotationIntensity:r=1,floatIntensity:s=1,floatingRange:l=[-.1,.1],autoInvalidate:c=!1,...u},d)=>{let f=i.useRef(null);i.useImperativeHandle(d,()=>f.current,[]);let m=i.useRef(1e4*Math.random());return(0,a.D)(e=>{var i,a;if(!t||0===n)return;c&&e.invalidate();let u=m.current+e.clock.elapsedTime;f.current.rotation.x=Math.cos(u/4*n)/8*r,f.current.rotation.y=Math.sin(u/4*n)/8*r,f.current.rotation.z=Math.sin(u/4*n)/20*r;let d=Math.sin(u/4*n)/10;d=o.cj9.mapLinear(d,-.1,.1,null!=(i=null==l?void 0:l[0])?i:-.1,null!=(a=null==l?void 0:l[1])?a:.1),f.current.position.y=d*s,f.current.updateMatrix()}),i.createElement("group",u,i.createElement("group",{ref:f,matrixAutoUpdate:!1},e))})},69625:(e,t,n)=>{n.d(t,{A:()=>c});var i=n(12115),a=n(40264),o=n(85339),r=n(8587);class s extends o.BKk{constructor(){super({uniforms:{time:{value:0},fade:{value:1}},vertexShader:`
      uniform float time;
      attribute float size;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
        gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(time + 100.0));
        gl_Position = projectionMatrix * mvPosition;
      }`,fragmentShader:`
      uniform sampler2D pointTexture;
      uniform float fade;
      varying vec3 vColor;
      void main() {
        float opacity = 1.0;
        if (fade == 1.0) {
          float d = distance(gl_PointCoord, vec2(0.5, 0.5));
          opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));
        }
        gl_FragColor = vec4(vColor, opacity);

        #include <tonemapping_fragment>
	      #include <${r.r>=154?"colorspace_fragment":"encodings_fragment"}>
      }`})}}let l=e=>new o.Pq0().setFromSpherical(new o.YHV(e,Math.acos(1-2*Math.random()),2*Math.random()*Math.PI)),c=i.forwardRef(({radius:e=100,depth:t=50,count:n=5e3,saturation:r=0,factor:c=4,fade:u=!1,speed:d=1},f)=>{let m=i.useRef(null),[p,h,v]=i.useMemo(()=>{let i=[],a=[],s=Array.from({length:n},()=>(.5+.5*Math.random())*c),u=new o.Q1f,d=e+t,f=t/n;for(let e=0;e<n;e++)d-=f*Math.random(),i.push(...l(d).toArray()),u.setHSL(e/n,r,.9),a.push(u.r,u.g,u.b);return[new Float32Array(i),new Float32Array(a),new Float32Array(s)]},[n,t,c,e,r]);(0,a.D)(e=>m.current&&(m.current.uniforms.time.value=e.clock.elapsedTime*d));let[g]=i.useState(()=>new s);return i.createElement("points",{ref:f},i.createElement("bufferGeometry",null,i.createElement("bufferAttribute",{attach:"attributes-position",args:[p,3]}),i.createElement("bufferAttribute",{attach:"attributes-color",args:[h,3]}),i.createElement("bufferAttribute",{attach:"attributes-size",args:[v,1]})),i.createElement("primitive",{ref:m,object:g,attach:"material",blending:o.EZo,"uniforms-fade-value":u,depthWrite:!1,transparent:!0,vertexColors:!0}))})},80988:(e,t,n)=>{n.d(t,{$:()=>u});var i=n(88945),a=n(85339),o=n(12115),r=n(40264);function s(e,t,n){let i=(0,r.C)(e=>e.size),s=(0,r.C)(e=>e.viewport),l="number"==typeof e?e:i.width*s.dpr,c="number"==typeof t?t:i.height*s.dpr,u=("number"==typeof e?n:e)||{},{samples:d=0,depth:f,...m}=u,p=null!=f?f:u.depthBuffer,h=o.useMemo(()=>{let e=new a.nWS(l,c,{minFilter:a.k6q,magFilter:a.k6q,type:a.ix0,...m});return p&&(e.depthTexture=new a.VCu(l,c,a.RQf)),e.samples=d,e},[]);return o.useLayoutEffect(()=>{h.setSize(l,c),d&&(h.samples=d)},[d,h,l,c]),o.useEffect(()=>()=>h.dispose(),[]),h}let l=function(e,t,n,i){var o;return(o=class extends a.BKk{constructor(i){for(let o in super({vertexShader:t,fragmentShader:n,...i}),e)this.uniforms[o]=new a.nc$(e[o]),Object.defineProperty(this,o,{get(){return this.uniforms[o].value},set(e){this.uniforms[o].value=e}});this.uniforms=a.LlO.clone(this.uniforms)}}).key=a.cj9.generateUUID(),o}({},"void main() { }","void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard;  }");class c extends a.uSd{constructor(e=6,t=!1){super(),this.uniforms={chromaticAberration:{value:.05},transmission:{value:0},_transmission:{value:1},transmissionMap:{value:null},roughness:{value:0},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:1/0},attenuationColor:{value:new a.Q1f("white")},anisotropicBlur:{value:.1},time:{value:0},distortion:{value:0},distortionScale:{value:.5},temporalDistortion:{value:0},buffer:{value:null}},this.onBeforeCompile=n=>{n.uniforms={...n.uniforms,...this.uniforms},this.anisotropy>0&&(n.defines.USE_ANISOTROPY=""),t?n.defines.USE_SAMPLER="":n.defines.USE_TRANSMISSION="",n.fragmentShader=`
      uniform float chromaticAberration;         
      uniform float anisotropicBlur;      
      uniform float time;
      uniform float distortion;
      uniform float distortionScale;
      uniform float temporalDistortion;
      uniform sampler2D buffer;

      vec3 random3(vec3 c) {
        float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
        vec3 r;
        r.z = fract(512.0*j);
        j *= .125;
        r.x = fract(512.0*j);
        j *= .125;
        r.y = fract(512.0*j);
        return r-0.5;
      }

      uint hash( uint x ) {
        x += ( x << 10u );
        x ^= ( x >>  6u );
        x += ( x <<  3u );
        x ^= ( x >> 11u );
        x += ( x << 15u );
        return x;
      }

      // Compound versions of the hashing algorithm I whipped together.
      uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
      uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
      uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }

      // Construct a float with half-open range [0:1] using low 23 bits.
      // All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
      float floatConstruct( uint m ) {
        const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
        const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32
        m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
        m |= ieeeOne;                          // Add fractional part to 1.0
        float  f = uintBitsToFloat( m );       // Range [1:2]
        return f - 1.0;                        // Range [0:1]
      }

      // Pseudo-random value in half-open range [0:1].
      float randomBase( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
      float randomBase( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float rand(float seed) {
        float result = randomBase(vec3(gl_FragCoord.xy, seed));
        return result;
      }

      const float F3 =  0.3333333;
      const float G3 =  0.1666667;

      float snoise(vec3 p) {
        vec3 s = floor(p + dot(p, vec3(F3)));
        vec3 x = p - s + dot(s, vec3(G3));
        vec3 e = step(vec3(0.0), x - x.yzx);
        vec3 i1 = e*(1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy*(1.0 - e);
        vec3 x1 = x - i1 + G3;
        vec3 x2 = x - i2 + 2.0*G3;
        vec3 x3 = x - 1.0 + 3.0*G3;
        vec4 w, d;
        w.x = dot(x, x);
        w.y = dot(x1, x1);
        w.z = dot(x2, x2);
        w.w = dot(x3, x3);
        w = max(0.6 - w, 0.0);
        d.x = dot(random3(s), x);
        d.y = dot(random3(s + i1), x1);
        d.z = dot(random3(s + i2), x2);
        d.w = dot(random3(s + 1.0), x3);
        w *= w;
        w *= w;
        d *= w;
        return dot(d, vec4(52.0));
      }

      float snoiseFractal(vec3 m) {
        return 0.5333333* snoise(m)
              +0.2666667* snoise(2.0*m)
              +0.1333333* snoise(4.0*m)
              +0.0666667* snoise(8.0*m);
      }
`+n.fragmentShader,n.fragmentShader=n.fragmentShader.replace("#include <transmission_pars_fragment>",`
        #ifdef USE_TRANSMISSION
          // Transmission code is based on glTF-Sampler-Viewer
          // https://github.com/KhronosGroup/glTF-Sample-Viewer
          uniform float _transmission;
          uniform float thickness;
          uniform float attenuationDistance;
          uniform vec3 attenuationColor;
          #ifdef USE_TRANSMISSIONMAP
            uniform sampler2D transmissionMap;
          #endif
          #ifdef USE_THICKNESSMAP
            uniform sampler2D thicknessMap;
          #endif
          uniform vec2 transmissionSamplerSize;
          uniform sampler2D transmissionSamplerMap;
          uniform mat4 modelMatrix;
          uniform mat4 projectionMatrix;
          varying vec3 vWorldPosition;
          vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
            // Direction of refracted light.
            vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
            // Compute rotation-independant scaling of the model matrix.
            vec3 modelScale;
            modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
            modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
            modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
            // The thickness is specified in local space.
            return normalize( refractionVector ) * thickness * modelScale;
          }
          float applyIorToRoughness( const in float roughness, const in float ior ) {
            // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
            // an IOR of 1.5 results in the default amount of microfacet refraction.
            return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
          }
          vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
            float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );            
            #ifdef USE_SAMPLER
              #ifdef texture2DLodEXT
                return texture2DLodEXT(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #else
                return texture2D(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #endif
            #else
              return texture2D(buffer, fragCoord.xy);
            #endif
          }
          vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
            if ( isinf( attenuationDistance ) ) {
              // Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.
              return radiance;
            } else {
              // Compute light attenuation using Beer's law.
              vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
              vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
              return transmittance * radiance;
            }
          }
          vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
            const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
            const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
            const in vec3 attenuationColor, const in float attenuationDistance ) {
            vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
            vec3 refractedRayExit = position + transmissionRay;
            // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
            vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
            vec2 refractionCoords = ndcPos.xy / ndcPos.w;
            refractionCoords += 1.0;
            refractionCoords /= 2.0;
            // Sample framebuffer to get pixel the refracted ray hits.
            vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
            vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
            // Get the specular component.
            vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
            return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
          }
        #endif
`),n.fragmentShader=n.fragmentShader.replace("#include <transmission_fragment>",`  
        // Improve the refraction to use the world pos
        material.transmission = _transmission;
        material.transmissionAlpha = 1.0;
        material.thickness = thickness;
        material.attenuationDistance = attenuationDistance;
        material.attenuationColor = attenuationColor;
        #ifdef USE_TRANSMISSIONMAP
          material.transmission *= texture2D( transmissionMap, vUv ).r;
        #endif
        #ifdef USE_THICKNESSMAP
          material.thickness *= texture2D( thicknessMap, vUv ).g;
        #endif
        
        vec3 pos = vWorldPosition;
        float runningSeed = 0.0;
        vec3 v = normalize( cameraPosition - pos );
        vec3 n = inverseTransformDirection( normal, viewMatrix );
        vec3 transmission = vec3(0.0);
        float transmissionR, transmissionB, transmissionG;
        float randomCoords = rand(runningSeed++);
        float thickness_smear = thickness * max(pow(roughnessFactor, 0.33), anisotropicBlur);
        vec3 distortionNormal = vec3(0.0);
        vec3 temporalOffset = vec3(time, -time, -time) * temporalDistortion;
        if (distortion > 0.0) {
          distortionNormal = distortion * vec3(snoiseFractal(vec3((pos * distortionScale + temporalOffset))), snoiseFractal(vec3(pos.zxy * distortionScale - temporalOffset)), snoiseFractal(vec3(pos.yxz * distortionScale + temporalOffset)));
        }
        for (float i = 0.0; i < ${e}.0; i ++) {
          vec3 sampleNorm = normalize(n + roughnessFactor * roughnessFactor * 2.0 * normalize(vec3(rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5)) * pow(rand(runningSeed++), 0.33) + distortionNormal);
          transmissionR = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness  + thickness_smear * (i + randomCoords) / float(${e}),
            material.attenuationColor, material.attenuationDistance
          ).r;
          transmissionG = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior  * (1.0 + chromaticAberration * (i + randomCoords) / float(${e})) , material.thickness + thickness_smear * (i + randomCoords) / float(${e}),
            material.attenuationColor, material.attenuationDistance
          ).g;
          transmissionB = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior * (1.0 + 2.0 * chromaticAberration * (i + randomCoords) / float(${e})), material.thickness + thickness_smear * (i + randomCoords) / float(${e}),
            material.attenuationColor, material.attenuationDistance
          ).b;
          transmission.r += transmissionR;
          transmission.g += transmissionG;
          transmission.b += transmissionB;
        }
        transmission /= ${e}.0;
        totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );
`)},Object.keys(this.uniforms).forEach(e=>Object.defineProperty(this,e,{get:()=>this.uniforms[e].value,set:t=>this.uniforms[e].value=t}))}}let u=o.forwardRef(({buffer:e,transmissionSampler:t=!1,backside:n=!1,side:u=a.hB5,transmission:d=1,thickness:f=0,backsideThickness:m=0,backsideEnvMapIntensity:p=1,samples:h=10,resolution:v,backsideResolution:g,background:b,anisotropy:y,anisotropicBlur:x,...w},S)=>{let E,A,M,P;(0,r.e)({MeshTransmissionMaterial:c});let L=o.useRef(null),[_]=o.useState(()=>new l),O=s(g||v),C=s(v);return(0,r.D)(e=>{if(L.current.time=e.clock.elapsedTime,L.current.buffer===C.texture&&!t){var i;(P=null==(i=L.current.__r3f.parent)?void 0:i.object)&&(M=e.gl.toneMapping,E=e.scene.background,A=L.current.envMapIntensity,e.gl.toneMapping=a.y_p,b&&(e.scene.background=b),P.material=_,n&&(e.gl.setRenderTarget(O),e.gl.render(e.scene,e.camera),P.material=L.current,P.material.buffer=O.texture,P.material.thickness=m,P.material.side=a.hsX,P.material.envMapIntensity=p),e.gl.setRenderTarget(C),e.gl.render(e.scene,e.camera),P.material=L.current,P.material.thickness=f,P.material.side=u,P.material.buffer=C.texture,P.material.envMapIntensity=A,e.scene.background=E,e.gl.setRenderTarget(null),e.gl.toneMapping=M)}}),o.useImperativeHandle(S,()=>L.current,[]),o.createElement("meshTransmissionMaterial",(0,i.A)({args:[h,t],ref:L},w,{buffer:e||C.texture,_transmission:d,anisotropicBlur:null!=x?x:y,transmission:t?d:0,thickness:f,side:u}))})}}]);