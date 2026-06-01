'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'

gsap.registerPlugin(TextPlugin)

const bubbles = [
  { id: 1, left: '10%', size: 12, delay: 0.1, duration: 4.8 },
  { id: 2, left: '22%', size: 7, delay: 1.2, duration: 5.5 },
  { id: 3, left: '36%', size: 16, delay: 0.5, duration: 6.2 },
  { id: 4, left: '48%', size: 9, delay: 1.8, duration: 5.2 },
  { id: 5, left: '62%', size: 14, delay: 0.9, duration: 6 },
  { id: 6, left: '76%', size: 8, delay: 2.2, duration: 5.8 },
  { id: 7, left: '88%', size: 18, delay: 0.3, duration: 6.6 },
]

const fishStops = () => {
  const sceneWidth = Math.min(window.innerWidth, 980)

  return [sceneWidth * 0.24, sceneWidth * 0.39, sceneWidth * 0.54]
}

export function OceanCleanupPreloader() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const mainContent = document.querySelector('.main-content')

    if (!root || !mainContent) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const loadingText = root.querySelector('.loading-text')
      const welcomeTimer = window.setTimeout(() => {
        if (loadingText) {
          loadingText.textContent = 'Welcome!'
        }
      }, 450)

      gsap.set(mainContent, { opacity: 1, y: 0, clearProps: 'transform' })
      const hideTimer = window.setTimeout(() => {
        root.style.opacity = '0'
        root.style.pointerEvents = 'none'
        root.style.display = 'none'
      }, 900)

      return () => {
        window.clearTimeout(welcomeTimer)
        window.clearTimeout(hideTimer)
      }
    }

    const ctx = gsap.context(() => {
      const [firstTrash, secondTrash, thirdTrash] = fishStops()
      const bubbleTweens = gsap.utils.toArray<HTMLElement>('.bubble').map((bubble) => {
        const duration = Number(bubble.dataset.duration) || 5
        const delay = Number(bubble.dataset.delay) || 0

        return gsap.fromTo(
          bubble,
          {
            autoAlpha: 0,
            y: 110,
            x: 0,
            scale: 0.72,
          },
          {
            autoAlpha: 0.78,
            delay,
            duration,
            ease: 'none',
            repeat: -1,
            scale: 1,
            x: 'random(-18, 18)',
            y: '-86vh',
          },
        )
      })

      const fishBob = gsap.to('.fish__inner', {
        y: -11,
        rotation: -2.5,
        duration: 0.9,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })

      gsap.set(mainContent, { opacity: 0, y: 40 })
      gsap.set('.trash', { transformOrigin: '50% 50%' })
      gsap.set('.preloader-progress__bar', { scaleX: 0, transformOrigin: '0% 50%' })
      gsap.set('.wave-transition', { yPercent: 120 })

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          root.style.display = 'none'
          fishBob.kill()
          bubbleTweens.forEach((tween) => tween.kill())
        },
      })

      tl.addLabel('intro')
        .from(root, { opacity: 0, duration: 0.45 })
        .from('.ocean-cleaner__sunbeam', { opacity: 0, y: -24, duration: 0.7 }, '<')
        .from('.trash', { opacity: 0, y: 18, stagger: 0.12, duration: 0.55 }, '-=0.2')
        .from('.preloader-panel', { opacity: 0, y: 18, duration: 0.55 }, '-=0.45')
        .addLabel('fishEnter')
        .from('.fish', { x: -260, opacity: 0, duration: 0.8, ease: 'back.out(1.1)' })
        .to('.fish', { x: firstTrash, y: -18, duration: 0.72, ease: 'sine.inOut' })
        .addLabel('collectTrash')
        .to('.trash-1', {
          x: -80,
          y: -18,
          rotation: 180,
          scale: 0,
          opacity: 0,
          duration: 0.45,
          ease: 'back.in(1.8)',
        })
        .to('.preloader-progress__bar', { scaleX: 0.34, duration: 0.38 }, '<')
        .to(root, { '--ocean-brightness': 1.08, duration: 0.38 }, '<')
        .to('.fish', { x: secondTrash, y: 14, duration: 0.72, ease: 'sine.inOut' }, '+=0.05')
        .to('.trash-2', {
          x: -80,
          y: 14,
          rotation: -180,
          scale: 0,
          opacity: 0,
          duration: 0.45,
          ease: 'back.in(1.8)',
        })
        .to('.preloader-progress__bar', { scaleX: 0.68, duration: 0.38 }, '<')
        .to(root, { '--ocean-brightness': 1.18, duration: 0.38 }, '<')
        .to('.fish', { x: thirdTrash, y: -10, duration: 0.72, ease: 'sine.inOut' }, '+=0.05')
        .to('.trash-3', {
          x: -80,
          y: -10,
          rotation: 180,
          scale: 0,
          opacity: 0,
          duration: 0.45,
          ease: 'back.in(1.8)',
        })
        .to('.preloader-progress__bar', { scaleX: 1, duration: 0.42 }, '<')
        .to(root, { '--ocean-brightness': 1.32, duration: 0.45 }, '<')
        .addLabel('complete')
        .to('.loading-text', { text: 'Welcome!', duration: 0.35, ease: 'none' })
        .to('.fish', { x: thirdTrash + 110, y: -26, duration: 0.55, ease: 'sine.inOut' }, '<')
        .to('.wave-transition', { yPercent: 0, duration: 0.62, ease: 'power2.inOut' }, '+=0.1')
        .addLabel('revealMain')
        .to(root, {
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.55,
          ease: 'power2.out',
        })
        .fromTo(
          mainContent,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
          '-=0.2',
        )
    }, root)

    return () => {
      ctx.revert()
      gsap.set(mainContent, { clearProps: 'opacity,transform' })
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="preloader ocean-cleaner"
      role="status"
      aria-live="polite"
      aria-label="Ocean cleanup loader"
    >
      <div className="ocean-cleaner__sunbeam" aria-hidden="true" />

      <div className="bubble-field" aria-hidden="true">
        {bubbles.map((bubble) => (
          <span
            key={bubble.id}
            className="bubble"
            data-delay={bubble.delay}
            data-duration={bubble.duration}
            style={{
              left: bubble.left,
              height: bubble.size,
              width: bubble.size,
            }}
          />
        ))}
      </div>

      <div className="ocean-cleaner__scene" aria-hidden="true">
        <div className="trash trash-1">
          <BottleIcon />
        </div>
        <div className="trash trash-2">
          <PlasticBagIcon />
        </div>
        <div className="trash trash-3">
          <CanIcon />
        </div>

        <div className="fish">
          <div className="fish__inner">
            <FishIcon />
          </div>
        </div>

        <div className="ocean-cleaner__reef">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="preloader-panel">
        <p className="preloader-kicker">Ocean Cleanup Loader</p>
        <h1 className="loading-text">Cleaning ocean...</h1>
        <div className="preloader-progress" aria-hidden="true">
          <span className="preloader-progress__bar" />
        </div>
      </div>

      <div className="wave-layer" aria-hidden="true">
        <span className="wave wave-a" />
        <span className="wave wave-b" />
      </div>

      <div className="wave-transition" aria-hidden="true" />
    </div>
  )
}

function FishIcon() {
  return (
    <svg viewBox="0 0 172 108" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M122 53c20-25 34-28 41-24 6 4 3 17-8 25 11 8 14 21 8 25-8 4-22 1-42-24"
        fill="#36B5D8"
      />
      <path
        d="M18 55c13-27 39-43 75-39 29 4 51 20 51 39 0 20-22 36-52 39-36 4-62-12-74-39Z"
        fill="#FFCD67"
      />
      <path
        d="M43 31c11-11 34-17 61-8-8-13-23-20-41-18-16 2-23 12-20 26Z"
        fill="#FF8F66"
      />
      <path
        d="M43 79c11 11 34 17 61 8-8 13-23 20-41 18-16-2-23-12-20-26Z"
        fill="#FF8F66"
      />
      <path d="M39 55c-9-12-20-16-31-12 4 11 13 17 26 17" fill="#36B5D8" />
      <path
        d="M70 55c0 15-12 28-27 28-11-6-20-16-25-28 5-12 14-22 25-28 15 0 27 13 27 28Z"
        fill="#FFE59D"
      />
      <circle cx="52" cy="47" r="6" fill="#0B2540" />
      <circle cx="54" cy="45" r="2" fill="white" />
      <path d="M73 64c13 8 31 8 45 0" stroke="#DF7A46" strokeWidth="5" strokeLinecap="round" />
      <path
        d="M100 31c9 8 15 16 15 24s-6 16-15 24"
        stroke="#EFA348"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BottleIcon() {
  return (
    <svg viewBox="0 0 76 116" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M31 7h18v18H31z" fill="#5DCEE8" />
      <path d="M28 24h24l3 14-8 12v47c0 6-5 11-11 11h-8c-6 0-11-5-11-11V50L25 38l3-14Z" fill="#A9ECF6" />
      <path d="M18 63h30v20H18z" fill="#F9F6D7" />
      <path d="M31 7h18v8H31z" fill="#1B7EA2" />
      <path d="M28 38h27" stroke="#5DCEE8" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

function PlasticBagIcon() {
  return (
    <svg viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22 36c0-9 8-16 17-16h26c10 0 17 7 17 16l5 47c1 7-4 13-11 13H28c-7 0-12-6-11-13l5-47Z"
        fill="#F7F9FF"
      />
      <path
        d="M38 37c0-9 6-16 14-16s14 7 14 16"
        stroke="#8BD1E5"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path d="M28 54c12 8 27 10 48 0" stroke="#B4E7F0" strokeWidth="5" strokeLinecap="round" />
      <path d="M34 71c8 5 20 6 35 0" stroke="#D7F4F8" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

function CanIcon() {
  return (
    <svg viewBox="0 0 78 104" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="39" cy="18" rx="25" ry="10" fill="#C7D1DA" />
      <path d="M14 18h50v68c0 6-11 11-25 11s-25-5-25-11V18Z" fill="#F26B5B" />
      <path d="M20 36h38v24H20z" fill="#FFE083" />
      <path d="M14 86c0 6 11 11 25 11s25-5 25-11" stroke="#C3423F" strokeWidth="5" />
      <path d="M29 17c7-4 14-4 21 0" stroke="#778491" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}
