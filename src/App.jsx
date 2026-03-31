import { useState, useEffect } from 'react'
import './App.css'

// ─── DATOS ────────────────────────────────────────────────────────────────────

const PROYECTOS = [
  {
    id: 1,
    categoria: 'FICCIÓN BREVE',
    youtubeId: 'fUffj-IBBik',
    titulo: 'Short Film GUERNICA',
    rol: 'Asist. Dirección',
  },
  {
    id: 2,
    categoria: 'DOCUMENTAL',
    youtubeId: 'U6loD5FPbgI',
    titulo: 'EL HOMBRE DEL AGUA: El Legado de Juan Carlos Mulinetti',
    rol: 'Dirección / Edición',
  },
  {
    id: 3,
    categoria: 'EN VIVO',
    youtubeId: 'cBdhitrcz0E',
    titulo: 'Cable en Festival Ribera VIVO',
    rol: 'Cámara / Edición',
  },
  {
    id: 4,
    categoria: 'EVENTOS',
    youtubeId: 'Cn80p3LOzUE',
    titulo: 'Quince años',
    rol: 'Edición',
  },
]

// Archivos en /public — patrón video/foto alternado
const REDES_BASE = [
  { id: 1, tipo: 'video',  src: '/carousel-1-video.mp4', alt: 'Redes 1' },
  { id: 2, tipo: 'imagen', src: '/carousel-2.jpg',        alt: 'Redes 2' },
  { id: 3, tipo: 'video',  src: '/carousel-3-video.mp4', alt: 'Redes 3' },
  { id: 4, tipo: 'imagen', src: '/carousel-4.jpg',        alt: 'Redes 4' },
  { id: 5, tipo: 'video',  src: '/carousel-5-video.mp4', alt: 'Redes 5' },
  { id: 6, tipo: 'imagen', src: '/carousel-6.jpg',        alt: 'Redes 6' },
]

const SERVICIOS = [
  {
    id: 1,
    titulo: 'Producción',
    desc: 'Registro y construcción de imagen en distintos contextos, desde eventos hasta proyectos audiovisuales.',
  },
  {
    id: 2,
    titulo: 'Edición',
    desc: 'Montaje y construcción de sentido a través del ritmo, la imagen y el tiempo. Edición de piezas pensadas para distintos formatos y plataformas.',
  },
  {
    id: 3,
    titulo: 'Fotografía',
    desc: 'Imagen fija como extensión del lenguaje audiovisual, cuidando composición, luz y detalle.',
  },
  {
    id: 4,
    titulo: 'Contenido digital',
    desc: 'Desarrollo de piezas pensadas para circular, captar atención y generar interacción en redes.',
  },
]

// ─── ICONOS ───────────────────────────────────────────────────────────────────

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const IconBehance = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.5 11.5c.9 0 1.6-.7 1.6-1.6S8.4 8.3 7.5 8.3H4.8v3.2h2.7zm.3 2.2H4.8v3.5h3c1 0 1.8-.8 1.8-1.75s-.8-1.75-1.8-1.75zM3 6.5h5c1.9 0 3.4 1.3 3.4 3 0 1-.5 1.9-1.3 2.4 1.1.5 1.9 1.6 1.9 2.8 0 1.9-1.6 3.3-3.6 3.3H3V6.5zm12.5 4c-1.7 0-3 1.1-3.2 2.6h6.2c-.1-1.5-1.3-2.6-3-2.6zm3.2 4.5c-.4.9-1.3 1.5-2.4 1.5-1.3 0-2.3-.7-2.7-1.8h6.5c.1-.3.1-.6.1-1 0-2.7-2-4.7-4.7-4.7-2.8 0-4.7 2-4.7 4.7s2 4.7 4.7 4.7c1.9 0 3.5-1 4.3-2.4h-1.1zm-3.2-9h4.5v1H15.5v-1z"/>
  </svg>
)

const IconLinkedin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const IconPlayBtn = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="26" fill="rgba(0,0,0,0.55)" />
    <polygon points="20,14 40,26 20,38" fill="white" />
  </svg>
)

const IconPlayHero = () => (
  <svg width="18" height="18" viewBox="0 0 14 14" fill="currentColor">
    <polygon points="2,1 12,7 2,13" />
  </svg>
)

const IconClose = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
// Soporta tres tipos: 'youtube' | 'video' | 'imagen'

function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Cerrar">
        <IconClose />
      </button>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {item.tipo === 'youtube' ? (
          <iframe
            className="lightbox-iframe"
            src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={item.titulo || 'Video'}
          />
        ) : item.tipo === 'video' ? (
          <video src={item.src} autoPlay controls className="lightbox-media" />
        ) : (
          <img src={item.src} alt={item.alt} className="lightbox-media" />
        )}
      </div>
    </div>
  )
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar-logo">Portfolio</span>
    </nav>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="hero">
      <video className="hero-video" autoPlay muted loop playsInline>
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1 className="hero-title">
          <span>MOVIMIENTO</span>
          <span className="accent">RITMO</span>
          <span>NARRATIVA</span>
        </h1>
        <p className="hero-subtitle">
          Creación y edición audiovisual para proyectos,<br />
          marcas y narrativas digitales.
        </p>
        <a href="#proyectos" className="hero-btn">
          <IconPlayHero />
          Ver trabajos
        </a>
      </div>
    </section>
  )
}

// ─── PROYECTOS ────────────────────────────────────────────────────────────────

function Proyectos({ onOpenLightbox }) {
  return (
    <section className="section-dark proyectos" id="proyectos">
      <div className="seccion-header">
        <h2 className="section-title">PROYECTOS</h2>
        <p className="section-sub">
          Exploraciones audiovisuales en distintos formatos,<br />
          entre lo narrativo, lo documental y lo digital.
        </p>
      </div>

      <div className="proyectos-grid">
        {PROYECTOS.map((p) => (
          <button
            key={p.id}
            className={`proyecto-card proyecto-card-${p.id}`}
            style={{
              backgroundImage: `url(https://img.youtube.com/vi/${p.youtubeId}/maxresdefault.jpg)`,
            }}
            onClick={() =>
              onOpenLightbox({ tipo: 'youtube', youtubeId: p.youtubeId, titulo: p.titulo })
            }
            aria-label={`Ver ${p.titulo}`}
          >
            {/* Gradiente base */}
            <div className="proyecto-base-overlay" />

            {/* Ícono play visible siempre */}
            <span className="proyecto-play-icon">
              <IconPlayBtn />
            </span>

            {/* Label de categoría (se oculta en hover) */}
            <span className="proyecto-cat">{p.categoria}</span>

            {/* Overlay hover con información del proyecto */}
            <div className="proyecto-hover-info">
              <span className="proyecto-hover-cat">{p.categoria}</span>
              <p className="proyecto-hover-titulo">{p.titulo}</p>
              <p className="proyecto-hover-rol">{p.rol}</p>
              <span className="proyecto-hover-cta">▶ Ver video</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

// ─── CONTENIDO PARA REDES ─────────────────────────────────────────────────────

function ContenidoRedes({ onOpenLightbox }) {
  return (
    <section className="section-dark redes" id="redes">
      <div className="seccion-header">
        <h2 className="section-title">CONTENIDO PARA REDES</h2>
        <p className="section-sub">
          Desarrollo de piezas pensadas para circular,<br />
          captar la atención y generar interacción en redes.
        </p>
      </div>

      <div className="redes-scroll-wrapper">
        <div className="redes-scroll">
          {REDES_BASE.map((item) => (
            <button
              key={item.id}
              className="redes-card"
              onClick={() =>
                onOpenLightbox({ tipo: item.tipo, src: item.src, alt: item.alt })
              }
              aria-label={`Ver ${item.alt}`}
            >
              {item.tipo === 'video' ? (
                <video
                  src={item.src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="redes-media"
                />
              ) : (
                <img src={item.src} alt={item.alt} className="redes-media" />
              )}
              <div className="redes-card-hover">
                <span className="redes-zoom-icon">⊕</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SOBRE MÍ ─────────────────────────────────────────────────────────────────

function SobreMi() {
  return (
    <section className="sobre-mi" id="sobre-mi">
      <div className="sm-layout">
        <div className="sm-card">

          {/* ── Columna izquierda ── */}
          <div className="sm-left">

            <div className="sm-foto-wrap">
              <img src="/bg-perfil.png" alt="" className="sm-bg" aria-hidden="true" />
              <img src="/perfil.jpeg" alt="Micaela Pereyra" className="sm-foto" />
              <div className="sm-foto-leyenda">
                <p className="sm-nombre">
                  <span className="sm-nombre-first">Micaela</span>
                  <span className="sm-nombre-last">Pereyra</span>
                </p>
                <p className="sm-rol">Realizadora audiovisual.</p>
              </div>
            </div>

            <div className="sm-meta">
              <span>24 años</span>
              <span>Villa María, Cba.</span>
            </div>
          </div>

          {/* ── Columna derecha ── */}
          <div className="sm-right">
            <h2 className="sm-titulo">SOBRE MI</h2>

            <p className="sm-texto">
              Me especializo en la <span className="hl-blue">creación y edición de contenido audiovisual</span>,
              <br />
              explorando cómo cada pieza puede{' '}
              <span className="hl-yellow">generar impacto</span>,{' '}
              <span className="hl-accent">identidad</span>
              <br />
              y conexión en entornos digitales.
            </p>

            <p className="sm-texto">
              Desde la captura hasta el montaje, busco que cada proyecto
              <br />
              tenga intención, estética y dirección.
            </p>

            <div className="sm-herramientas">
              <span className="sm-h-titulo">HERRAMIENTAS</span>
              <p className="sm-h-lista">
                Premiere Pro · After Effects · DaVinci Resolve<br />
                Illustrator · Photoshop
              </p>
            </div>

            <div className="sm-stats">
              <div className="sm-stat">
                <span className="sm-stat-n">+5</span>
                <span className="sm-stat-l">años creando</span>
              </div>
              <div className="sm-stat">
                <span className="sm-stat-n">+9</span>
                <span className="sm-stat-l">proyectos</span>
              </div>
              <div className="sm-stat">
                <span className="sm-stat-n">1</span>
                <span className="sm-stat-l">premio</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── SERVICIOS ────────────────────────────────────────────────────────────────

function Servicios() {
  return (
    <section className="servicios" id="servicios">
      {/* Overlay oscuro sobre la imagen de fondo */}
      <div className="servicios-overlay" aria-hidden="true" />

      <div className="seccion-header">
        <h2 className="section-title servicios-main-title">SERVICIOS</h2>
      </div>

      <div className="container servicios-contenido">
        <div className="servicios-grid">
          {SERVICIOS.map((s) => (
            <div key={s.id} className="servicio">
              <h3 className="servicio-titulo">{s.titulo}</h3>
              <p className="servicio-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── HABLEMOS ─────────────────────────────────────────────────────────────────

function Hablemos() {
  return (
    <section className="hablemos" id="hablemos">
      <div className="container hablemos-inner">
        <h2 className="hablemos-titulo">HABLEMOS</h2>
        <p className="hablemos-sub">
          ¿Tenes un proyecto en mente?<br />
          Podemos darle forma.
        </p>
        <a href="mailto:micapryr@gmail.com" className="hablemos-btn">
          ✉&nbsp; micapryr@gmail.com
        </a>
        <div className="hablemos-social">
          <a href="https://www.instagram.com/micapryr/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon">
            <IconInstagram />
          </a>
          <a href="https://www.behance.net/micapryr" target="_blank" rel="noopener noreferrer" aria-label="Behance" className="social-icon">
            <IconBehance />
          </a>
          <a href="https://www.linkedin.com/in/micapryr/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon">
            <IconLinkedin />
          </a>
        </div>
      </div>
      <div className="hablemos-shapes" aria-hidden="true">
        <div className="hs hs-blue" />
        <div className="hs hs-yellow" />
        <div className="hs hs-red" />
        <div className="hs hs-green" />
      </div>
    </section>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [lightboxItem, setLightboxItem] = useState(null)

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll(
      '.proyectos .seccion-header, .proyecto-card, .redes .seccion-header, .redes-card, .sm-left, .sm-right, .servicios .seccion-header, .servicio, .hablemos-inner'
    ))

    const applyStagger = (selector, step, maxDelayIndex = 6) => {
      document.querySelectorAll(selector).forEach((el, i) => {
        const index = Math.min(i, maxDelayIndex)
        el.style.setProperty('--reveal-delay', `${index * step}ms`)
      })
    }

    applyStagger('.proyecto-card', 70, 3)
    applyStagger('.redes-card', 60, 5)
    applyStagger('.servicio', 90, 3)

    targets.forEach((el) => el.classList.add('reveal-on-scroll'))

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
    )

    targets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let ticking = false

    const updateOnScroll = () => {
      const scrollY = window.scrollY || 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(scrollY / scrollable, 1) : 0
      const heroShift = Math.min(scrollY, 420) * 0.08

      document.documentElement.style.setProperty('--scroll-progress', progress.toFixed(4))
      document.documentElement.style.setProperty('--hero-shift', `${heroShift}px`)
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(updateOnScroll)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateOnScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <Navbar />
      <Hero />
      <Proyectos onOpenLightbox={setLightboxItem} />
      <ContenidoRedes onOpenLightbox={setLightboxItem} />
      <SobreMi />
      <Servicios />
      <Hablemos />
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  )
}
