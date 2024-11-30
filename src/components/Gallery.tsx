'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import AnimatedHeader from './AnimatedHeader';
import { motion } from 'framer-motion';

interface Artwork {
  id: number;
  image: string;
  title: string;
  description: string;
  originalPrice: string;
  printPrice: string;
  dimensions: string;
  editionsLeft: number;
}

interface InquiryForm {
  message: string;
  contact: string;
  intention: string;
  experience: string;
}

const artworks: Artwork[] = [
  {
    id: 1,
    image: '/images/artwork1.jpg',
    title: 'Digital Metamorphosis I',
    description: 'A stunning exploration of digital transformation, where organic forms merge with technological elements. This piece represents the evolution of consciousness in our digital age.',
    originalPrice: 'Original Artwork: $4,800 (SOLD)',
    printPrice: 'Collector Edition Print: $950',
    dimensions: '80 x 120 cm',
    editionsLeft: 2
  },
  {
    id: 2,
    image: '/images/artwork2.jpg',
    title: 'Neural Pathways',
    description: 'An intricate visualization of neural networks, combining abstract patterns with flowing energy. This piece captures the complexity of artificial intelligence and human consciousness.',
    originalPrice: 'Original Artwork: $5,200 (SOLD)',
    printPrice: 'Collector Edition Print: $950',
    dimensions: '100 x 150 cm',
    editionsLeft: 1
  },
  {
    id: 3,
    image: '/images/artwork3.jpg',
    title: 'Digital Dreams',
    description: 'A dreamlike composition that blends surreal elements with digital artifacts. This artwork explores the boundary between reality and digital imagination.',
    originalPrice: 'Original Artwork: $4,500 (SOLD)',
    printPrice: 'Collector Edition Print: $950',
    dimensions: '90 x 120 cm',
    editionsLeft: 3
  },
  {
    id: 4,
    image: '/images/artwork4.jpg',
    title: 'Quantum Reflections',
    description: 'A mesmerizing piece that visualizes quantum mechanics through artistic expression. The work plays with concepts of superposition and entanglement.',
    originalPrice: 'Original Artwork: $5,800 (SOLD)',
    printPrice: 'Collector Edition Print: $950',
    dimensions: '100 x 140 cm',
    editionsLeft: 1
  },
  {
    id: 5,
    image: '/images/artwork5.jpg',
    title: 'Digital Erosion',
    description: 'An exploration of digital decay and transformation, where pixels and particles create new forms of beauty. This piece comments on the impermanence of digital art.',
    originalPrice: 'Original Artwork: $5,400 (SOLD)',
    printPrice: 'Collector Edition Print: $950',
    dimensions: '80 x 120 cm',
    editionsLeft: 2
  },
  {
    id: 6,
    image: '/images/artwork6.jpg',
    title: 'Synthetic Nature',
    description: 'A harmonious blend of natural forms and digital manipulation, creating a new perspective on the relationship between technology and nature.',
    originalPrice: 'Original Artwork: $4,900 (SOLD)',
    printPrice: 'Collector Edition Print: $950',
    dimensions: '90 x 130 cm',
    editionsLeft: 4
  }
];

const PrintCollection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const sizes = new Float32Array(particlesCount);

    for(let i = 0; i < particlesCount * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * 20;      // x
      positions[i + 1] = (Math.random() - 0.5) * 10;  // y
      positions[i + 2] = (Math.random() - 0.5) * 10;  // z
      
      // Color - purple/blue palette
      colors[i] = 0.6 + Math.random() * 0.2;     // R
      colors[i + 1] = 0.2 + Math.random() * 0.2; // G
      colors[i + 2] = 1.0;                       // B
      
      // Size
      sizes[i/3] = Math.random() * 2 + 0.5;
    }

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
          
          // Wave animation
          float wave = sin(uTime * 0.3 + position.x + position.y + position.z) * 0.2;
          mvPosition.y += wave;
          
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * 3.0 * uPixelRatio * (1.0 / -mvPosition.z);
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
      particles.rotation.y = time * 0.05;
      particles.rotation.x = Math.sin(time * 0.025) * 0.1;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      material.uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-[800px] py-24">
      {/* Three.js background */}
      <div ref={containerRef} className="absolute inset-0 -z-10" />

      {/* Content */}
      <div className="relative z-10 text-center space-y-16">
        <AnimatedHeader 
          title="PRINT COLLECTION" 
          align="center"
          size="large"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto px-8">
          <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 space-y-4 transition-all duration-500 hover:scale-105 hover:bg-white/10">
            <h4 className="text-xl text-white/90 font-light">Museum-Grade Prints</h4>
            <p className="text-white/60 text-sm leading-relaxed">
              Each artwork is meticulously printed on premium archival paper using 
              state-of-the-art printing technology
            </p>
          </div>

          <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 space-y-4 transition-all duration-500 hover:scale-105 hover:bg-white/10">
            <h4 className="text-xl text-white/90 font-light">Limited Availability</h4>
            <p className="text-white/60 text-sm leading-relaxed">
              Strictly limited to 12 prints per artwork, each individually 
              numbered and signed by the artist
            </p>
          </div>

          <div className="group p-8 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 space-y-4 transition-all duration-500 hover:scale-105 hover:bg-white/10">
            <h4 className="text-xl text-white/90 font-light">Authentication</h4>
            <p className="text-white/60 text-sm leading-relaxed">
              Every print includes a certificate of authenticity and 
              detailed provenance documentation
            </p>
          </div>
        </div>

        <p className="text-white/40 text-sm tracking-wider max-w-2xl mx-auto italic px-8">
          Note: While fine art prints may appreciate in value over time, past performance does not guarantee future results. 
          Each acquisition should be driven by appreciation for the artistic vision rather than speculative value.
        </p>
      </div>
    </div>
  );
};

const ArtworkCard = ({ artwork, onClick }: { artwork: Artwork; onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`group relative aspect-[3/4] cursor-pointer transform transition-all duration-700 hover:scale-[1.02] hover:z-10`}
      style={{
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto'
      }}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
        initial={false}
        whileHover={{ 
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
          opacity: 1 
        }}
      />
      
      <motion.div 
        className="absolute inset-0 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        whileHover={{ opacity: 1 }}
      />

      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        >
          <Image
            src={artwork.image}
            alt={artwork.title}
            fill
            className="object-cover rounded-lg transition-transform duration-700"
            quality={95}
          />
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20"
        initial={false}
        whileHover={{ y: 0, opacity: 1 }}
      >
        <h3 className="text-xl font-light text-white mb-2">{artwork.title}</h3>
        <p className="text-white/70 text-sm">{artwork.dimensions}</p>
      </motion.div>
    </motion.div>
  );
};

export default function Gallery() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryStep, setInquiryStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<InquiryForm>({
    message: '',
    contact: '',
    intention: '',
    experience: ''
  });

  const [viewCount, setViewCount] = useState<Record<number, number>>({});
  const [recentViews, setRecentViews] = useState<number>(0);

  useEffect(() => {
    // Simulate real-time viewing data
    const interval = setInterval(() => {
      setRecentViews(Math.floor(Math.random() * 3) + 1);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedArtwork) {
      setViewCount(prev => ({
        ...prev,
        [selectedArtwork.id]: (prev[selectedArtwork.id] || 0) + 1
      }));
    }
  }, [selectedArtwork]);

  // Add protection against right-click and drag
  useEffect(() => {
    const preventActions = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', preventActions);
    document.addEventListener('dragstart', preventActions);
    document.addEventListener('selectstart', preventActions);

    return () => {
      document.removeEventListener('contextmenu', preventActions);
      document.removeEventListener('dragstart', preventActions);
      document.removeEventListener('selectstart', preventActions);
    };
  }, []);

  const handleInquiry = () => {
    setShowInquiry(true);
  };

  const nextStep = () => {
    setInquiryStep(inquiryStep + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
    setShowInquiry(false);
    setInquiryStep(1);
    setIsSubmitted(false);
    setFormData({
      message: '',
      contact: '',
      intention: '',
      experience: ''
    });
  };

  const calculateProgress = (artwork: Artwork) => {
    const totalEditions = 5;
    const remaining = artwork.editionsLeft;
    const reserved = totalEditions - remaining;
    const percentage = (reserved / totalEditions) * 100;
    return {
      percentage,
      reserved,
      total: totalEditions
    };
  };

  return (
    <div id="gallery" className="relative min-h-screen bg-black/90" onContextMenu={(e) => e.preventDefault()}>
      <div className="min-h-screen bg-black py-32 px-8">
        <motion.div 
          className="max-w-[1800px] mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {/* Series Title */}
          <div className="text-center mb-24 space-y-6">
            <AnimatedHeader 
              title="DIGITAL ETHEREAL" 
              subtitle="A collection exploring the intersection of consciousness and technology"
              align="center"
              size="large"
            />
            
            <div className="space-y-4">
              <div className="flex justify-center items-center gap-8">
                <div className="text-rose-100/50 text-sm tracking-wider">
                  Original Artworks $4,500—6,500 <span className="text-rose-300/60">SOLD</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10" />
                <div className="text-blue-200/70 text-sm tracking-wider">
                  Collector Editions $950
                </div>
              </div>
              <div className="mt-4 flex justify-center items-center gap-2">
                <div className="w-1 h-1 bg-blue-400/30 rounded-full" />
                <p className="text-blue-200/50 text-xs tracking-wider">
                  Protected against unauthorized reproduction • Screenshots disabled
                </p>
                <div className="w-1 h-1 bg-blue-400/30 rounded-full" />
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {artworks.map((artwork, index) => (
              <ArtworkCard 
                key={artwork.id} 
                artwork={artwork} 
                onClick={() => setSelectedArtwork(artwork)}
              />
            ))}
          </div>

          {/* Print Collection */}
          <PrintCollection />

          {/* Additional Sections */}
          <div className="space-y-32">
            {/* Display Recommendations */}
            <section className="text-center space-y-12">
              <div className="space-y-4">
                <h3 className="text-3xl font-light text-white">Print Care & Display</h3>
                <div className="h-[1px] w-16 bg-white/20 mx-auto" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div className="space-y-6">
                  <h4 className="text-lg text-white/90">Optimal Environment</h4>
                  <ul className="space-y-4 text-white/60 text-sm text-left">
                    <li className="flex items-start gap-3">
                      <div className="w-1 h-1 bg-blue-400/50 rounded-full mt-2" />
                      <p>Avoid direct sunlight to prevent fading and maintain print longevity</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1 h-1 bg-blue-400/50 rounded-full mt-2" />
                      <p>Maintain room temperature between 65-75°F (18-24°C) with 45-55% relative humidity</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1 h-1 bg-blue-400/50 rounded-full mt-2" />
                      <p>Use museum-quality, UV-protective framing glass to protect the artwork</p>
                    </li>
                  </ul>
                </div>

                <div className="space-y-6">
                  <h4 className="text-lg text-white/90">Print Specifications</h4>
                  <ul className="space-y-4 text-white/60 text-sm text-left">
                    <li className="flex items-start gap-3">
                      <div className="w-1 h-1 bg-purple-400/50 rounded-full mt-2" />
                      <p>Premium archival paper: Hahnemühle Photo Rag® 308gsm</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1 h-1 bg-purple-400/50 rounded-full mt-2" />
                      <p>Pigment-based archival inks with 100+ years longevity rating</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1 h-1 bg-purple-400/50 rounded-full mt-2" />
                      <p>Each print includes 1-inch white border for framing flexibility</p>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Modal with Inquiry Form */}
      {selectedArtwork && (
        <div 
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div 
            className="bg-black/50 backdrop-blur-xl w-full max-w-6xl h-[90vh] relative flex items-center mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {!showInquiry ? (
              // Artwork Details View
              <div className="flex flex-col md:flex-row w-full h-full">
                <div className="w-full md:w-3/5 relative h-full">
                  <div className="absolute inset-0 p-4">
                    <div className="relative w-full h-full">
                      <Image 
                        src={selectedArtwork.image}
                        alt={selectedArtwork.title}
                        fill
                        className="object-contain"
                        quality={100}
                        priority
                      />
                    </div>
                  </div>
                  {/* Real-time activity indicators */}
                  <div className="absolute top-8 left-8 flex items-center space-x-2 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-white/70 text-sm">{recentViews} collectors viewing</span>
                  </div>
                </div>

                <div className="w-full md:w-2/5 h-full flex flex-col overflow-hidden">
                  <div className="p-12 flex-1 overflow-y-auto scrollbar-hide">
                    <div className="flex justify-between items-start mb-6">
                      <h2 className="text-3xl font-light text-white">{selectedArtwork.title}</h2>
                      <div className="text-sm text-white/50">
                        Viewed {viewCount[selectedArtwork.id] || 1} times today
                      </div>
                    </div>

                    <p className="text-white/70 text-lg mb-8 leading-relaxed">
                      {selectedArtwork.description}
                    </p>
                    
                    <div className="space-y-8">
                      <div>
                        <div className="text-sm text-white/50 uppercase tracking-wider mb-1">Original Artwork</div>
                        <div className="text-xl font-light text-white/90">{selectedArtwork.originalPrice}</div>
                      </div>
                      
                      <div className="relative">
                        <div className="text-sm text-white/50 uppercase tracking-wider mb-1">Limited Availability</div>
                        <div className="text-white/90 mb-4">
                          <div className="flex justify-between items-baseline">
                            <span>{selectedArtwork.printPrice}</span>
                            <span className="text-sm text-white/50">
                              {selectedArtwork.editionsLeft} editions available
                            </span>
                          </div>
                        </div>
                        
                        {/* Updated progress bar */}
                        <div className="mb-4">
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                              style={{ 
                                width: `${calculateProgress(selectedArtwork).percentage}%` 
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-sm text-white/50 mt-2">
                            <span>
                              {calculateProgress(selectedArtwork).reserved} of {calculateProgress(selectedArtwork).total} editions reserved
                            </span>
                            <span>
                              {calculateProgress(selectedArtwork).percentage}%
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={handleInquiry}
                          className="w-full py-4 relative group overflow-hidden rounded-lg"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 group-hover:from-blue-600/30 group-hover:to-purple-600/30 transition-colors duration-500" />
                          <div className="relative flex items-center justify-center gap-3">
                            <span className="text-sm tracking-wider uppercase">
                              Purchase Collector Edition • $950
                            </span>
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </div>
                        </button>
                      </div>

                      <div>
                        <div className="text-sm text-white/50 uppercase tracking-wider mb-1">Dimensions</div>
                        <div className="text-white/90">{selectedArtwork.dimensions}</div>
                      </div>

                      {/* Social proof */}
                      <div className="mt-8 p-4 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex -space-x-2">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-black/50" />
                            ))}
                          </div>
                          <div className="text-sm text-white/70">
                            Recent collectors from London, Berlin, NYC
                          </div>
                        </div>
                        <div className="text-white/50 text-sm italic">
                          "Each collector edition is numbered and comes with a certificate of authenticity."
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Inquiry Form
              <div className="w-full h-full flex items-center">
                <div className="p-12 w-full max-w-3xl mx-auto">
                  {!isSubmitted ? (
                    <div className="space-y-12">
                      <div className="text-center space-y-6">
                        <div className="relative inline-block">
                          <div className="absolute -inset-1 blur-xl opacity-20 bg-gradient-to-r from-blue-500 to-purple-500" />
                          <h3 className="relative text-3xl font-light">Art Guardian Application</h3>
                        </div>
                        <div className="h-[1px] w-16 bg-white/20 mx-auto" />
                        <p className="text-blue-300/70 italic max-w-xl mx-auto">
                          "Each piece seeks a guardian who understands its essence, transcending mere ownership."
                        </p>
                      </div>

                      <div className="space-y-8">
                        <div className="relative group">
                          <textarea
                            value={formData.intention}
                            onChange={(e) => setFormData({ ...formData, intention: e.target.value })}
                            placeholder="What draws you to this piece? Share your connection..."
                            className="w-full h-48 bg-white/5 border border-white/10 rounded-lg px-8 py-6 text-white/70 focus:outline-none focus:border-blue-500/50 transition-colors duration-300 placeholder:text-white/30"
                            required
                          />
                          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>

                        <div className="flex flex-col items-center space-y-8">
                          <button
                            onClick={handleSubmit}
                            className="relative px-12 py-4 text-sm tracking-[0.3em] uppercase text-white/80 overflow-hidden group"
                          >
                            <span className="relative z-10">Submit Application</span>
                            <div className="absolute inset-0 border border-white/10 group-hover:border-white/20 transition-colors duration-500" />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                          </button>

                          <div className="text-white/40 text-sm italic">
                            Your response will be encrypted and reviewed
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <h3 className="text-3xl font-light">Journey Initiated</h3>
                      <div className="h-[1px] w-16 bg-white/20 mx-auto" />
                      <p className="text-blue-300/70 italic max-w-xl mx-auto">
                        Your connection has been registered. If the resonance aligns, we will reach out through secure channels.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-50"
              onClick={closeModal}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Add CSS for hiding scrollbars while maintaining functionality */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Add CSS to prevent image saving */}
      <style jsx global>{`
        img {
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -o-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }
      `}</style>

      {/* Add screenshot prevention */}
      <style jsx global>{`
        body {
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }
        
        img, video {
          pointer-events: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -o-user-select: none;
          user-select: none;
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }
      `}</style>
    </div>
  );
} 