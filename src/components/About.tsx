'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import Image from 'next/image';
import AnimatedHeader from './AnimatedHeader';

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create particle system
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.1 + 0.6, 0.8, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Animated movement
          float wave = sin(uTime * 0.5 + position.x + position.y + position.z) * 0.1;
          mvPosition.xyz += wave;
          
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * 5.0 * uPixelRatio * (1.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = length(gl_PointCoord - vec2(0.5));
          float alpha = 0.05 / (distanceToCenter);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 5;

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      material.uniforms.uTime.value = time;
      particles.rotation.y = time * 0.1;
      particles.rotation.x = Math.sin(time * 0.05) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };
    window.addEventListener('resize', handleResize);

    // Intersection Observer for fade-in
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  const timelineItems = [
    { year: '2018', text: 'First conceptual works emerge in European art scene' },
    { year: '2019', text: 'Private exhibition, Manhattan' },
    { year: '2020', text: 'Development of signature aesthetic approach' },
    { year: '2020', text: 'Selected for prestigious artist residency' },
    { year: '2021', text: 'International gallery representation secured' },
    { year: '2021', text: 'Featured in contemporary art publications' },
    { year: '2022', text: 'Collaboration with renowned art institutions' },
    { year: '2022', text: 'Limited edition series introduction' },
    { year: '2023', text: 'Major solo exhibitions in global art capitals' },
    { year: '2023', text: 'Establishment of exclusive collector network' },
    { year: 'Present', text: 'Continued evolution of artistic expression' }
  ];

  return (
    <div className="relative min-h-screen bg-[#010208] overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
      
      <div className={`relative z-10 max-w-6xl mx-auto px-8 py-32 transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Timeline Section First */}
          <div className="space-y-8">
            <AnimatedHeader 
              title="Traces" 
              subtitle="Digital footprints across time"
            />
            
            <div className="space-y-6 relative backdrop-blur-[2px]">
              <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-blue-500/20" />
              {timelineItems.map((item, index) => (
                <div 
                  key={index}
                  className="relative pl-8 group"
                >
                  <div className="absolute left-0 top-0 w-2 h-2 bg-blue-400/30 rounded-full transform -translate-x-[5px] group-hover:bg-blue-400/50 transition-colors duration-300" />
                  <div className="text-sm text-blue-300/50 mb-1 tracking-wider">{item.year}</div>
                  <div className="text-white/80 relative">
                    {item.text}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio Section Second */}
          <div className="relative min-h-[1000px]">
            {/* Background Image with Radial Fade */}
            <div className="absolute -right-20 top-0 w-[600px] h-[600px] opacity-[0.07] pointer-events-none">
              <div className="absolute inset-0 bg-radial-fade">
                <Image
                  src="/images/lvdb.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <div className="absolute inset-0 bg-radial-fade-dark mix-blend-multiply" />
            </div>
            
            {/* Content */}
            <div className="absolute top-[600px] left-0 right-0 space-y-8">
              <AnimatedHeader 
                title="The Enigma"
              />
              
              <div className="relative backdrop-blur-sm">
                <p className="text-lg text-white/70 leading-relaxed">
                  Through a masterful blend of light and shadow, Lukas Vandeverre creates ethereal artworks that transcend traditional boundaries. His distinctive style emerges from years of exploring the intersection between consciousness and form, resulting in pieces that challenge perception and invite contemplation.
                </p>
              </div>

              <div className="relative p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-colors duration-300">
                <div className="relative overflow-hidden">
                  <p className="text-white/60 italic relative z-10">
                    "Art exists in the space between reality and dreams, where the unseen becomes visible."
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add the radial gradient styles */}
      <style jsx global>{`
        .bg-radial-fade {
          background: radial-gradient(circle at center, white 40%, transparent 75%);
        }
        .bg-radial-fade-dark {
          background: radial-gradient(circle at center, transparent 35%, #010208 75%);
        }
      `}</style>
    </div>
  );
} 