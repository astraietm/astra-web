import { useState, type CSSProperties, type FormEvent, type ReactNode } from "react";

import "./section-elements.css";

const bentoQr = new URL("./assets/bento-11-qr.svg", import.meta.url).href;
const testimonialIllustration = new URL("./assets/testimonials-illustration.svg", import.meta.url).href;
const testimonialKeyboard = new URL("./assets/testimonials-keyboard.svg", import.meta.url).href;
const testimonialDots = new URL("./assets/testimonials-dots.svg", import.meta.url).href;

export type SectionCompositionProps = {
  className?: string;
  style?: CSSProperties;
};

function classNames(base: string, className?: string) {
  return className ? `${base} ${className}` : base;
}

function GlassPill({ children }: { children: ReactNode }) {
  return (
    <span className="section-label">
      <span className="section-label__title">{children}</span>
      <span className="section-label__circle" aria-hidden="true" />
    </span>
  );
}

function SectionButton({ children = "Sign up", className = "", type = "button" }: { children?: ReactNode; className?: string; type?: "button" | "submit" }) {
  return (
    <button className={`section-button ${className}`.trim()} type={type}>
      <span className="section-button__title">{children}</span>
      <span className="section-button__circle" aria-hidden="true" />
    </button>
  );
}

/* the only section composition offered on both grounds, so it is the only one
   that takes a mode; the rest stay on the dark ground they were authored for */
export function DarkGlassButton({ className, style, mode = "dark", children }: SectionCompositionProps & { mode?: "light" | "dark"; children?: ReactNode }) {
  return (
    <div className={classNames("section-element section-element--glass-button", className)} data-mode={mode} style={style}>
      <SectionButton>{children ?? "Claim Event Pass ↗"}</SectionButton>
    </div>
  );
}

const orbitIcons = [
  <path key="phone" d="M14.25 2A3.75 3.75 0 0 1 18 5.75v12.5A3.75 3.75 0 0 1 14.25 22h-4.5A3.75 3.75 0 0 1 6 18.25V5.75A3.75 3.75 0 0 1 9.75 2h4.5zm0 1.5h-4.5A2.25 2.25 0 0 0 7.5 5.75v12.5a2.25 2.25 0 0 0 2.25 2.25h4.5a2.25 2.25 0 0 0 2.25-2.25V5.75a2.25 2.25 0 0 0-2.25-2.25zM13.5 17.5a.75.75 0 1 1 0 1.5h-3a.75.75 0 1 1 0-1.5h3z" />,
  <path key="laptop" d="M16.25 3.5A3.75 3.75 0 0 1 20 7.25v6.5a3.75 3.75 0 0 1-3.75 3.75h-8.5A3.75 3.75 0 0 1 4 13.75v-6.5A3.75 3.75 0 0 1 7.75 3.5h8.5zm0 1.5h-8.5A2.25 2.25 0 0 0 5.5 7.25v6.5a2.25 2.25 0 0 0 2.25 2.25h8.5a2.25 2.25 0 0 0 2.25-2.25v-6.5A2.25 2.25 0 0 0 16.25 5zm5 14.25a.75.75 0 1 1 0 1.5H2.75a.75.75 0 1 1 0-1.5h18.5z" />,
  <path key="wifi" d="M5.11 10.61a9.75 9.75 0 0 1 13.78 0l-1.06 1.06a8.25 8.25 0 0 0-11.66 0l-1.06-1.06zm2.47 2.47a6.25 6.25 0 0 1 8.84 0l-1.06 1.06a4.75 4.75 0 0 0-6.72 0l-1.06-1.06zM12 15.75a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 1 1 0-3.5z" />,
  <path key="lock" d="M12 2a5 5 0 0 1 5 5v2.75h-1.5V7A3.5 3.5 0 0 0 12 3.5 3.5 3.5 0 0 0 8.5 7v2.75H7V7a5 5 0 0 1 5-5zm4.25 7.25A3.75 3.75 0 0 1 20 13v4.25A3.75 3.75 0 0 1 16.25 21h-8.5A3.75 3.75 0 0 1 4 17.25V13a3.75 3.75 0 0 1 3.75-3.75h8.5zm0 1.5h-8.5A2.25 2.25 0 0 0 5.5 13v4.25a2.25 2.25 0 0 0 2.25 2.25h8.5a2.25 2.25 0 0 0 2.25-2.25V13a2.25 2.25 0 0 0-2.25-2.25zM12 13.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 1 1 0-3.5z" />,
  <path key="scan" d="M8.75 3a.75.75 0 0 1 0 1.5H7A2.5 2.5 0 0 0 4.5 7v1.75a.75.75 0 0 1-1.5 0V7A4 4 0 0 1 7 3h1.75zm6.5 0H17a4 4 0 0 1 4 4v1.75a.75.75 0 1 1-1.5 0V7A2.5 2.5 0 0 0 17 4.5h-1.75a.75.75 0 1 1 0-1.5zM3.75 14.5a.75.75 0 0 1 .75.75V17A2.5 2.5 0 0 0 7 19.5h1.75a.75.75 0 1 1 0 1.5H7a4 4 0 0 1-4-4v-1.75a.75.75 0 0 1 .75-.75zm16.5 0a.75.75 0 0 1 .75.75V17a4 4 0 0 1-4 4h-1.75a.75.75 0 1 1 0-1.5H17a2.5 2.5 0 0 0 2.5-2.5v-1.75a.75.75 0 0 1 .75-.75zM13 9.5a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 9.5 13v-2A1.5 1.5 0 0 1 11 9.5h2z" />,
  <path key="check" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 1 0 0-17zm2.42 5.525a.75.75 0 1 1 1.161.95l-4.5 5.5a.75.75 0 0 1-1.111.055l-2-2A.75.75 0 0 1 9.03 12.47l1.414 1.413 3.976-4.858z" />,
];

function PairingIllustration() {
  const angles = [-120, -60, 180, 0, 120, 60];
  return (
    <div className="section-pairing">
      <div className="section-pairing__stage">
        <div className="section-pairing__orbit">
          {orbitIcons.map((icon, index) => (
            <span
              className="section-pairing__social"
              key={angles[index]}
              style={{ "--angle": `${angles[index]}deg` } as CSSProperties}
            >
              <span className="section-pairing__social-inner">
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
              </span>
            </span>
          ))}
        </div>
        <span className="section-pairing__plus">
          <span className="section-pairing__inner" />
          <span className="section-pairing__qr-ring" aria-hidden="true" />
          <img src={bentoQr} alt="" width="30" height="30" />
        </span>
      </div>
      <span className="section-pairing__circle section-pairing__circle--top" aria-hidden="true" />
      <span className="section-pairing__circle section-pairing__circle--bottom" aria-hidden="true" />
    </div>
  );
}

const functionRowMarks = [58, 44, 50, 40, 0, 46, 38, 52, 42, 48, 36, 50, 44];
const numberRowMarks = [40, 34, 38, 32, 40, 36, 34, 42, 30, 38, 36, 44, 52];
const letterRowMarks = [56, 36, 40, 34, 38, 32, 40, 36, 42, 34, 38, 48];

function FunctionKeysIllustration() {
  return (
    <div className="function-keys">
      <span className="function-keys__lead" aria-hidden="true" />
      <div className="function-keys__row">
        {functionRowMarks.map((mark, index) => (
          <span className={`function-keys__key${index === 4 ? " is-active" : ""}`} key={index}>
            {index === 4 ? (
              <svg className="function-keys__glyph" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 3a.75.75 0 0 1 .75.75v9.19l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3.75A.75.75 0 0 1 12 3Zm-7 15.5h14a.75.75 0 1 1 0 1.5H5a.75.75 0 1 1 0-1.5Z" />
              </svg>
            ) : (
              <i style={{ width: `${mark}%` }} />
            )}
          </span>
        ))}
      </div>
      <div className="function-keys__row function-keys__row--number">
        {numberRowMarks.map((mark, index) => (
          <span className="function-keys__key" key={index}><i style={{ width: `${mark}%` }} /></span>
        ))}
      </div>
      <div className="function-keys__row function-keys__row--letter">
        {letterRowMarks.map((mark, index) => (
          <span className="function-keys__key" key={index}><i style={{ width: `${mark}%` }} /></span>
        ))}
      </div>
      <span className="function-keys__tail" aria-hidden="true" />
    </div>
  );
}

function PhoneSyncIllustration() {
  return (
    <div className="phone-sync">
      <span className="phone-sync__link" aria-hidden="true" />
      <div className="phone-sync__device">
        <span className="phone-sync__island" />
        <div className="phone-sync__screen">
          <span className="phone-sync__ring">
            <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19.7 13.2A7.75 7.75 0 0 1 6.4 17.1" />
              <path d="M4.3 10.8A7.75 7.75 0 0 1 17.6 6.9" />
              <path d="M17.6 3.1v3.9h-3.9" />
              <path d="M6.4 20.9V17h3.9" />
            </svg>
          </span>
          <i className="phone-sync__line" />
          <i className="phone-sync__line phone-sync__line--short" />
        </div>
      </div>
    </div>
  );
}

const workflowSteps = [
  {
    title: "Choose your setup",
    copy: "Start with the desktop and mobile tools you already use.",
    illustration: <FunctionKeysIllustration />,
  },
  {
    title: "Link your devices",
    copy: "Use a secure code or scan to bring nearby screens together.",
    illustration: <PairingIllustration />,
  },
  {
    title: "Keep work in reach",
    copy: "Move between notes, files, controls, and shared views from anywhere.",
    illustration: <PhoneSyncIllustration />,
  },
];

type SectionStep = {
  title: string;
  copy: string;
  illustration: ReactNode;
};

type StepsCompositionProps = SectionCompositionProps & {
  modifier?: string;
  titleId: string;
  pill: string;
  heading: ReactNode;
  steps: readonly SectionStep[];
};

function StepsComposition({ className, style, modifier, titleId, pill, heading, steps }: StepsCompositionProps) {
  const base = modifier ? `section-element section-element--workflow ${modifier}` : "section-element section-element--workflow";
  return (
    <section className={classNames(base, className)} style={style} aria-labelledby={titleId}>
      <header className="onboarding-steps__head">
        <GlassPill>{pill}</GlassPill>
        <h2 id={titleId}>{heading}</h2>
      </header>
      <div className="onboarding-steps__body">
        <div className="onboarding-steps__branches" aria-hidden="true"><i /><i /></div>
        <div className="onboarding-steps__list">
          {steps.map((step, index) => (
            <article className="onboarding-steps__card" key={step.title}>
              <div className="onboarding-steps__card-inner">
                <div className={`onboarding-steps__preview onboarding-steps__preview--${index + 1}`} aria-hidden="true">
                  {step.illustration}
                </div>
                <div className="onboarding-steps__details">
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WorkflowSection({ className, style }: SectionCompositionProps) {
  return (
    <StepsComposition
      className={className}
      style={style}
      titleId="onboarding-steps-title"
      pill="Getting started"
      heading={<>Build your connected<br />workspace</>}
      steps={workflowSteps}
    />
  );
}

export function EditorialIntroSection({ className, style }: SectionCompositionProps) {
  return (
    <section className={classNames("section-element section-element--testimonial-intro", className)} style={style} aria-labelledby="section-testimonial-title">
      <div className="editorial-intro__graphic" aria-hidden="true">
        <img className="editorial-intro__dots" src={testimonialDots} alt="" width="368" height="368" />
        <div className="editorial-intro__device">
          <img src={testimonialIllustration} alt="" width="368" height="368" />
          <img className="editorial-intro__keyboard" src={testimonialKeyboard} alt="" width="148" height="17" />
        </div>
      </div>
      <div className="editorial-intro__copy">
        <GlassPill>Made for momentum</GlassPill>
        <h2 id="section-testimonial-title">Ideas, in motion.</h2>
        <p>A focused interface keeps every action clear and every handoff moving.</p>
      </div>
    </section>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 9.55v4.9c0 1.56 0 2.34-.3 2.94a2.75 2.75 0 0 1-1.21 1.21c-.6.3-1.38.3-2.94.3h-8.1c-1.56 0-2.34 0-2.94-.3a2.75 2.75 0 0 1-1.21-1.21c-.3-.6-.3-1.38-.3-2.94v-4.9c0-1.56 0-2.34.3-2.94A2.75 2.75 0 0 1 5.01 5.4c.6-.3 1.38-.3 2.94-.3h8.1c1.56 0 2.34 0 2.94.3a2.75 2.75 0 0 1 1.21 1.21c.3.6.3 1.38.3 2.94Z" />
      <path d="m3.55 6 6.61 5.14a3 3 0 0 0 3.68 0L20.45 6" fill="none" />
    </svg>
  );
}

export function NewsletterFooterSection({ className, style }: SectionCompositionProps) {
  const [subscribed, setSubscribed] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(true);
  };

  return (
    <footer className={classNames("section-element section-element--newsletter-footer", className)} style={style}>
      <div className="newsletter-footer__row">
        <div className="newsletter-footer__brand">
          <span className="newsletter-footer__mark" aria-label="Section marker"><span>01</span></span>
          <p>A monthly edit of thoughtful interfaces,<br />practical patterns, and new experiments.</p>
        </div>
        <form className={`newsletter-footer__form${subscribed ? " is-success" : ""}`} aria-label="Join the monthly design notes" onSubmit={submit}>
          <EnvelopeIcon />
          <input aria-label="Email address" type="email" placeholder="Email for monthly notes" required />
          <SectionButton className="newsletter-footer__button" type="submit">{subscribed ? "You're subscribed" : "Join the list"}</SectionButton>
          <span className="newsletter-footer__ring" aria-hidden="true" />
        </form>
      </div>
      <div className="newsletter-footer__wordmark" aria-label="Stay curious">STAY CURIOUS</div>
      <div className="newsletter-footer__legal">
        <span>© 2026. Built for thoughtful work.</span>
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
        <a href="#contact">Contact</a>
      </div>
    </footer>
  );
}

function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.47 4.47a.75.75 0 0 1 1.06 0l6.5 6.5a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 1 1-1.06-1.06l5.22-5.22H3.75a.75.75 0 0 1 0-1.5h14.94l-5.22-5.22a.75.75 0 0 1 0-1.06Z" />
    </svg>
  );
}

const heroProof = ["No credit card", "SOC 2 ready", "Free for small teams"];

export function HeroBannerSection({ className, style }: SectionCompositionProps) {
  return (
    <section className={classNames("section-element section-element--hero-banner", className)} style={style} aria-labelledby="hero-banner-title">
      <span className="hero-banner__glow" aria-hidden="true" />
      <span className="hero-banner__arc" aria-hidden="true" />
      <div className="hero-banner__copy">
        <GlassPill>Now in open beta</GlassPill>
        <h2 id="hero-banner-title">Ship the interface<br />your product deserves.</h2>
        <p>One calm, composable surface for teams that move quickly and still care how every screen feels.</p>
        <div className="hero-banner__actions">
          <SectionButton className="hero-banner__cta">Start building</SectionButton>
          <button className="hero-banner__ghost" type="button">
            <span>Take the tour</span>
            <ArrowIcon />
          </button>
        </div>
        <ul className="hero-banner__proof">
          {heroProof.map((item) => (
            <li key={item}><i aria-hidden="true" />{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.4a.75.75 0 0 1 .68.43l2.53 5.32 5.7.83a.75.75 0 0 1 .42 1.27l-4.13 4.11.98 5.83a.75.75 0 0 1-1.1.78L12 18.24l-5.08 2.73a.75.75 0 0 1-1.1-.78l.98-5.83-4.13-4.11a.75.75 0 0 1 .42-1.27l5.7-.83 2.53-5.32A.75.75 0 0 1 12 2.4Z" />
    </svg>
  );
}

const testimonials = [
  {
    initials: "AO",
    quote: "We stopped rebuilding the same layout in every project. The sections drop in, and the whole product finally reads as one thing.",
    name: "Ada Okonkwo",
    role: "Design lead",
  },
  {
    initials: "MR",
    quote: "It replaced a folder of half-finished components. Two engineers shipped the marketing site in an afternoon and nothing looked pasted in.",
    name: "Mara Reyes",
    role: "Founding engineer",
  },
  {
    initials: "JT",
    quote: "The details we always skip — focus rings, reduced motion, small screens — were already handled. That is the part that usually costs a week.",
    name: "Jonas Thibault",
    role: "Head of product",
  },
];

export function TestimonialWallSection({ className, style }: SectionCompositionProps) {
  return (
    <section className={classNames("section-element section-element--testimonial-wall", className)} style={style} aria-labelledby="testimonial-wall-title">
      <header className="testimonial-wall__head">
        <GlassPill>What teams say</GlassPill>
        <h2 id="testimonial-wall-title">Built with people who<br />ship every week.</h2>
      </header>
      <div className="testimonial-wall__list">
        {testimonials.map((item, index) => (
          <figure className="testimonial-wall__card" key={item.name} style={{ "--card-index": index } as CSSProperties}>
            <div className="testimonial-wall__stars" aria-label="Rated 5 out of 5">
              {[0, 1, 2, 3, 4].map((star) => (
                <StarIcon key={star} />
              ))}
            </div>
            <blockquote>{item.quote}</blockquote>
            <figcaption className="testimonial-wall__person">
              <span className="testimonial-wall__avatar" aria-hidden="true">{item.initials}</span>
              <span className="testimonial-wall__identity">
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.53 5.97a.75.75 0 0 1 .04 1.02l-9.5 11a.75.75 0 0 1-1.1.04l-5.5-5.5a.75.75 0 1 1 1.06-1.06l4.93 4.93 8.97-10.39a.75.75 0 0 1 1.1-.04Z" />
    </svg>
  );
}

const pricingPlans = [
  {
    name: "Solo",
    monthly: 0,
    annual: 0,
    blurb: "For one person shaping an idea.",
    features: ["12 starter sections", "Single workspace", "Community support"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Studio",
    monthly: 24,
    annual: 19,
    blurb: "For small teams building in public.",
    features: ["Every section and variant", "Unlimited workspaces", "Shared design tokens", "Priority support"],
    cta: "Choose Studio",
    featured: true,
  },
  {
    name: "Scale",
    monthly: 68,
    annual: 54,
    blurb: "For organisations with many surfaces.",
    features: ["Everything in Studio", "SSO and audit trail", "Private component registry"],
    cta: "Talk to us",
    featured: false,
  },
];

export function PricingTiersSection({ className, style }: SectionCompositionProps) {
  const [annual, setAnnual] = useState(false);

  return (
    <section className={classNames("section-element section-element--pricing-tiers", className)} style={style} aria-labelledby="pricing-tiers-title">
      <header className="pricing-tiers__head">
        <div className="pricing-tiers__intro">
          <GlassPill>Pricing</GlassPill>
          <h2 id="pricing-tiers-title">Plans that scale<br />with the work.</h2>
        </div>
        <div className="pricing-tiers__switch" role="group" aria-label="Billing period">
          <span className="pricing-tiers__thumb" data-annual={annual} aria-hidden="true" />
          <button type="button" aria-pressed={!annual} onClick={() => setAnnual(false)}>Monthly</button>
          <button type="button" aria-pressed={annual} onClick={() => setAnnual(true)}>Annual<i>−20%</i></button>
        </div>
      </header>
      <div className="pricing-tiers__list">
        {pricingPlans.map((plan) => (
          <article className={`pricing-tiers__card${plan.featured ? " is-featured" : ""}`} key={plan.name}>
            {plan.featured ? <span className="pricing-tiers__ring" aria-hidden="true" /> : null}
            <div className="pricing-tiers__card-inner">
              <header className="pricing-tiers__plan">
                <h3>{plan.name}</h3>
                {plan.featured ? <span className="pricing-tiers__badge">Most picked</span> : null}
              </header>
              <p className="pricing-tiers__blurb">{plan.blurb}</p>
              <p className="pricing-tiers__price">
                <span className="pricing-tiers__amount">${annual ? plan.annual : plan.monthly}</span>
                <span className="pricing-tiers__period">per editor<br />/ month</span>
              </p>
              <ul className="pricing-tiers__features">
                {plan.features.map((feature) => (
                  <li key={feature}><CheckIcon />{feature}</li>
                ))}
              </ul>
              <SectionButton className="pricing-tiers__cta">{plan.cta}</SectionButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5h16A1.5 1.5 0 0 1 21.5 7v.35l-9.06 5.2a.9.9 0 0 1-.88 0L2.5 7.35V7A1.5 1.5 0 0 1 4 5.5Zm17.5 3.58V17a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 17V9.08l8.32 4.77a2.4 2.4 0 0 0 2.36 0l8.32-4.77Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5a7 7 0 0 1 7 7c0 4.62-5.36 10.6-6.44 11.75a.76.76 0 0 1-1.12 0C10.36 20.1 5 14.12 5 9.5a7 7 0 0 1 7-7Zm0 4.4a2.6 2.6 0 1 0 0 5.2 2.6 2.6 0 0 0 0-5.2Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19Zm0 1.5a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 3.25v4.44l3.03 1.75a.75.75 0 1 1-.75 1.3l-3.4-1.97a.75.75 0 0 1-.38-.65V7.25a.75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}

const contactDetails = [
  { icon: <MailIcon />, label: "Email", value: "studio@example.com" },
  { icon: <PinIcon />, label: "Studio", value: "Remote-first, GMT−5 to GMT+2" },
  { icon: <ClockIcon />, label: "Reply time", value: "Within one business day" },
];

const contactTopics = ["New project", "Partnership", "Support"];

export function ContactPanelSection({ className, style }: SectionCompositionProps) {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState(contactTopics[0]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <section className={classNames("section-element section-element--contact-panel", className)} style={style} aria-labelledby="contact-panel-title">
      <span className="contact-panel__glow" aria-hidden="true" />
      <div className="contact-panel__copy">
        <GlassPill>Contact</GlassPill>
        <h2 id="contact-panel-title">Tell us what<br />you are building.</h2>
        <p>Share the shape of the problem and we will come back with a plan, a timeline, and the parts we would reuse.</p>
        <ul className="contact-panel__details">
          {contactDetails.map((detail) => (
            <li key={detail.label}>
              <span className="contact-panel__tile" aria-hidden="true">{detail.icon}</span>
              <span className="contact-panel__detail">
                <span>{detail.label}</span>
                <strong>{detail.value}</strong>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <form className={`contact-panel__form${sent ? " is-sent" : ""}`} aria-label="Contact the studio" onSubmit={submit}>
        <div className="contact-panel__topics" role="group" aria-label="Topic">
          {contactTopics.map((item) => (
            <button
              className={item === topic ? "is-active" : ""}
              key={item}
              type="button"
              aria-pressed={item === topic}
              onClick={() => setTopic(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="contact-panel__row">
          <label className="contact-panel__field">
            <span>Name</span>
            <input name="name" type="text" placeholder="Your name" required />
          </label>
          <label className="contact-panel__field">
            <span>Email</span>
            <input name="email" type="email" placeholder="you@studio.com" required />
          </label>
        </div>
        <label className="contact-panel__field contact-panel__field--message">
          <span>Message</span>
          <textarea name="message" rows={3} placeholder="A sentence or two about the project" required />
        </label>
        <div className="contact-panel__submit">
          <SectionButton className="contact-panel__cta" type="submit">{sent ? "Message sent" : "Send message"}</SectionButton>
          <p className="contact-panel__note" role="status">{sent ? "Thanks — we will reply shortly." : "We never share your details."}</p>
        </div>
      </form>
    </section>
  );
}

const agentToolIcons = [
  <path key="terminal" d="M5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75A2.75 2.75 0 0 1 5.75 4Zm0 1.5c-.69 0-1.25.56-1.25 1.25v10.5c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V6.75c0-.69-.56-1.25-1.25-1.25H5.75Zm1.72 3.22a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 1 1-1.06-1.06L9.44 12 7.47 10.03a.75.75 0 0 1 0-1.06ZM12.75 14h3.5a.75.75 0 1 1 0 1.5h-3.5a.75.75 0 1 1 0-1.5Z" />,
  <path key="branch" d="M7 2.5a3 3 0 0 1 .75 5.9v1.28c0 .97.78 1.75 1.75 1.75h5a3.25 3.25 0 0 1 3.25 3.24v.83a3 3 0 1 1-1.5 0v-.83c0-.96-.79-1.74-1.75-1.74h-5c-.63 0-1.23-.17-1.75-.48v4.15a3 3 0 1 1-1.5 0V8.4A3 3 0 0 1 7 2.5Zm0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm0 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm9.5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />,
  <path key="file" d="M13 2.5a.75.75 0 0 1 .53.22l5.25 5.25a.75.75 0 0 1 .22.53v10A2.75 2.75 0 0 1 16.25 21h-8.5A2.75 2.75 0 0 1 5 18.25V5.25A2.75 2.75 0 0 1 7.75 2.5H13Zm-.75 1.5H7.75c-.69 0-1.25.56-1.25 1.25v13c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25V9.25h-3.25a1.75 1.75 0 0 1-1.75-1.75V4Zm1.5 1.06V7.5c0 .14.11.25.25.25h2.44l-2.69-2.69ZM9.25 15.5h5.5a.75.75 0 1 1 0 1.5h-5.5a.75.75 0 1 1 0-1.5Zm0-3.5h5.5a.75.75 0 1 1 0 1.5h-5.5a.75.75 0 1 1 0-1.5Z" />,
  <path key="browser" d="M5.75 3.5h12.5A2.75 2.75 0 0 1 21 6.25v11.5A2.75 2.75 0 0 1 18.25 20.5H5.75A2.75 2.75 0 0 1 3 17.75V6.25A2.75 2.75 0 0 1 5.75 3.5Zm0 1.5c-.69 0-1.25.56-1.25 1.25V8.5h15V6.25c0-.69-.56-1.25-1.25-1.25H5.75ZM19.5 10h-15v7.75c0 .69.56 1.25 1.25 1.25h12.5c.69 0 1.25-.56 1.25-1.25V10ZM6.75 6.25a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Zm2.5 0a.75.75 0 1 1 0 1.5.75.75 0 0 1 0-1.5Z" />,
  <path key="database" d="M12 2.5c2.3 0 4.4.31 5.96.85.78.27 1.46.61 1.97 1.05.51.44.92 1.05.92 1.8v11.6c0 .75-.41 1.36-.92 1.8-.51.44-1.19.78-1.97 1.05-1.56.54-3.66.85-5.96.85s-4.4-.31-5.96-.85c-.78-.27-1.46-.61-1.97-1.05-.51-.44-.92-1.05-.92-1.8V6.2c0-.75.41-1.36.92-1.8.51-.44 1.19-.78 1.97-1.05C7.6 2.81 9.7 2.5 12 2.5Zm7.35 6.42c-.42.24-.9.45-1.39.62-1.56.54-3.66.85-5.96.85s-4.4-.31-5.96-.85c-.49-.17-.97-.38-1.39-.62v3.24c.04.07.16.22.44.4.36.23.92.47 1.64.68 1.42.42 3.4.69 5.62.69.99 0 1.94-.05 2.81-.15v1.51c-.89.09-1.84.14-2.81.14-2.33 0-4.45-.28-6.04-.75-.6-.18-1.16-.4-1.66-.68v3.36c.4.07.16.22.44.4.36.23.92.47 1.64.68 1.42.42 3.4.69 5.62.69.99 0 1.94-.05 2.81-.15v1.51c-.89.09-1.84.14-2.81.14v.02c-2.14 0-4.09-.26-5.6-.7v.02c-.6-.18-1.16-.4-1.66-.68v1.06c0 .1.05.27.4.57.35.3.9.59 1.62.84 1.42.49 3.41.79 5.63.79s4.21-.3 5.63-.79c.72-.25 1.27-.54 1.62-.84.35-.3.4-.47.4-.57V8.92ZM12 4c-2.22 0-4.21.3-5.63.79-.72.25-1.27.54-1.62.84-.35.3-.4.47-.4.57 0 .1.05.27.4.57.35.3.9.59 1.62.84 1.42.49 3.41.79 5.63.79s4.21-.3 5.63-.79c.72-.25 1.27-.54 1.62-.84.35-.3.4-.47.4-.57 0-.1-.05-.27-.4-.57-.35-.3-.9-.59-1.62-.84C16.21 4.3 14.22 4 12 4Z" />,
  <path key="check" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 1.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 1 0 0-17zm2.42 5.525a.75.75 0 1 1 1.161.95l-4.5 5.5a.75.75 0 0 1-1.111.055l-2-2A.75.75 0 0 1 9.03 12.47l1.414 1.413 3.976-4.858z" />,
];

const agentCodeLines: readonly { indent: number; tokens: readonly (readonly [number, string])[] }[] = [
  { indent: 0, tokens: [[16, "key"], [34, "fn"], [10, "dim"]] },
  { indent: 1, tokens: [[22, "dim"], [30, "str"]] },
  { indent: 1, tokens: [[18, "key"], [26, "num"], [14, "dim"]] },
  { indent: 2, tokens: [[38, "str"]] },
  { indent: 2, tokens: [[20, "dim"], [24, "num"]] },
  { indent: 1, tokens: [[24, "fn"], [20, "dim"]] },
  { indent: 1, tokens: [[16, "key"], [34, "str"]] },
  { indent: 0, tokens: [[14, "key"], [30, "dim"]] },
];

function AgentEditorIllustration() {
  return (
    <div className="agent-editor">
      <div className="agent-editor__chrome">
        <i /><i /><i />
        <span className="agent-editor__tab" />
      </div>
      <div className="agent-editor__code">
        {agentCodeLines.map((line, index) => (
          <span className="agent-editor__line" key={index} style={{ "--indent": line.indent } as CSSProperties}>
            {line.tokens.map(([width, tone], token) => (
              <i className={`agent-editor__token agent-editor__token--${tone}`} key={token} style={{ width: `${width}%` }} />
            ))}
            {index === agentCodeLines.length - 1 ? <i className="agent-editor__caret" /> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

function AgentLoopIllustration() {
  const angles = [-120, -60, 180, 0, 120, 60];
  return (
    <div className="section-pairing">
      <div className="section-pairing__stage">
        <div className="section-pairing__orbit">
          {agentToolIcons.map((icon, index) => (
            <span
              className="section-pairing__social"
              key={angles[index]}
              style={{ "--angle": `${angles[index]}deg` } as CSSProperties}
            >
              <span className="section-pairing__social-inner">
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">{icon}</svg>
              </span>
            </span>
          ))}
        </div>
        <span className="section-pairing__plus">
          <span className="section-pairing__inner" />
          <span className="section-pairing__qr-ring" aria-hidden="true" />
          <svg className="agent-loop__core" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.47 5.47a.75.75 0 0 1 1.06 0l5.5 5.5a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 1 1-1.06-1.06L9.44 12 4.47 7.03a.75.75 0 0 1 0-1.06ZM12.75 16h6.5a.75.75 0 1 1 0 1.5h-6.5a.75.75 0 1 1 0-1.5Z" />
          </svg>
        </span>
      </div>
      <span className="section-pairing__circle section-pairing__circle--top" aria-hidden="true" />
      <span className="section-pairing__circle section-pairing__circle--bottom" aria-hidden="true" />
    </div>
  );
}

const harnessCells = "111111101111111101111110111111111111111111011111";

function AgentHarnessIllustration() {
  return (
    <div className="agent-harness-board">
      <div className="agent-harness-board__head">
        <span className="agent-harness-board__label" />
        <span className="agent-harness-board__score">92%</span>
      </div>
      <div className="agent-harness-board__grid">
        {[...harnessCells].map((state, index) => (
          <i
            className={`agent-harness-board__cell${state === "0" ? " is-failed" : ""}`}
            key={index}
            style={{ "--cell": index } as CSSProperties}
          />
        ))}
      </div>
      <div className="agent-harness-board__meter"><i /></div>
    </div>
  );
}

const agentSteps: readonly SectionStep[] = [
  {
    title: "Define the tools",
    copy: "Give the agent a small typed surface: read, edit, run, and search.",
    illustration: <AgentEditorIllustration />,
  },
  {
    title: "Let it work the loop",
    copy: "It plans, calls a tool, reads the result, and repeats until the task closes.",
    illustration: <AgentLoopIllustration />,
  },
  {
    title: "Grade every run",
    copy: "Replay the whole task set and score every attempt against the same checks.",
    illustration: <AgentHarnessIllustration />,
  },
];

export function AgentHarnessSection({ className, style }: SectionCompositionProps) {
  return (
    <StepsComposition
      className={className}
      style={style}
      modifier="section-element--agent-harness"
      titleId="agent-harness-title"
      pill="Agent harness"
      heading={<>Build agents that<br />ship real code</>}
      steps={agentSteps}
    />
  );
}

const imageRatios = ["1:1", "16:9", "9:16"];

function GenerativeImageIllustration() {
  return (
    <div className="generative-image">
      <div className="generative-image__frame">
        <span className="generative-image__art" />
        <span className="generative-image__dots" />
        <span className="generative-image__scan" />
      </div>
      <div className="generative-image__ratios">
        {imageRatios.map((ratio, index) => (
          <span className={index === 0 ? "is-active" : ""} key={ratio}>{ratio}</span>
        ))}
      </div>
    </div>
  );
}

const videoLengths = ["4s", "12s", "24s"];

function GenerativeVideoIllustration() {
  return (
    <div className="generative-video">
      <div className="generative-video__strip">
        <span className="generative-video__perf" />
        <div className="generative-video__frames">
          {[0, 1, 2, 3, 4].map((frame) => (
            <i key={frame} style={{ "--frame": frame } as CSSProperties} />
          ))}
        </div>
        <span className="generative-video__perf" />
        <span className="generative-video__playhead" />
      </div>
      <div className="generative-video__timeline">
        <i className="generative-video__progress" />
        <i className="generative-video__knob" />
      </div>
      <div className="generative-video__lengths">
        {videoLengths.map((length, index) => (
          <span className={index === 1 ? "is-active" : ""} key={length}>{length}</span>
        ))}
      </div>
    </div>
  );
}

const audioBars = [18, 34, 26, 52, 70, 44, 88, 62, 96, 54, 76, 40, 64, 92, 48, 30, 58, 82, 38, 68, 46, 24, 56, 74, 32, 50, 22, 36];

function GenerativeAudioIllustration() {
  return (
    <div className="generative-audio">
      <div className="generative-audio__wave">
        {audioBars.map((height, index) => (
          <i key={index} style={{ "--height": `${height}%`, "--bar": index } as CSSProperties} />
        ))}
      </div>
      <div className="generative-audio__transport">
        <span className="generative-audio__play">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.6a1 1 0 0 1 1.52-.85l9.1 5.55a1 1 0 0 1 0 1.7l-9.1 5.55a1 1 0 0 1-1.52-.85V5.6Z" /></svg>
        </span>
        <span className="generative-audio__track"><i /></span>
        <span className="generative-audio__time">0:12</span>
      </div>
    </div>
  );
}

const generativeSteps: readonly SectionStep[] = [
  {
    title: "Generate the image",
    copy: "Describe the frame once and render it at any aspect the layout needs.",
    illustration: <GenerativeImageIllustration />,
  },
  {
    title: "Extend it into video",
    copy: "Turn the still into motion, then trim and re-time it on a simple track.",
    illustration: <GenerativeVideoIllustration />,
  },
  {
    title: "Score it with sound",
    copy: "Add narration, music, and effects, mixed against the same timeline.",
    illustration: <GenerativeAudioIllustration />,
  },
];

export function GenerativeStudioSection({ className, style }: SectionCompositionProps) {
  return (
    <StepsComposition
      className={className}
      style={style}
      modifier="section-element--generative-studio"
      titleId="generative-studio-title"
      pill="Generative studio"
      heading={<>Make image, video,<br />and sound</>}
      steps={generativeSteps}
    />
  );
}
