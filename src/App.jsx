// App.jsx
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import WarpVisual from './assets/warp.svg';
import Loading from './Loading';
import VinylPlayer from './VinylPlayer';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBackward, faVolumeUp, faForward, faGlobe } from '@fortawesome/free-solid-svg-icons';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

const Marquee = ({ projects = [], repeat = 4, duration = 2.0 }) => {
  const $wrapper = useRef(null);
  const tween = useRef(null);

  useEffect(() => {
    if (!$wrapper.current) return;
    const $images = $wrapper.current.childNodes;
    const limit = [...$images].reduce((width, $image) => width + $image.offsetWidth, 0) / repeat;

    tween.current = gsap.to($wrapper.current, {
      x: -limit,
      ease: 'none',
      duration,
      repeat: -1,
    });

    return () => {
      if (tween.current) tween.current.kill();
    };
  }, []);

  const handlePointerEnter = () => {
    if (tween.current) {
      gsap.to(tween.current, { timeScale: 0, ease: 'power2.out', duration: 0.75 });
    }
  };

  const handlePointerLeave = () => {
    if (tween.current) {
      gsap.to(tween.current, { timeScale: 1, ease: 'power2.inOut', duration: 0.75 });
    }
  };

  return (
    <div className="marquee" onPointerEnter={handlePointerEnter} onPointerLeave={handlePointerLeave}>
      <div className="marquee__wrapper" ref={$wrapper}>
        {Array.from({ length: repeat })
          .flatMap(() => projects)
          .map((project, index) => (
            <div className="marquee__item" key={`${project.image} - ${index}`}>
              <div className="marquee__image">
                <img src={`/${project.image}`} loading="lazy" alt={`Record ${index + 1}`} className="record-img" />
                <div className="overlay">
                  <p className="overlay-title">{project.title}</p>
                  <div className="overlay-buttons">
                    <a href={project.website} target="_blank" rel="noopener noreferrer" className="overlay-btn">
                      <FontAwesomeIcon icon={faGlobe} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

function MusicPrompt({ onChoice }) {
  return (
    <div className="music-prompt">
      <h1>Would you like to have accompanying music while interacting with the website?</h1>
      <div className="music-buttons">
        <button onClick={() => onChoice(false)}>OFF</button>
        <button onClick={() => onChoice(true)}>ON</button>
      </div>
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [warpTransform, setWarpTransform] = useState('translate(-50%, -50%) scale(0.65) skewY(0deg)');
  const [musicChoice, setMusicChoice] = useState(null);

  const makeRef = useRef();
  const coolRef = useRef();
  const shtRef = useRef();

  const aboutTitleRef = useRef();
  const aboutParaRef = useRef();

  const canvasRef = useRef();
  const vinylRef = useRef();

  const projects = [
    { image: 'record.png', title: 'Space invaders', website: 'https://courageous-moxie-08d790.netlify.app/' },
    { image: 'record1.jpeg', title: 'Notes app', website: 'https://roaring-marzipan-cbaf59.netlify.app/' },
    { image: 'record2.jpeg', title: 'Weather app', website: 'https://prismatic-daifuku-253681.netlify.app/' },
    { image: 'record3.jpeg', title: 'Project Title 4', website: 'https://example.com/pt4' }
  ];

  useEffect(() => {
    const MIN_LOADING_TIME = 4000; 
    const start = Date.now();

    const handleLoad = () => {
      const now = Date.now();
      const elapsed = now - start;

      if (elapsed >= MIN_LOADING_TIME) {
        setIsLoading(false);
      } else {
        setTimeout(() => setIsLoading(false), MIN_LOADING_TIME - elapsed);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && musicChoice !== null) {
      let ticking = false;

      const onMouse = (e) => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const cy = window.innerHeight / 2;
            const dy = e.clientY - cy;
            const skew = (dy / cy) * 6;
            const scale = 0.65 + Math.abs(dy / cy) * 0.05;
            setWarpTransform(`translate(-50%, -50%) scale(${scale}) skewY(${skew}deg)`);
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener('mousemove', onMouse);
      return () => window.removeEventListener('mousemove', onMouse);
    }
  }, [isLoading, musicChoice]);

  useEffect(() => {
    if (!isLoading && musicChoice !== null) {
      const triggers = [];

      const tlText = gsap.timeline()
        .to(makeRef.current, { duration: 0.6, text: 'MAKE', ease: 'none' })
        .to(coolRef.current, { duration: 0.6, text: 'COOL', ease: 'none' }, '+=0.2')
        .to(shtRef.current, { duration: 0.6, text: 'SH*T', ease: 'none' }, '+=0.2');

      const tl = gsap.timeline({ paused: true })
        .to(aboutTitleRef.current, { duration: 1, text: 'ABOUT ME', ease: 'none' })
        .to(aboutParaRef.current, {
          duration: 2,
          text: 'I am a passionate, creative guy ready to collaborate on any cool project. My main focus is design and coming up with ideas, so do keep that in mind!',
          ease: 'none',
        }, '+=0.3');

      triggers.push(ScrollTrigger.create({
        trigger: '.about',
        start: 'top 80%',
        onEnter: () => tl.play(),
      }));

      triggers.push(ScrollTrigger.create({
        trigger: '.landing',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const rawProgress = Math.max(0, Math.min(self.progress, 1));
          const maxAngle = Math.PI / 3;
          if (vinylRef.current) {
            vinylRef.current.setLidRotation(rawProgress * maxAngle);
          }
        },
      }));

      // ★ Move vinyl to left for About
      triggers.push(ScrollTrigger.create({
        trigger: '.about',
        start: 'top bottom',
        end: 'top top',
        scrub: 1,
        animation: gsap.fromTo(canvasRef.current,
          { top: '50%', left: '50%', scale: 1 },
          { top: '50%', left: '25%', scale: 0.7, ease: 'power2.out' })
      }));

      // ★ Smooth move down to Projects
      triggers.push(ScrollTrigger.create({
        trigger: '.projects-section',
        start: 'top bottom',
        end: 'top center',
        scrub: 1,
        animation: gsap.to(canvasRef.current, {
          top: 'calc(100vh + 600px)',
          left: '50%',
          scale: 0.7,
          ease: 'power3.inOut',
        })
      }));

      return () => triggers.forEach(trigger => trigger.kill());
    }
  }, [isLoading, musicChoice]);

  if (isLoading) return <Loading />;
  if (musicChoice === null) return <MusicPrompt onChoice={setMusicChoice} />;

  return (
    <>
      <section className="landing">
        <img src={WarpVisual} alt="Warp background" className="warp-background" style={{ transform: warpTransform }} />
        <div className="text-overlay">
          <h1 ref={makeRef} className="text-make">MAKE</h1>
          <h1 ref={coolRef} className="text-cool">COOL</h1>
          <h1 ref={shtRef} className="text-sht">SH*T</h1>
        </div>
        <div ref={canvasRef} className="canvas-wrapper">
          <VinylPlayer vinylRef={vinylRef} />
        </div>
      </section>

      <section className="about">
        <h2 ref={aboutTitleRef} className="about-heading" />
        <div className="about-content">
          <div className="controls">
            <button className="icon-btn">
              <FontAwesomeIcon icon={faBackward} />
            </button>
            <button className="icon-btn">
              <FontAwesomeIcon icon={faVolumeUp} />
            </button>
            <button className="icon-btn">
              <FontAwesomeIcon icon={faForward} />
            </button>
          </div>
          <div className="about-right">
            <p ref={aboutParaRef} />
          </div>
        </div>
      </section>

      <section className="projects-section">
        <h2 className="projects-heading">PROJECTS</h2>
        <Marquee projects={projects} />
      </section>
    </>
  );
}

export default App;
