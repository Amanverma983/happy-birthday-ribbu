import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import portraitImg from './assets/ribbu-portrait.png'

// Custom Canvas Confetti Component
function ConfettiCanvas({ trigger }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!trigger) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = [
      '#d97706', // Gold / Amber
      '#9f1239', // Crimson / Maroon
      '#ffe4e6', // Pastel Pink
      '#fecdd3', // Soft Rose Dark
      '#16a34a', // Emerald Green
      '#ffffff', // White
      '#fffdf9', // Soft Cream
    ]
    
    const particles = []

    // Spawn massive confetti blast
    const count = window.innerWidth < 768 ? 120 : 250
    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.75,
        radius: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * (window.innerWidth < 768 ? 14 : 24),
        vy: -Math.random() * 20 - 12,
        gravity: 0.32,
        drag: 0.965,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
        fadeSpeed: Math.random() * 0.007 + 0.003,
        shape: Math.random() > 0.4 ? 'circle' : 'square',
      })
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let finished = true

      particles.forEach((p) => {
        if (p.opacity <= 0) return
        finished = false

        p.vx *= p.drag
        p.vy *= p.drag
        p.vy += p.gravity
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.opacity -= p.fadeSpeed

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = Math.max(0, p.opacity)
        ctx.fillStyle = p.color

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2)
        }
        ctx.restore()
      })

      if (!finished) {
        animationFrameId = requestAnimationFrame(update)
      }
    }

    update()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [trigger])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  )
}

// Ambient Floating Sparkles Component
function AmbientBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    const colors = [
      'rgba(217, 119, 6, 0.18)',  // Gold
      'rgba(159, 18, 57, 0.15)',  // Crimson
      'rgba(254, 228, 230, 0.35)', // Warm Rose
      'rgba(22, 163, 74, 0.12)',   // Emerald Green
    ]

    const count = window.innerWidth < 768 ? 25 : 55
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4.5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 0.35 + 0.08,
        speedX: (Math.random() - 0.5) * 0.12,
        pulseSpeed: Math.random() * 0.012 + 0.004,
        alpha: Math.random() * 0.65 + 0.15,
        pulseDir: Math.random() > 0.5 ? 1 : -1,
      })
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        p.y -= p.speedY
        p.x += p.speedX

        if (p.y < 0) {
          p.y = canvas.height
          p.x = Math.random() * canvas.width
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.x = Math.random() * canvas.width
        }

        p.alpha += p.pulseSpeed * p.pulseDir
        if (p.alpha > 0.8) {
          p.pulseDir = -1
        } else if (p.alpha < 0.2) {
          p.pulseDir = 1
        }

        ctx.save()
        ctx.globalAlpha = Math.max(0.1, Math.min(0.95, p.alpha))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.fill()
        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(update)
    }

    update()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  )
}

// Romantic Cursor Heart Trail Component (mouse & touch support)
function CursorHeartTrail() {
  const [trail, setTrail] = useState([])

  useEffect(() => {
    const addHeart = (x, y) => {
      const newHeart = {
        id: Math.random(),
        x,
        y,
        size: Math.random() * 12 + 10,
        color: ['#9f1239', '#d97706', '#ffe4e6', '#fecdd3'][Math.floor(Math.random() * 4)],
        rotate: Math.random() * 360,
      }
      setTrail((prev) => [...prev.slice(-15), newHeart])
    }

    const handleMouseMove = (e) => {
      addHeart(e.clientX, e.clientY)
    }

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        addHeart(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {trail.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ opacity: 0.9, scale: 0.5, x: heart.x - 6, y: heart.y - 6, rotate: heart.rotate }}
            animate={{ opacity: 0, scale: 1.6, y: heart.y - 70, rotate: heart.rotate + 45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute select-none text-base"
            style={{ color: heart.color, fontSize: `${heart.size}px` }}
          >
            ❤️
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function App() {
  const [stage, setStage] = useState(1) // 1: Password Lock, 2: Spotlight Screen, 3: Cake Cutting
  const [unlockInput, setUnlockInput] = useState('')
  const [unlockError, setUnlockError] = useState('')
  const [triggerConfetti, setTriggerConfetti] = useState(false)
  const [shake, setShake] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentBgm, setCurrentBgm] = useState('instrumental')
  
  // Audio sources and fallbacks
  const [bgmSource, setBgmSource] = useState("https://raw.githubusercontent.com/ayusharma/birthday/master/hbd.mp3")
  const [cakeMusicIndex, setCakeMusicIndex] = useState(0)
  
  const cakeMusicList = [
    "https://raw.githubusercontent.com/Yemnamehmood/Birthday-wish-with-music-player/master/happy-birthday-155461.mp3",
    "https://raw.githubusercontent.com/Yemnamehmood/Birthday-wish-with-music-player/main/happy-birthday-155461.mp3",
    "https://raw.githubusercontent.com/BaseMax/HappyBirthDayJS/master/music.mp3",
    "https://raw.githubusercontent.com/ayusharma/birthday/master/hbd.mp3"
  ]

  // Cake Ceremony States
  const [isCandleBlownOut, setIsCandleBlownOut] = useState(false)
  const [isCakeCut, setIsCakeCut] = useState(false)
  const [micLevel, setMicLevel] = useState(0)
  const [micError, setMicError] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [balloonList, setBalloonList] = useState([])

  const audioRef = useRef(null)
  const audioContextRef = useRef(null)
  const streamRef = useRef(null)
  const analyserRef = useRef(null)
  const micIntervalId = useRef(null)

  // React to BGM source change by loading and playing audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load()
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.warn("Autoplay prevented or audio source load error:", err)
        })
      }
    }
  }, [bgmSource])

  const cardData = [
    {
      id: 1,
      tag: '✨ Her Vibe',
      title: 'A Radiant Energy',
      desc: 'Tapping into the vibe that lights up every room...',
      detail: 'Your smile lights up the room, and your energy makes everything better. Never change! ✨',
      color: 'border-pink-200 bg-pink-50/40 hover:bg-pink-100/40 text-pink-900',
    },
    {
      id: 2,
      tag: '🚀 The Ultimate Wish',
      title: 'Limitless Dreams',
      desc: 'A message dedicated to your goals and happiness...',
      detail: 'To watching you crush every single goal, conquer your dreams, and stay incredibly happy this year! 🚀',
      color: 'border-amber-200 bg-amber-50/40 hover:bg-amber-100/40 text-amber-900',
    },
    {
      id: 3,
      tag: '❤️ A Little Promise',
      title: 'Always There',
      desc: 'A quiet vow of unwavering support and love...',
      detail: "No matter how old you get today, you'll always be the number one priority. Always here for you. ❤️",
      color: 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-100/40 text-emerald-950',
    },
  ]

  const handleUnlock = (e) => {
    e.preventDefault()
    const answer = unlockInput.trim().toLowerCase()
    
    if (answer === 'ribbu') {
      setUnlockError('')
      setTriggerConfetti(true)
      setIsPlaying(true)
      
      // Play BGM
      if (audioRef.current) {
        audioRef.current.volume = 0.35
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch((err) => {
          console.log("Audio play failed/prevented:", err)
        })
      }

      // Play transition to Stage 2
      setTimeout(() => {
        setStage(2)
      }, 500)
    } else {
      setUnlockError('Access Denied! 🤫 Hint: What does he call you with love? Try again!')
      setShake(true)
      setTimeout(() => setShake(false), 450)
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        setIsPlaying(true)
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch((err) => {
          console.log("Play toggle failed:", err)
          setIsPlaying(false)
        })
      }
    }
  }

  const handleAudioError = () => {
    if (stage === 3 && isCakeCut) {
      const nextIndex = cakeMusicIndex + 1
      if (nextIndex < cakeMusicList.length) {
        console.log("Audio URL failed, attempting fallback index:", nextIndex, cakeMusicList[nextIndex])
        setCakeMusicIndex(nextIndex)
        setBgmSource(cakeMusicList[nextIndex])
      }
    }
  }

  // Stage 3 Microphone blow detection logic
  const startMicDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      const audioContext = new AudioContextClass()
      audioContextRef.current = audioContext
      
      const analyser = audioContext.createAnalyser()
      analyserRef.current = analyser
      analyser.fftSize = 512
      
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      setIsListening(true)
      setMicError(false)

      const checkVolume = () => {
        if (!analyserRef.current) return
        
        analyserRef.current.getByteFrequencyData(dataArray)
        let sum = 0
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i]
        }
        const average = sum / bufferLength
        setMicLevel(average)

        // Threshold: if average is above 50, they blew!
        if (average > 45) {
          blowOutCandle()
          stopMicDetection()
        } else {
          micIntervalId.current = requestAnimationFrame(checkVolume)
        }
      }
      
      checkVolume()
    } catch (err) {
      console.warn("Microphone access denied or failed:", err)
      setMicError(true)
      setIsListening(false)
    }
  }

  const stopMicDetection = () => {
    if (micIntervalId.current) {
      cancelAnimationFrame(micIntervalId.current)
      micIntervalId.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    analyserRef.current = null
    setIsListening(false)
  }

  const blowOutCandle = () => {
    setIsCandleBlownOut(true)
    setTriggerConfetti(prev => !prev) // Fire a quick confetti burst!
  }

  const cutCake = () => {
    if (!isCandleBlownOut) return
    setIsCakeCut(true)
    setTriggerConfetti(prev => !prev) // Fire another massive confetti blast!
    spawnBalloons()

    // Switch background music to the beautiful acoustic Happy Birthday song via state
    setIsPlaying(true)
    setCakeMusicIndex(0)
    setBgmSource(cakeMusicList[0])
    setCurrentBgm('vocals')
  }

  const spawnBalloons = () => {
    const list = []
    const colors = [
      'bg-red-400 border-red-500', 
      'bg-pink-400 border-pink-500', 
      'bg-purple-400 border-purple-500', 
      'bg-blue-400 border-blue-500', 
      'bg-yellow-400 border-yellow-500', 
      'bg-teal-400 border-teal-500', 
      'bg-amber-400 border-amber-500'
    ]
    for (let i = 0; i < 22; i++) {
      list.push({
        id: i,
        left: Math.random() * 85 + 5, // percent
        delay: Math.random() * 3.5, // seconds
        size: Math.random() * 24 + 28, // px
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 4 + 5, // duration in seconds
      })
    }
    setBalloonList(list)
  }

  const resetCakeCeremony = () => {
    stopMicDetection()
    setIsCandleBlownOut(false)
    setIsCakeCut(false)
    setMicLevel(0)
    setBalloonList([])
    
    // Reset music back to soft instrumental via state
    setBgmSource("https://raw.githubusercontent.com/ayusharma/birthday/master/hbd.mp3")
    setCurrentBgm('instrumental')
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMicDetection()
    }
  }, [])

  // Framer Motion Animation Settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 },
    },
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden pastel-gradient-bg">
      {/* Audio Element */}
      <audio 
        ref={audioRef} 
        src={bgmSource} 
        loop 
        onError={handleAudioError}
      />

      {/* Luxury Background Blurred Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-200/40 rounded-full filter blur-[100px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-100/50 rounded-full filter blur-[120px] animate-float-slow-reverse pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[35%] h-[35%] bg-emerald-100/30 rounded-full filter blur-[90px] pointer-events-none" />
      
      {/* Ambient particles background */}
      <AmbientBackground />
      
      {/* Dynamic confetti triggers */}
      <ConfettiCanvas trigger={triggerConfetti} />

      {/* Cursor Heart Trails */}
      <CursorHeartTrail />

      {/* Render floating balloons in Stage 3 on Cake Cut */}
      {stage === 3 && isCakeCut && (
        <div className="pointer-events-none fixed inset-0 z-30 h-full w-full overflow-hidden">
          {balloonList.map((b) => (
            <div
              key={b.id}
              className={`absolute bottom-0 rounded-full border shadow-lg flex flex-col items-center animate-balloon ${b.color}`}
              style={{
                left: `${b.left}%`,
                width: `${b.size}px`,
                height: `${b.size * 1.2}px`,
                animationDelay: `${b.delay}s`,
                animationDuration: `${b.speed}s`,
              }}
            >
              {/* String */}
              <div className="w-[1.5px] h-10 bg-gray-400/40 relative top-full mt-[-1px]" />
            </div>
          ))}
        </div>
      )}

      {/* STAGE 1: LOCK SCREEN */}
      <AnimatePresence>
        {stage === 1 && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)', transition: { duration: 0.8 } }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 120 }}
              className={`glassmorphism-luxury w-full max-w-md rounded-3xl p-8 md:p-10 shadow-2xl ${
                shake ? 'animate-shake' : ''
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-pink-100/90 text-2xl shadow-inner border border-white/60 pulse-glow-rose"
                >
                  🔒
                </motion.div>

                <h1 className="font-serif text-3xl font-semibold tracking-tight text-gray-800">
                  Restricted Space
                </h1>
                
                <p className="mt-3 text-sm text-gray-500 leading-relaxed font-light">
                  This digital space is reserved for a very special person today. To enter, verify your identity.
                </p>

                <form onSubmit={handleUnlock} className="mt-8 w-full">
                  <div className="relative">
                    <input
                      type="text"
                      value={unlockInput}
                      onChange={(e) => setUnlockInput(e.target.value)}
                      placeholder="Enter the secret name he calls you..."
                      className="w-full rounded-2xl border border-gray-200 bg-white/70 px-5 py-4 text-center text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-rose-gold-dark focus:bg-white focus:ring-2 focus:ring-rose-gold-dark/20 shadow-inner"
                    />
                  </div>

                  {unlockError && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-xs font-semibold text-rose-gold-dark/95"
                    >
                      {unlockError}
                    </motion.p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.025, shadow: "0 10px 25px rgba(159,18,57,0.2)" }}
                    whileTap={{ scale: 0.975 }}
                    type="submit"
                    className="mt-6 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-rose-gold-dark to-rose-gold py-4 font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Verify & Enter ✨
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 2: THE RIBBU SPOTLIGHT */}
      <AnimatePresence>
        {stage === 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.6 } }}
            className="relative z-10 w-full"
          >
            {/* Navigation Bar */}
            <header className="sticky top-0 z-30 w-full px-6 py-4 md:px-12">
              <nav className="glassmorphism flex items-center justify-between rounded-2xl px-6 py-3 shadow-md max-w-6xl mx-auto border border-white/60 bg-white/30 backdrop-blur-xl">
                <span className="font-serif text-xl font-bold tracking-tight text-gradient-gold">
                  Ribbca<span className="text-amber-500">.</span> ✨
                </span>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-pink-50 border border-pink-100 text-rose-gold-dark shadow-sm hover:bg-pink-100/80 transition-all duration-200"
                    title={isPlaying ? "Pause BGM" : "Play BGM"}
                  >
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 animate-pulse text-rose-gold-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 18.75V5.25L7.75 9.5H4.5v5h3.25L12 18.75z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 opacity-60 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                      </svg>
                    )}
                  </motion.button>
                  <span className="rounded-full bg-rose-gold-dark/10 px-4 py-1 text-xs font-semibold tracking-wider text-rose-gold-dark uppercase shadow-sm border border-rose-gold-dark/20">
                    Birthday Edition
                  </span>
                </div>
              </nav>
            </header>

            {/* Main Content Area */}
            <motion.main 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-6xl px-6 py-8 md:px-12"
            >
              
              {/* HERO SECTION & PORTRAIT STAND */}
              <section className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center pt-4 md:pt-10">
                
                {/* Polaroid Frame column */}
                <motion.div 
                  variants={itemVariants}
                  className="lg:col-span-5 flex justify-center order-2 lg:order-1"
                >
                  <div className="group relative">
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-pink-200/50 to-amber-200/30 opacity-70 blur-xl group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <motion.div 
                      className="relative bg-white p-4 pb-8 polaroid-shadow border border-rose-100/50 rounded-lg max-w-[320px] md:max-w-[340px] animate-float relative"
                    >
                      {/* Realistic Gold Pin Clip on Polaroid */}
                      <div className="gold-foil w-12 h-3.5 absolute -top-1.5 left-1/2 -translate-x-1/2 -rotate-3 rounded-md shadow-md z-10 border border-amber-600/30" />
                      
                      <div className="overflow-hidden rounded-md bg-stone-100 aspect-[4/5] border border-stone-100">
                        <img
                          src={portraitImg}
                          alt="Ribbu Portrait"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-5 text-center">
                        <p className="font-serif italic text-sm text-gray-500 select-none">
                          The birthday girl in her absolute element ✨
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Wishes and Birthday Paragraph column */}
                <motion.div 
                  variants={itemVariants}
                  className="lg:col-span-7 flex flex-col justify-center order-1 lg:order-2 text-center lg:text-left"
                >
                  <div className="glassmorphism-luxury rounded-3xl p-8 md:p-10 border border-white/60 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/30 rounded-full filter blur-xl pointer-events-none" />
                    
                    <span className="text-xs font-bold uppercase tracking-widest text-rose-gold-dark mb-3 block">
                      💖 Celebrating Ribbca
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-semibold leading-tight text-gray-800 tracking-tight">
                      Wishing the most beautiful soul,{' '}
                      <span className="text-shimmer font-bold underline decoration-amber-400/50 decoration-wavy underline-offset-8">Ribbu</span>, a
                      wonderful year ahead.
                    </h2>
                    <p className="mt-8 text-base md:text-lg text-gray-600 leading-relaxed font-light">
                      Ribbu, your presence is like a soft summer breeze—warm, comforting, and full of life. You bring an irreplaceable warmth to the world, turning ordinary moments into extraordinary memories. Today is a celebration of your dreams, your kind heart, and the magic you bring into his life. May this year ahead be filled with laughter that echoes, dreams that come true, and endless moments where you feel as loved and cherished as you truly are.
                    </p>
                    <div className="mt-8 flex justify-center lg:justify-start">
                      <div className="inline-flex items-center gap-2 rounded-2xl bg-white/60 border border-pink-100 px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm backdrop-blur-md">
                        <span className="text-rose-gold-dark">🎂 July 21, 2026</span>
                        <span className="text-gray-300">|</span>
                        <span>✨ Made with Love</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

              </section>

              {/* INTERACTIVE REVEAL CARDS (Frosted Envelopes) */}
              <motion.section variants={itemVariants} className="mt-24 md:mt-32">
                <div className="text-center mb-12">
                  <span className="text-3xl">🎁</span>
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-gray-800 mt-2">
                    Click to Reveal Secrets
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 font-light">
                    Tap on each luxury card to read a handwritten note from the heart.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {cardData.map((card) => (
                    <motion.button
                      whileHover={{ y: -10, scale: 1.02, shadow: "0 20px 30px rgba(159,18,57,0.06)" }}
                      whileTap={{ scale: 0.98 }}
                      key={card.id}
                      onClick={() => setActiveModal(card)}
                      className={`group text-left border rounded-3xl p-8 cursor-pointer transition-all duration-300 glassmorphism-luxury shadow-md hover:border-rose-gold-dark/40 ${card.color}`}
                    >
                      {/* Wax Seal Visual element */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-md text-lg mb-6 border border-amber-600/30">
                        ❤️
                      </div>
                      <span className="text-xs font-bold tracking-wider uppercase block mb-1 text-rose-gold-dark/80">
                        {card.tag}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-gray-800 group-hover:text-rose-gold-dark transition-colors duration-300">
                        {card.title}
                      </h4>
                      <p className="mt-3 text-sm text-gray-500 font-light leading-relaxed">
                        {card.desc}
                      </p>
                      <div className="mt-8 flex items-center gap-1.5 text-xs font-semibold text-rose-gold-dark/70 group-hover:text-rose-gold-dark transition-colors duration-300">
                        <span>Read handwritten note</span>
                        <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                          →
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.section>

              {/* DYNAMIC CAKE BANNER BUTTON */}
              <motion.section variants={itemVariants} className="mt-28 pb-16 text-center">
                <div className="glassmorphism-luxury max-w-2xl mx-auto rounded-3xl p-8 border border-pink-100 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-[-30px] left-[-30px] w-24 h-24 bg-amber-100 rounded-full filter blur-xl" />
                  
                  <motion.span 
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="text-5xl inline-block"
                  >
                    🎂
                  </motion.span>
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-gray-800 mt-4">
                    Time for the Cake Cutting Ceremony!
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto font-light">
                    There is a special candle waiting to be blown out. Make a wish and let's cut the cake!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04, shadow: "0 10px 30px rgba(217,119,6,0.25)" }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setStage(3)}
                    className="mt-8 cursor-pointer rounded-2xl bg-gradient-to-r from-rose-gold-dark via-rose-gold to-amber-500 px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 border border-amber-600/20"
                  >
                    Enter Cake Cutting Stage 🍰✨
                  </motion.button>
                </div>
              </motion.section>

            </motion.main>

            {/* Footer */}
            <footer className="border-t border-rose-100/40 bg-white/20 py-8 text-center backdrop-blur-sm relative z-10">
              <p className="text-xs font-light text-gray-400">
                © 2026 Ribbca's Birthday Hub. All rights reserved. Made lovingly for Ribbu.
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STAGE 3: THE CAKE CUTTING CEREMONY */}
      <AnimatePresence>
        {stage === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.6 } }}
            className="relative z-10 w-full min-h-screen flex flex-col justify-between"
          >
            {/* Navigation Bar for Cake Ceremony */}
            <header className="sticky top-0 z-30 w-full px-6 py-4 md:px-12">
              <nav className="glassmorphism flex items-center justify-between rounded-2xl px-6 py-3 shadow-md max-w-3xl mx-auto border border-white/50 bg-white/30 backdrop-blur-xl">
                <motion.button
                  whileHover={{ x: -4 }}
                  onClick={() => {
                    stopMicDetection()
                    setStage(2)
                  }}
                  className="flex items-center gap-1.5 text-sm font-semibold text-rose-gold-dark hover:text-rose-gold transition-colors cursor-pointer"
                >
                  <span>←</span>
                  <span>Back to Spotlight</span>
                </motion.button>
                <span className="font-serif text-lg font-bold text-gradient-gold">
                  Cake Cutting 🎂
                </span>
              </nav>
            </header>

            {/* Main interactive area */}
            <main className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full px-6 py-6 text-center">
              
              {/* Instruction Box */}
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-800">
                  {!isCandleBlownOut 
                    ? "Make a Wish, Ribbu! 💫" 
                    : !isCakeCut 
                      ? "Now, Cut the Cake! 🔪" 
                      : "Happy Birthday, Ribbu! 🎉💖"}
                </h2>
                <p className="text-sm text-gray-500 mt-2 font-light">
                  {!isCandleBlownOut 
                    ? "Blow on your mic or tap the flame to extinguish it!" 
                    : !isCakeCut 
                      ? "Tap on the cake to make a slice!" 
                      : "May this year bring you endless happiness, health, and love!"}
                </p>
              </motion.div>

              {/* Interactive Cake Board */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20 }}
                className="relative flex flex-col items-center justify-center p-8 bg-white/40 rounded-3xl border border-white/60 glassmorphism w-full shadow-2xl mb-8"
              >
                
                {/* The Cake & Candle */}
                <div className="relative w-64 h-64 flex flex-col items-center justify-end select-none">
                  
                  {/* Flame (Flickering and animated) */}
                  {!isCandleBlownOut && (
                    <div 
                      onClick={blowOutCandle}
                      className="absolute bottom-40 w-4 h-16 bg-gradient-to-t from-pink-300 to-pink-400 rounded-full flex flex-col items-center cursor-pointer group z-10"
                      title="Click to blow out!"
                    >
                      {/* Wax lines */}
                      <div className="w-[2px] h-full bg-pink-100/60 ml-[1px]" />
                      {/* Flame wick */}
                      <div className="absolute -top-1 w-[2px] h-3 bg-stone-700" />
                      
                      {/* Outer Flame Glow */}
                      <div className="absolute -top-7 w-8 h-8 rounded-full bg-yellow-400/20 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform" />
                      {/* Flame Core */}
                      <div className="absolute -top-7 w-5 h-8 bg-gradient-to-t from-yellow-400 via-orange-500 to-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.8)] filter blur-[0.2px] group-hover:scale-105" />
                    </div>
                  )}

                  {/* Smoke when blown out but not cut yet */}
                  {isCandleBlownOut && !isCakeCut && (
                    <div className="absolute bottom-40 w-4 h-16 bg-stone-300 rounded-full flex flex-col items-center z-10">
                      {/* Wick */}
                      <div className="absolute -top-1.5 w-[2px] h-2 bg-stone-900" />
                      {/* Smoke Trail */}
                      <div className="absolute -top-5 w-1 h-5 bg-stone-400/40 rounded-full animate-pulse filter blur-[1px]" />
                    </div>
                  )}

                  {/* Cake Top Layer */}
                  <div 
                    onClick={isCandleBlownOut ? cutCake : blowOutCandle}
                    className={`w-36 h-12 bg-pink-300 rounded-t-2xl relative border-b-2 border-pink-400/30 flex items-center justify-around px-2 shadow-inner transition-transform duration-500 cursor-pointer ${
                      isCakeCut ? '-translate-x-4 border-r border-rose-300 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.1)]' : ''
                    }`}
                  >
                    <div className="w-3.5 h-3.5 bg-rose-500 rounded-full shadow-sm" />
                    <div className="w-3.5 h-3.5 bg-rose-500 rounded-full shadow-sm" />
                    <div className="w-3.5 h-3.5 bg-rose-500 rounded-full shadow-sm" />
                    
                    {isCakeCut && (
                      <div className="absolute inset-y-0 right-0 w-[4px] bg-amber-900/50 shadow-inner" />
                    )}
                  </div>

                  {/* Cake Middle Layer (with frosting drips) */}
                  <div 
                    onClick={isCandleBlownOut ? cutCake : blowOutCandle}
                    className={`w-44 h-14 bg-amber-50 relative border-b-2 border-amber-200/40 flex items-center justify-around shadow-sm transition-transform duration-500 cursor-pointer ${
                      isCakeCut ? 'translate-x-4 border-l border-amber-100 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.08)]' : ''
                    }`}
                  >
                    {/* Decorative frosting drip curves */}
                    <div className="absolute top-0 left-6 w-3.5 h-4.5 bg-amber-50 frosting-drip shadow-sm" />
                    <div className="absolute top-0 left-16 w-4 h-6.5 bg-amber-50 frosting-drip shadow-sm" />
                    <div className="absolute top-0 left-28 w-3.5 h-4.5 bg-amber-50 frosting-drip shadow-sm" />

                    <div className="w-4 h-4 bg-rose-400 rounded-full shadow-inner" />
                    <div className="w-4 h-4 bg-rose-400 rounded-full shadow-inner" />

                    {isCakeCut && (
                      <div className="absolute inset-y-0 left-0 w-[4px] bg-amber-950/60 shadow-inner" />
                    )}
                  </div>

                  {/* Cake Bottom Layer */}
                  <div 
                    onClick={isCandleBlownOut ? cutCake : blowOutCandle}
                    className={`w-52 h-16 bg-pink-400 rounded-b-lg relative flex items-center justify-around border-t border-pink-300 shadow-md transition-transform duration-500 cursor-pointer ${
                      isCakeCut ? '-translate-x-4 border-r border-rose-400 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.15)]' : ''
                    }`}
                  >
                    <div className="absolute top-2 left-6 w-2.5 h-1 bg-yellow-200 rounded-full rotate-45" />
                    <div className="absolute top-4 left-18 w-2.5 h-1 bg-teal-200 rounded-full -rotate-12" />
                    <div className="absolute top-2 left-32 w-2.5 h-1 bg-amber-200 rounded-full rotate-30" />
                    <div className="absolute top-4 left-42 w-2.5 h-1 bg-yellow-100 rounded-full -rotate-45" />
                    
                    {isCakeCut && (
                      <div className="absolute inset-y-0 right-0 w-[4px] bg-amber-900/60 shadow-inner" />
                    )}
                  </div>

                  {/* Plate with Gold Rim */}
                  <div className="w-64 h-3 bg-stone-100 rounded-full shadow-md border-t-2 border-amber-400 relative">
                    {/* Inner gold circular line */}
                    <div className="absolute inset-x-4 inset-y-[1px] border border-amber-300/40 rounded-full pointer-events-none" />
                  </div>
                  <div className="w-24 h-6 bg-stone-200 rounded-b-2xl shadow-inner border-t border-stone-300/30" />
                </div>

                {/* Slicing Knife with bounce */}
                {isCandleBlownOut && !isCakeCut && (
                  <motion.div 
                    animate={{ y: [0, -12, 0], rotate: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                    className="absolute top-20 right-16 text-3xl pointer-events-none drop-shadow-md z-25"
                    title="Tap cake to cut!"
                  >
                    🔪
                  </motion.div>
                )}
                
                {/* Golden Slice Glow Line */}
                {isCandleBlownOut && !isCakeCut && (
                  <div className="absolute bottom-[44px] w-[2px] h-[130px] bg-gradient-to-t from-transparent via-amber-400 to-transparent shadow-[0_0_10px_#f59e0b] animate-pulse pointer-events-none" />
                )}
              </motion.div>

              {/* Micro Controller Box */}
              <div className="w-full">
                {!isCandleBlownOut ? (
                  <div className="flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.05, shadow: "0 5px 15px rgba(0,0,0,0.08)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={isListening ? stopMicDetection : startMicDetection}
                      className={`px-5 py-3 cursor-pointer rounded-2xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-md ${
                        isListening
                          ? 'bg-rose-gold-dark text-white animate-pulse'
                          : 'bg-white hover:bg-stone-50 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {isListening ? 'Stop Mic 🎤' : 'Use Microphone 🎤'}
                    </motion.button>

                    {/* Dynamic Audio Waveform Visualizer */}
                    {isListening && (
                      <div className="mt-5 flex flex-col items-center w-full max-w-[240px]">
                        <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Blowing Input Wave</span>
                        <div className="flex items-center justify-center h-8 mt-2">
                          {[...Array(9)].map((_, i) => {
                            // Synthesize height fluctuations based on micLevel
                            const factor = 1 - Math.abs(i - 4) * 0.18; // peak center
                            const h = isListening ? Math.max(4, micLevel * 0.7 * factor * (Math.random() * 0.4 + 0.8)) : 4;
                            return (
                              <div
                                key={i}
                                className="waveform-bar"
                                style={{ height: `${h}px` }}
                              />
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {micError && (
                      <p className="mt-3 text-xs text-rose-gold-dark font-medium leading-relaxed max-w-[280px]">
                        Mic permission blocked. Don't worry! You can **tap the candle flame** directly to blow it out. 💨
                      </p>
                    )}

                    {!isListening && !micError && (
                      <button 
                        onClick={blowOutCandle}
                        className="mt-4 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        Or, tap flame to blow out manually 💨
                      </button>
                    )}
                  </div>
                ) : !isCakeCut ? (
                  <div className="flex flex-col items-center">
                    <motion.button
                      whileHover={{ scale: 1.05, shadow: "0 10px 20px rgba(0,0,0,0.15)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={cutCake}
                      className="px-6 py-3.5 cursor-pointer rounded-2xl bg-gray-900 text-white hover:bg-gray-800 text-sm font-semibold tracking-wide transition-all shadow-md"
                    >
                      Cut the Cake! 🔪🍰
                    </motion.button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="glassmorphism-luxury p-6 rounded-2xl border border-pink-100 max-w-sm mb-4"
                    >
                      <p className="font-serif italic text-base text-gray-700 leading-relaxed">
                        "Happy Birthday to the one who makes his world brighter. May your year be filled with sweetest moments, Ribbu!"
                      </p>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={resetCakeCeremony}
                      className="px-5 py-2.5 cursor-pointer rounded-xl bg-white hover:bg-stone-50 text-gray-600 border border-gray-200 text-xs font-medium transition-all shadow-sm"
                    >
                      Reset Ceremony 🔄
                    </motion.button>
                  </div>
                )}
              </div>

            </main>

            {/* Ceremony Footer */}
            <footer className="py-6 text-center relative z-10">
              <p className="text-[10px] font-light text-gray-400">
                For Ribbu on July 21, 2026. Made with love.
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SLEEK CUSTOM ENVELOPE MODAL */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-stone-900/20 backdrop-blur-md"
            />
            
            {/* Stationery Envelope Card Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 50 }}
              transition={{ type: 'spring', damping: 24, stiffness: 120 }}
              className="relative w-full max-w-lg transform rounded-3xl bg-[#fffdfa] p-8 md:p-10 shadow-2xl border-4 border-double border-rose-200/60 z-10 overflow-hidden"
            >
              {/* Gold foil decorative line on envelope */}
              <div className="absolute top-0 inset-x-0 h-1.5 gold-foil" />
              
              <div className="flex flex-col relative z-10">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200/50">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-amber-500">💌</span>
                    <span className="text-xs font-bold tracking-widest uppercase text-rose-gold-dark/70">
                      Handwritten Note
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveModal(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-50 text-gray-400 hover:bg-stone-100 hover:text-gray-600 transition-colors cursor-pointer border border-stone-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-8 text-center px-2 py-4">
                  <p className="font-serif text-xl md:text-2xl leading-loose text-gray-800 italic font-light">
                    "{activeModal.detail}"
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-stone-100 flex justify-between items-center">
                  <span className="font-serif italic text-xs text-gray-400">Written with love, for Ribbu</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveModal(null)}
                    className="cursor-pointer rounded-xl bg-rose-gold-dark px-5 py-2.5 text-xs font-semibold text-white hover:bg-rose-gold-dark/90 transition-colors shadow-sm border border-rose-gold-dark/20"
                  >
                    Fold Letter ✉️
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
