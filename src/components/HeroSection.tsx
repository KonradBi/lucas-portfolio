'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { gsap } from 'gsap';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Italiana, Montserrat } from 'next/font/google';

const italiana = Italiana({ 
  subsets: ['latin'],
  weight: ['400'],
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  weight: ['200', '300'],
});

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create layered fluid background
    const createFluidLayer = (depth: number, speed: number, scale: number) => {
      const geometry = new THREE.PlaneGeometry(5, 5, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          uDepth: { value: depth },
          uSpeed: { value: speed },
          uScale: { value: scale },
          uNoiseStrength: { value: 1.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float uTime;
          uniform float uDepth;
          uniform float uSpeed;
          uniform float uScale;
          uniform float uNoiseStrength;

          //	Classic Perlin 3D Noise by Stefan Gustavson
          vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
          vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
          vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

          float noise(vec3 P){
            vec3 Pi0 = floor(P);
            vec3 Pi1 = Pi0 + vec3(1.0);
            Pi0 = mod(Pi0, 289.0);
            Pi1 = mod(Pi1, 289.0);
            vec3 Pf0 = fract(P);
            vec3 Pf1 = Pf0 - vec3(1.0);
            vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
            vec4 iy = vec4(Pi0.yy, Pi1.yy);
            vec4 iz0 = Pi0.zzzz;
            vec4 iz1 = Pi1.zzzz;

            vec4 ixy = permute(permute(ix) + iy);
            vec4 ixy0 = permute(ixy + iz0);
            vec4 ixy1 = permute(ixy + iz1);

            vec4 gx0 = ixy0 / 7.0;
            vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
            gx0 = fract(gx0);
            vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
            vec4 sz0 = step(gz0, vec4(0.0));
            gx0 -= sz0 * (step(0.0, gx0) - 0.5);
            gy0 -= sz0 * (step(0.0, gy0) - 0.5);

            vec4 gx1 = ixy1 / 7.0;
            vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
            gx1 = fract(gx1);
            vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
            vec4 sz1 = step(gz1, vec4(0.0));
            gx1 -= sz1 * (step(0.0, gx1) - 0.5);
            gy1 -= sz1 * (step(0.0, gy1) - 0.5);

            vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
            vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
            vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
            vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
            vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
            vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
            vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
            vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

            vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
            g000 *= norm0.x;
            g010 *= norm0.y;
            g100 *= norm0.z;
            g110 *= norm0.w;
            vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
            g001 *= norm1.x;
            g011 *= norm1.y;
            g101 *= norm1.z;
            g111 *= norm1.w;

            float n000 = dot(g000, Pf0);
            float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
            float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
            float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
            float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
            float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
            float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
            float n111 = dot(g111, Pf1);

            vec3 fade_xyz = fade(Pf0);
            vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
            vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
            float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
            return 2.2 * n_xyz;
          }

          void main() {
            vUv = uv;
            vec3 pos = position;
            float noiseFreq = uScale;
            float noiseAmp = uNoiseStrength;
            vec3 noisePos = vec3(pos.x * noiseFreq + uTime * uSpeed, pos.y * noiseFreq + uTime * uSpeed, pos.z);
            pos.z += noise(noisePos) * noiseAmp;
            vElevation = pos.z;
            pos.z += uDepth;
            
            vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uDepth;
          varying vec2 vUv;
          varying float vElevation;

          void main() {
            float mixStrength = (vElevation + 0.5) * 0.5;
            
            // Darker color palette
            vec3 color1 = vec3(0.02, 0.02, 0.1);  // Very dark blue
            vec3 color2 = vec3(0.05, 0.05, 0.2);  // Dark blue
            vec3 color3 = vec3(0.1, 0.05, 0.3);   // Dark purple
            
            vec3 mixedColor = mix(
              mix(color1, color2, mixStrength),
              color3,
              smoothstep(-1.0, 1.0, sin(uTime * 0.2 + uDepth))
            );
            
            // Reduce opacity for better layering
            float alpha = smoothstep(0.0, 1.0, 0.6 - abs(vElevation));
            
            gl_FragColor = vec4(mixedColor, alpha * 0.5);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -Math.PI * 0.25;
      scene.add(mesh);
      return { mesh, material };
    };

    // Create multiple layers with different parameters
    const layers = [
      createFluidLayer(-4.0, 0.08, 0.4),   // Deeper, slower background
      createFluidLayer(-2.5, 0.12, 0.8),   // Middle layer
      createFluidLayer(-1.0, 0.15, 1.2),   // Front layer
    ];

    // Add post-processing with proper imports
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5,  // Strength
      0.4,  // Radius
      0.85  // Threshold
    );
    composer.addPass(bloomPass);

    camera.position.z = 5;

    // Mouse interaction
    const mouse = { x: 0.5, y: 0.5 };
    
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX / window.innerWidth;
      mouse.y = 1.0 - (event.clientY / window.innerHeight);

      layers.forEach(layer => {
        if (layer.material.uniforms) {
          layer.material.uniforms.uMouse.value.set(mouse.x, mouse.y);
        }
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      composer.setSize(width, height);

      layers.forEach(layer => {
        if (layer.material.uniforms) {
          layer.material.uniforms.uResolution.value.set(width, height);
        }
      });
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      layers.forEach((layer, index) => {
        if (layer.material.uniforms) {
          layer.material.uniforms.uTime.value = time;
          layer.mesh.rotation.z = Math.sin(time * 0.08 + index) * 0.02; // Slower rotation
        }
      });

      composer.render();
    };
    animate();

    // Content animations
    setIsLoaded(true);
    if (textRef.current) {
      gsap.fromTo(textRef.current.children,
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3
        }
      );
    }

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      composer.dispose();
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!textRef.current) return;
    
    // Initial state
    gsap.set(".name-first", { 
      opacity: 0,
      scale: 1.2,
      filter: 'blur(10px)'
    });
    
    gsap.set(".name-last", { 
      opacity: 0,
      rotationX: 180,
      transformOrigin: "50% 50% -50px",
      filter: 'blur(5px)'
    });

    gsap.set(".name-last-mirror", {
      opacity: 0.3,
      rotationX: 0,
      transformOrigin: "50% 50% -50px",
      filter: 'blur(3px)'
    });

    // Main animation timeline
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    tl.to(".name-first", {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 2,
      delay: 0.5
    })
    .to(".name-last", {
      opacity: 1,
      rotationX: 0,
      filter: 'blur(0px)',
      duration: 1.8
    }, "-=1.4")
    .to(".name-last-mirror", {
      opacity: 0,
      duration: 1
    }, "-=1.8");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollPosition / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToGallery = () => {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div 
          ref={textRef}
          className={`w-full max-w-[1600px] mx-auto px-8 transition-opacity duration-1000 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="text-center">
            <div className="mb-16 tracking-[0.5em] text-sm uppercase text-blue-300/80">
              Ethereal Artistry
            </div>
            
            <div className="name-container relative perspective-[2000px] transform-gpu mb-8">
              <div className="relative transform-gpu">
                <div className="absolute -inset-20 blur-3xl opacity-30 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-blue-500/20" />
                
                <div className="relative space-y-6">
                  <motion.div 
                    className="relative group cursor-default"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute -inset-10 blur-3xl opacity-20 bg-gradient-to-r from-blue-500/30 via-rose-300/20 to-purple-500/30 group-hover:opacity-30 transition-opacity duration-500" />
                    <h1 className="name-first text-[13rem] leading-none tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/90 relative z-10">
                      LUKAS
                    </h1>
                  </motion.div>
                  
                  <div className="relative h-[4rem]">
                    <motion.h2 
                      className="name-last absolute inset-0 text-4xl tracking-[1em] text-rose-100/90 font-light uppercase"
                      whileHover={{ letterSpacing: "1.2em" }}
                      transition={{ duration: 0.5 }}
                    >
                      Vandeverre
                    </motion.h2>
                    <motion.h2 
                      className="name-last-mirror absolute inset-0 text-4xl tracking-[1em] text-white/20 font-light uppercase transform scale-y-[-1] origin-top"
                      whileHover={{ letterSpacing: "1.2em" }}
                      transition={{ duration: 0.5 }}
                    >
                      Vandeverre
                    </motion.h2>
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rose-100/5 to-transparent animate-shimmer pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3 mb-24">
              <p className="text-lg tracking-wider text-blue-100/70">
                Where Imagination Becomes Reality
              </p>
              <p className="text-sm tracking-wide text-blue-200/50 max-w-lg mx-auto italic">
                "Art is not what you see, but what you make others see"
              </p>
            </div>
          </div>

          <div 
            className="absolute left-1/2 -translate-x-1/2 bottom-12 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-500"
            onClick={handleScrollToGallery}
          >
            <div className="flex flex-col items-center space-y-6">
              <div className="text-rose-100/60 text-sm tracking-[0.5em] uppercase hover:text-rose-100/80 transition-colors duration-300">
                View Collection
              </div>
              
              <div className="relative w-6 h-10 rounded-full border-2 border-rose-100/20 flex justify-center">
                <div className="w-1 h-2 bg-rose-100/50 rounded-full animate-scroll-bounce mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <motion.div 
        className="fixed top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/50 to-purple-500/50 z-50"
        style={{ 
          scaleX: scrollProgress,
          transformOrigin: "0%"
        }}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 8s linear infinite;
          width: 100%;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
} 