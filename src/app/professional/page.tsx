"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Fallback CSS-based animation component
function Loog3DFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative">
        {/* Main rotating element */}
        <div className="w-32 h-32 relative animate-spin" style={{ animationDuration: '4s' }}>
          <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent"></div>
          <div className="absolute inset-2 rounded-full border-4 border-cyan-400 border-b-transparent animate-reverse-spin" style={{ animationDuration: '3s' }}></div>
          <div className="absolute inset-4 rounded-full border-4 border-yellow-400 border-r-transparent animate-pulse"></div>
        </div>
        
        {/* Orbital elements */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Text */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold tracking-widest">
          LOOG
        </div>
      </div>
    </div>
  );
}

// Dynamically import the Loog3D component to avoid SSR issues with Three.js
const Loog3D = dynamic(() => import('@/components/Loog3DCanvas'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96 text-gray-600">Loading 3D animation...</div>
});

export default function Professional() {
  const [use3D, setUse3D] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Detect WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      setUse3D(false);
    }
    
    // Set a timeout to show fallback if 3D doesn't load in time
    const timer = setTimeout(() => {
      if (!loaded) {
        setUse3D(false);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Professional Portfolio
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Showcasing modern web development skills with interactive 3D animations
          </p>
        </div>

        {/* 3D Loog Animation Section */}
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6 text-center">
            Interactive 3D Loog
          </h2>
          <div className="h-96 w-full">
            {use3D ? (
              <Loog3D />
            ) : (
              <Loog3DFallback />
            )}
          </div>
          <p className="text-gray-300 text-center mt-4">
            {use3D ? "Click and drag to rotate • Scroll to zoom" : "Animated with CSS • Responsive design"}
          </p>
        </div>

        {/* Skills Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Frontend Development</h3>
            <p className="text-gray-300">
              React, Next.js, TypeScript, Tailwind CSS, and modern web technologies
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">3D Graphics</h3>
            <p className="text-gray-300">
              Three.js, WebGL, and interactive 3D experiences for the web
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-3">Modern Stack</h3>
            <p className="text-gray-300">
              Full-stack development with cutting-edge tools and frameworks
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <a 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}