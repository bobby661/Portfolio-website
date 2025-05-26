import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import WarpVisual from './assets/warp.svg';
import Loading from './Loading';
import VinylPlayer from './VinylPlayer';

import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faVolumeUp, faForward } from '@fortawesome/free-solid-svg-icons';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [warpTransform, setWarpTransform] = useState(
    'translate(-50%, -50%) scale(0.65) skewY(0deg)'
  );

  const makeRef = useRef();
  const coolRef = useRef();
  const shtRef = useRef();

  const aboutTitleRef = useRef();
  const aboutParaRef = useRef();

  const canvasRef = useRef();
  const trackRef = useRef();

  const recordFiles = ['record.jpeg', 'record1.jpeg', 'record2.jpeg', 'record3.jpeg'];

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(t);
  }, []);

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

  useEffect(() => {
    if (!isLoading) {
      gsap
        .timeline()
        .to(makeRef.current, { duration: 0.6, text: 'MAKE', ease: 'none' })
        .to(coolRef.current, { duration: 0.6, text: 'COOL', ease: 'none' }, '+=0.2')
        .to(shtRef.current, { duration: 0.6, text: 'SH*T', ease: 'none' }, '+=0.2');
    }
  }, [isLoading]);

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

  useEffect(() => {
    if (!isLoading) {
      // Phase 1: Landing ➝ About
      gsap.fromTo(
        canvasRef.current,
        { top: '50%', left: '50%', scale: 1 },
        {
          top: '50%',
          left: '25%',
          scale: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about',
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
          },
        }
      );

      // Phase 2: About ➝ Projects
      gsap.to(canvasRef.current, {
        top: 'calc(100vh + 400px)',
        left: '50%',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.projects-section',
          start: 'top bottom',
          end: 'top center',
          scrub: 1,
        },
      });
    }
  }, [isLoading]);

  // === RECORD CAROUSEL SETUP ===
  useEffect(() => {
    if (isLoading) return;

    const images = document.querySelectorAll('.record-img');
    let loadedCount = 0;

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        startCarousel();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        onImageLoad();
      } else {
        img.addEventListener('load', onImageLoad);
      }
    });

    function startCarousel() {
      const items = gsap.utils.toArray('.record-img');
      const itemWidth = items[0].offsetWidth + 80;
      const totalWidth = items.length * itemWidth;

      gsap.set(items, {
        x: (i) => i * itemWidth,
      });

      gsap.to(items, {
        x: `-=${totalWidth / 2}`,
        modifiers: {
          x: gsap.utils.unitize(gsap.utils.wrap(0, totalWidth)),
        },
        duration: 40,
        ease: 'none',
        repeat: -1,
      });
    }

    return () => {
      images.forEach((img) => img.removeEventListener('load', onImageLoad));
    };
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
            <button className="icon-btn"> <FontAwesomeIcon icon={faBackward} /> </button>
            <button className="icon-btn"> <FontAwesomeIcon icon={faVolumeUp} /> </button>
            <button className="icon-btn"> <FontAwesomeIcon icon={faForward} /> </button>
          </div>
        </div>
        <div className="about-right">
          <h2 ref={aboutTitleRef} />
          <p ref={aboutParaRef} />
        </div>
      </section>

      {/* ===== Projects ===== */}
      <section className="projects-section">
        <h2 className="projects-heading">PROJECTS</h2>
        <div className="marquee-wrapper">
          <div className="marquee-track" ref={trackRef}>
            {[...recordFiles, ...recordFiles].map((file, i) => (
              <img key={i} src={`/${file}`} alt={`Record ${i + 1}`} className="record-img" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
