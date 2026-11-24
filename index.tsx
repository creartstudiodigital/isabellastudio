import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { CitaDrawer } from "@/components/salon/CitaDrawer";
import { HeroCarousel } from "@/components/salon/HeroCarousel";
import { Icon, SvgSprite } from "@/components/salon/Icons";
import { LaserSection } from "@/components/salon/LaserOptions";
import { ServiceMenu } from "@/components/salon/ServiceMenu";
import { VideoCarousel } from "@/components/salon/VideoCarousel";
import {
  CATS,
  HANDLE,
  INSTAGRAM_URL,
  MAPS_ADDRESS_URL,
  MAPS_SALON_URL,
  RIBBON_WORDS,
  TIKTOK_URL,
  WA_NUMBER,
  WA_PHONE_LABEL,
  minPrice,
  waLink,
  type CitaItem,
  type Currency,
  type LaserKind,
} from "@/lib/salon";
import { img } from "@/lib/salon-images";

const TITLE = "Isa'Bella Studio · Salón de belleza en Calicanto, Maracay";
const DESCRIPTION =
  "Estilismo, uñas, pestañas, cejas, depilación y láser Candela® en Calicanto, Maracay. Arma tu cita, mira los precios y resérvala por WhatsApp. Aceptamos Cashea.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  ["especialidades", "Especialidades"],
  ["menu", "Precios"],
  ["laser", "Láser"],
  ["tiktok", "Síguenos"],
  ["contacto", "Contacto"],
] as const;

const WA_PLAIN = `https://wa.me/${WA_NUMBER}`;
const WA_BOOK = waLink("Hola Isa'Bella Studio, quiero reservar una cita");

function Index() {
  const [cita, setCita] = useState<CitaItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [cur, setCur] = useState(CATS[0]?.id ?? "");
  const [laserKind, setLaserKind] = useState<LaserKind>("mujer");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState({ text: "", show: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const menuRef = useRef<HTMLElement>(null);

  const say = useCallback((text: string) => {
    setToast({ text, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 1700);
  }, []);

  const isOn = useCallback((name: string) => cita.some((i) => i.name === name), [cita]);
  const toggle = (cur: Currency) => (name: string, price: number) => {
    if (isOn(name)) {
      setCita((c) => c.filter((i) => i.name !== name));
      say("Quitado de tu cita");
    } else {
      setCita((c) => [...c, { name, price, cur }]);
      say("Agregado a tu cita");
    }
  };
  const remove = (name: string) => setCita((c) => c.filter((i) => i.name !== name));
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const selectCat = (id: string) => {
    setCur(id);
    setQuery("");
  };

  // highlight the nav link of the section in view
  useEffect(() => {
    const spy = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    return () => spy.disconnect();
  }, []);

  const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <>
      <SvgSprite />

      <div className="topbar">
        <div className="wrap">
          <span>✦ Aceptamos <b>Cashea</b>: paga en cuotas sin intereses</span>
          <div className="tl">
            <a href={WA_PLAIN} target="_blank" rel="noopener"><Icon id="wa" />{WA_PHONE_LABEL}</a>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener"><Icon id="ig" />{HANDLE}</a>
          </div>
        </div>
      </div>

      <nav className="nav">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="Isa'Bella Studio, inicio"><img src={img("logo-magenta")} alt="" /></a>
          <div className={`links${menuOpen ? " open" : ""}`}>
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} className={active === id ? "on" : undefined} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
          </div>
          <a className="btn btn-mag btn-sm" href={WA_BOOK} target="_blank" rel="noopener"><Icon id="wa" />Reservar</a>
          <button className="cart-btn" aria-label="Ver mi cita" onClick={() => setDrawerOpen(true)}>
            <Icon id="bag" />
            <span className={`badge${cita.length ? " show" : ""}`}>{cita.length}</span>
          </button>
          <button className="menu-btn" aria-label="Abrir menú" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          </button>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="wrap">
          <div>
            <div className="hero-brand">Isa'bella<small>STUDIO</small></div>
            <span className="kicker">Calicanto · Maracay</span>
            <h1>Nos enfocamos en <span className="script">realzar</span> tu belleza</h1>
            <p className="lead">Estilismo, uñas, pestañas, cejas, depilación y láser Candela®. Arma tu cita, elige tus servicios y te la confirmamos por WhatsApp.</p>
            <div className="cta">
              <a className="btn btn-mag" href="#menu">Armar mi cita</a>
              <a className="btn btn-gold" href="#laser">Depilación láser</a>
              <a className="btn btn-ghost" href={waLink("Hola Isa'Bella Studio, quiero información")} target="_blank" rel="noopener"><Icon id="wa" />Escríbenos</a>
            </div>
            <a className="hero-cashea" href="#cashea-info">
              <img src={img("cashea")} alt="Cashea" />
              <div><b>Aceptamos Cashea</b><span>Paga tus servicios en cuotas sin intereses</span></div>
            </a>
          </div>
          <HeroCarousel />
        </div>
      </header>

      <div className="ribbon" aria-hidden="true">
        <div className="rtrack">
          {[...RIBBON_WORDS, ...RIBBON_WORDS].map((w, i) => <span key={i}>{w}</span>)}
        </div>
      </div>

      <main>
        <section className="sec wrap" id="especialidades">
          <div className="head">
            <div><span className="kicker">Lo que hacemos</span><h2>Nuestras <span className="script">especialidades</span></h2></div>
            <p className="lead aside">Toca una especialidad para ver sus precios.</p>
          </div>
          <div className="specs">
            {CATS.map((c) => (
              <button
                key={c.id}
                className="spec"
                onClick={() => {
                  selectCat(c.id);
                  menuRef.current?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth" });
                }}
              >
                <img src={img(c.img)} alt="" loading="lazy" />
                <div><h3>{c.name}</h3><small>{c.sub} · desde {minPrice(c)} €</small></div>
              </button>
            ))}
          </div>
        </section>

        <section className="sec wrap" id="menu" ref={menuRef}>
          <div className="head">
            <div><span className="kicker">Menú y precios</span><h2>Arma tu <span className="script">cita</span></h2></div>
            <p className="lead aside wide">Pulsa <b className="mag">+</b> en los servicios que quieras. Verás el total y podrás enviarlo por WhatsApp.</p>
          </div>
          <ServiceMenu cur={cur} query={query} onSelect={selectCat} onQuery={setQuery} isOn={isOn} onToggle={toggle("€")} />
          <p className="note">Precios en euros (€). Sujetos a cambio.</p>
        </section>

        <div className="laser" id="laser">
          <section className="sec wrap">
            <LaserSection isOn={isOn} onToggle={toggle("$")} kind={laserKind} onKind={setLaserKind} />
            <div className={`lz-machine${laserKind === "hombre" ? " hombre" : ""}`}>
              <img
                src={img(laserKind === "mujer" ? "gentlemax-pro-laser" : "depilador-hombre")}
                alt={
                  laserKind === "mujer"
                    ? "Aparato de depilación láser GentleMax Pro de Candela"
                    : "Depilación láser en axila de hombre con el aparato GentleMax Pro de Candela"
                }
                loading="lazy"
              />
            </div>
            <p className="note">Paquetes láser en dólares ($). Puedes pagarlos con Cashea en cuotas sin intereses.</p>
          </section>
        </div>

        <section className="sec wrap" id="tiktok">
          <div className="tiktok">
            <div>
              <span className="kicker">Síguenos</span>
              <h2 className="h2-gap">Mira lo nuevo en <span className="script">TikTok e Instagram</span></h2>
              <p className="lead">Transformaciones, diseños de uñas y el antes y después de nuestras clientas. Síguenos para ver nuestros trabajos más recientes.</p>
              <div className="handles">
                <a className="handle" href={TIKTOK_URL} target="_blank" rel="noopener"><i><Icon id="tt" /></i><div><b>TikTok</b><small>{HANDLE}</small></div></a>
                <a className="handle" href={INSTAGRAM_URL} target="_blank" rel="noopener"><i className="ig"><Icon id="ig" /></i><div><b>Instagram</b><small>{HANDLE}</small></div></a>
              </div>
            </div>
            <VideoCarousel />
          </div>

          <div className="cashea" id="cashea-info">
            <div className="lb"><img src={img("cashea")} alt="Cashea" /></div>
            <div>
              <h2>Págalo con Cashea, <span className="script">sin intereses</span></h2>
              <p>Disfruta tus servicios hoy y págalos en cuotas sin intereses. Pregúntanos al reservar.</p>
            </div>
            <a className="btn btn-gold" href={waLink("Hola, quiero pagar con Cashea")} target="_blank" rel="noopener">Quiero pagar con Cashea</a>
          </div>
        </section>

        <section className="sec wrap" id="contacto">
          <div className="visit">
            <div className="vpair">
              <div className="vimg"><img src={img("local")} alt="Fachada de Isa'Bella Studio en Calicanto" /></div>
              <a className="vimg vmap" href={MAPS_SALON_URL} target="_blank" rel="noopener">
                <img src={img("mapa")} alt="Mapa de Isa'Bella Studio en Calle López Aveledo, Calicanto" loading="lazy" />
                <span><Icon id="pin" />Cómo llegar</span>
              </a>
            </div>
            <div>
              <span className="kicker">Contacto</span>
              <h2 className="h2-gap">Te esperamos en <span className="script">Calicanto</span></h2>
              <div className="cards">
                <a className="card" href={WA_PLAIN} target="_blank" rel="noopener">
                  <i className="wa"><Icon id="wa" /></i>
                  <div><small>WhatsApp</small><b>wa.me/{WA_NUMBER}</b><br /><span className="sub">{WA_PHONE_LABEL}</span></div>
                  <span className="arrow"><Icon id="arrow" /></span>
                </a>
                <a className="card" href={TIKTOK_URL} target="_blank" rel="noopener">
                  <i className="tt"><Icon id="tt" /></i>
                  <div><small>TikTok</small><b>{HANDLE}</b></div>
                  <span className="arrow"><Icon id="arrow" /></span>
                </a>
                <a className="card" href={INSTAGRAM_URL} target="_blank" rel="noopener">
                  <i className="igc"><Icon id="ig" /></i>
                  <div><small>Instagram</small><b>{HANDLE}</b></div>
                  <span className="arrow"><Icon id="arrow" /></span>
                </a>
                <a className="card" href={MAPS_ADDRESS_URL} target="_blank" rel="noopener">
                  <i><Icon id="pin" /></i>
                  <div><small>Dirección</small><b>Calle López Aveledo, frente a la panadería Royal III</b><br /><span className="sub">Calicanto, Maracay, Edo. Aragua</span></div>
                  <span className="arrow"><Icon id="arrow" /></span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <img src={img("logo-magenta")} alt="Isa'Bella Studio" />
          <p>Estilismo · Uñas · Pestañas · Cejas · Depilación · Láser Candela®<br />Aceptamos Cashea, cuotas sin intereses.</p>
        </div>
      </footer>

      <div className="fab">
        <a className="w" href={WA_BOOK} target="_blank" rel="noopener" aria-label="WhatsApp"><Icon id="wa" /></a>
      </div>

      <CitaDrawer open={drawerOpen} items={cita} onClose={closeDrawer} onRemove={remove} />
      <div className={`toast${toast.show ? " show" : ""}`} role="status">{toast.text}</div>
    </>
  );
}
