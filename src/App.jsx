// src/App.jsx
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import WarpVisual from './assets/warp.svg';
import Loading from './Loading';
import VinylPlayer from './VinylPlayer';

import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(TextPlugin, ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [warpTransform, setWarpTransform] = useState(
    'translate(-50%, -50%) scale(0.65) skewY(0deg)'
  );

  // landing text refs
  const makeRef = useRef();
  const coolRef = useRef();
  const shtRef = useRef();

  // about text refs
  const aboutTitleRef = useRef();
  const aboutParaRef = useRef();

  // canvas wrapper ref
  const canvasRef = useRef();

  // 4s loader
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // mouse‐warp effect
  useEffect(() => {
    if (!isLoading) {
      const onMouse = (e) => {
        const cy = window.innerHeight / 2;
        const dy = e.clientY - cy;
        const skew = (dy / cy) * 6;
        const scale = 0.65 + Math.abs(dy / cy) * 0.05;
        setWarpTransform(
          `translate(-50%, -50%) scale(${scale}) skewY(${skew}deg)`
        );
      };
      window.addEventListener('mousemove', onMouse);
      return () => window.removeEventListener('mousemove', onMouse);
    }
  }, [isLoading]);

  // landing typewriter
  useEffect(() => {
    if (!isLoading) {
      gsap
        .timeline()
        .to(makeRef.current, { duration: 0.6, text: 'MAKE', ease: 'none' })
        .to(coolRef.current, { duration: 0.6, text: 'COOL', ease: 'none' }, '+=0.2')
        .to(shtRef.current, { duration: 0.6, text: 'SH*T', ease: 'none' }, '+=0.2');
    }
  }, [isLoading]);

  // about scroll-triggered typewriter
  useEffect(() => {
    if (!isLoading) {
      const tl = gsap
        .timeline({ paused: true })
        .to(aboutTitleRef.current, { duration: 1, text: 'ABOUT ME', ease: 'none' })
        .to(
          aboutParaRef.current,
          {
            duration: 2,
            text:
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum.',
            ease: 'none'
          },
          '+=0.3'
        );

      ScrollTrigger.create({
        trigger: '.about',
        start: 'top 80%',
        onEnter: () => tl.play(),
      });
    }
  }, [isLoading]);

  // scroll-scrub the canvas position & scale into the about section
  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(
        canvasRef.current,
        { left: '50%', scale: 1 },
        {
          left: '25%',   // center in left half
          scale: 0.7,    // only shrink to 70%
          ease: 'power1.out',
          scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
          },
        }
      );
    }
  }, [isLoading]);

  if (isLoading) return <Loading />;

  return (
    <>
      {/* ===== Landing ===== */}
      <section className="landing">
        <img
          src={WarpVisual}
          alt="Warp background"
          className="warp-background"
          style={{ transform: warpTransform }}
        />

        <div className="text-overlay">
          <h1 ref={makeRef} className="text-make" />
          <h1 ref={coolRef} className="text-cool" />
          <h1 ref={shtRef} className="text-sht" />
        </div>

        <div ref={canvasRef} className="canvas-wrapper">
          <VinylPlayer />
        </div>
      </section>

      {/* ===== About ===== */}
      <section className="about">
        <div className="about-left">
          <div className="controls">
            <span>◀</span>
            <span>🔈</span>
            <span>▶</span>
          </div>
        </div>
        <div className="about-right">
          <h2 ref={aboutTitleRef} />
          <p ref={aboutParaRef} />
        </div>
      </section>
    </>
  );
}

export default App;
