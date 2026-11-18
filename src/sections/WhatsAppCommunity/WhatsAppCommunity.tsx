"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { COMMUNITY_DEFAULT_REPLY, COMMUNITY_QA_RULES } from "@/src/content/community";
import { SITE_LINKS } from "@/src/content/site";

// WebGL beam (three.js) far down the page: load it in its own chunk.
const LaserFlow = dynamic(() => import("@/src/components/LaserFlow"), { ssr: false });
import CosmicSectionBackdrop from "@/src/components/Cosmic/CosmicSectionBackdrop";
import "./WhatsAppCommunity.css";

export interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
}

const initialMessages: Message[] = [
  { id: "welcome", sender: "bot", text: "Hey! I’m the ECell guide. Type a question below to ask about ECell, events, joining, or building your idea.", time: "11:42" },
];

const KALPAVIKAS_SPELLING_REPLIES = [
  "Almost! It's Kalpavikas—with an 'a' after 'p'. The little 'a' was on its way to the fest 😄",
  "Kalpvikas? Close! It's Kalpavikas. The spelling bouncer says you're still on the guest list 😄",
  "A tiny 'a' went missing! It's Kalpavikas—no search party needed, we found it 😄",
  "Spell check says Kalpavikas. Your keyboard nearly launched a rival startup 😄",
];

const KALPAVIKAS_MISSPELLING = /\b(?:kalpvikas|kalp[\s-]+vikas|kalpavikass|kalpavikaas|kalpvikaas)\b/i;

const getAssistantReply = (message: string, replyIndex = 0): string => {
  const query = message.toLowerCase().trim();
  if (KALPAVIKAS_MISSPELLING.test(query)) {
    return KALPAVIKAS_SPELLING_REPLIES[replyIndex % KALPAVIKAS_SPELLING_REPLIES.length];
  }
  const eventRule = COMMUNITY_QA_RULES.find((rule) => rule.id.startsWith("kalpavikas_") && rule.pattern.test(query));
  if (eventRule) return eventRule.reply;
  const matchedRule = COMMUNITY_QA_RULES.find((rule) => rule.pattern.test(query));
  return matchedRule ? matchedRule.reply : COMMUNITY_DEFAULT_REPLY;
};

const timeNow = (): string => new Intl.DateTimeFormat("en-IN", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
}).format(new Date());

export default function WhatsAppCommunity(): React.ReactElement {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const replyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const replyIndexRef = useRef(0);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  // Decorative DOM is mounted after hydration so browser extensions cannot
  // make the server-rendered tree differ from React's first client render.
  const [isDecorativeReady, setIsDecorativeReady] = useState<boolean>(false);
  const [beamPosition, setBeamPosition] = useState<number>(0.66);
  const [isCompactViewport, setIsCompactViewport] = useState<boolean>(false);
  const [dpr, setDpr] = useState<number>(1.5);
  const [bhStream, setBhStream] = useState<{
    w: number;
    h: number;
    cardRight: number;
    cardTop: number;
    bhX: number;
    bhY: number;
  } | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsDecorativeReady(true));
    const updateBeamPos = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setBeamPosition(w <= 860 ? 0.5 : 0.66);
      setIsCompactViewport(w <= 860 || h <= 500);
      setDpr(w <= 768 ? 1.25 : 1.5);
    };
    updateBeamPos();
    window.addEventListener("resize", updateBeamPos, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateBeamPos);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const measureStream = () => {
      if (window.innerWidth <= 860 || window.innerHeight <= 500) {
        setBhStream(null);
        return;
      }
      const bhEl = section.querySelector<HTMLElement>(".bg-planet--m87 .bg-planet__art");
      if (!bhEl) {
        setBhStream(null);
        return;
      }
      const secRect = section.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const bhRect = bhEl.getBoundingClientRect();
      if (secRect.width <= 0 || cardRect.width <= 0 || bhRect.width <= 0) {
        setBhStream(null);
        return;
      }
      setBhStream({
        w: secRect.width,
        h: secRect.height,
        cardRight: cardRect.left - secRect.left + cardRect.width,
        cardTop: cardRect.top - secRect.top,
        bhX: bhRect.left - secRect.left + bhRect.width * 0.5,
        bhY: bhRect.top - secRect.top + bhRect.height * 0.5,
      });
    };

    const raf = requestAnimationFrame(measureStream);
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measureStream);
      ro.observe(section);
      ro.observe(card);
      const bhEl = section.querySelector<HTMLElement>(".bg-planet--m87 .bg-planet__art");
      if (bhEl) ro.observe(bhEl);
    }
    window.addEventListener("resize", measureStream, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.removeEventListener("resize", measureStream);
    };
  }, [beamPosition]);

  useEffect(() => {
    const messageList = messagesRef.current;
    if (messageList) {
      if (typeof messageList.scrollTo === "function") {
        messageList.scrollTo({ top: messageList.scrollHeight, behavior: "smooth" });
      } else {
        messageList.scrollTop = messageList.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  useEffect(() => () => {
    if (replyTimeoutRef.current) clearTimeout(replyTimeoutRef.current);
  }, []);

  const handleSelectQuestion = (questionLabel: string, replyText: string) => {
    if (isTyping) return;
    const cleanQuestion = questionLabel.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();
    setMessages((current) => [...current, { id: `user-${Date.now()}`, sender: "user", text: cleanQuestion, time: timeNow() }]);
    setIsTyping(true);

    replyTimeoutRef.current = setTimeout(() => {
      setMessages((current) => [...current, {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: replyText,
        time: timeNow(),
      }]);
      setIsTyping(false);
    }, 600);
  };

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isTyping) return;
    const replyText = getAssistantReply(text, replyIndexRef.current++);

    setMessages((current) => [...current, { id: `user-${Date.now()}`, sender: "user", text, time: timeNow() }]);
    setDraft("");
    setIsTyping(true);

    replyTimeoutRef.current = setTimeout(() => {
      setMessages((current) => [...current, {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: replyText,
        time: timeNow(),
      }]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <section
      ref={sectionRef}
      className="whatsapp-community"
      id="community"
      aria-labelledby="community-heading"
    >
      <CosmicSectionBackdrop
        planet="m87"
        planetPlacement={
          isCompactViewport
            ? {
                bottom: "6%",
                right: "calc(var(--m87-w, 240px) * -0.22)",
                width: "clamp(220px, 20vw, 320px)",
              }
            : {
                bottom: "21%",
                right: "max(12px, calc((100vw - min(1220px, 82vw)) / 2 - clamp(110px, 9.5vw, 150px)))",
                width: "clamp(112px, 10vw, 172px)",
              }
        }
        starsCount={34}
        shootingStarsCount={3}
        seed={707}
        nebula={isCompactViewport ? "singularity" : undefined}
        sectorLabel={isCompactViewport ? "SEC-09 M87* POWEHI" : undefined}
        constellation="vortex"
        constellationPlacement={{
          top: "40%",
          left: "2%",
          width: "clamp(85px, 8vw, 120px)",
        }}
        sectionId="community"
        scrollParallax={isCompactViewport}
      />
      {isDecorativeReady && (
        <div className="whatsapp-community-ambient-glow" aria-hidden="true" />
      )}
      <div className="whatsapp-laser-flow" aria-hidden="true">
        <LaserFlow
          surfaceRef={cardRef}
          beamPosition={beamPosition}
          color="#5168ff"
          intensity={isCompactViewport ? 1.65 : 1.5}
          beamWidth={1.25}
          flare={isCompactViewport ? 1.25 : 1.2}
          spread={isCompactViewport ? 1.45 : 1.25}
          spill={isCompactViewport ? 0.85 : 0.42}
          fog={isCompactViewport ? 0.12 : 0.04}
          dust={1.0}
          streaks={isCompactViewport ? 1.6 : 1.5}
          dots={1.0}
          intro={false}
          mouseInteraction={false}
          revealImage={undefined}
          dpr={dpr}
        />
      </div>
      {isDecorativeReady && bhStream && bhStream.bhX > bhStream.cardRight - 10 && (() => {
        const { w, h, cardRight, cardTop, bhX, bhY } = bhStream;
        const startX = cardRight - 22;
        const startY = cardTop + 2;
        const dx = Math.max(24, bhX - startX);
        const dy = bhY - startY;
        const mainPath = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${(startX + dx * 0.45).toFixed(1)} ${(startY + 4).toFixed(1)}, ${(bhX - dx * 0.24).toFixed(1)} ${(bhY - Math.max(22, Math.abs(dy) * 0.55)).toFixed(1)}, ${bhX.toFixed(1)} ${bhY.toFixed(1)}`;
        const wispX = cardRight - 1;
        const wispY = cardTop + 48;
        const wispPath = `M ${wispX.toFixed(1)} ${wispY.toFixed(1)} C ${(wispX + dx * 0.34).toFixed(1)} ${(wispY + 18).toFixed(1)}, ${(bhX - dx * 0.28).toFixed(1)} ${(bhY + 16).toFixed(1)}, ${bhX.toFixed(1)} ${bhY.toFixed(1)}`;
        return (
          <svg
            className="whatsapp-bh-beam"
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="wa-bh-grad"
                gradientUnits="userSpaceOnUse"
                x1={startX}
                y1={startY}
                x2={bhX}
                y2={bhY}
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="26%" stopColor="#8edcff" stopOpacity="0.92" />
                <stop offset="58%" stopColor="#7c6cff" stopOpacity="0.78" />
                <stop offset="86%" stopColor="#fb923c" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#fff7ed" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="wa-bh-core"
                gradientUnits="userSpaceOnUse"
                x1={startX}
                y1={startY}
                x2={bhX}
                y2={bhY}
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#bae6fd" stopOpacity="0.85" />
                <stop offset="84%" stopColor="#fed7aa" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
              <filter id="wa-bh-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="7" />
              </filter>
              <filter id="wa-bh-soft" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" />
              </filter>
            </defs>
            <path d={mainPath} fill="none" stroke="url(#wa-bh-grad)" strokeWidth="18" strokeLinecap="round" opacity="0.38" filter="url(#wa-bh-glow)" />
            <path d={wispPath} fill="none" stroke="url(#wa-bh-grad)" strokeWidth="8" strokeLinecap="round" opacity="0.28" filter="url(#wa-bh-glow)" />
            <path d={mainPath} fill="none" stroke="url(#wa-bh-grad)" strokeWidth="5" strokeLinecap="round" opacity="0.78" filter="url(#wa-bh-soft)" />
            <path d={wispPath} fill="none" stroke="url(#wa-bh-grad)" strokeWidth="2.2" strokeLinecap="round" opacity="0.52" filter="url(#wa-bh-soft)" />
            <path d={mainPath} fill="none" stroke="url(#wa-bh-core)" strokeWidth="1.6" strokeLinecap="round" opacity="0.92" />
            <path
              className="whatsapp-bh-pulse"
              d={mainPath}
              fill="none"
              stroke="url(#wa-bh-core)"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              className="whatsapp-bh-pulse whatsapp-bh-pulse--wisp"
              d={wispPath}
              fill="none"
              stroke="url(#wa-bh-core)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        );
      })()}
      <div className="wrap whatsapp-community-wrap">
        <div ref={cardRef} className="whatsapp-community-card">
          <div className="whatsapp-community-copy">
            <span className="whatsapp-community-eyebrow">
              THE ECELL INNER CIRCLE
            </span>
            <h2 id="community-heading">
              <span>Your journey</span>
              <em>starts here.</em>
            </h2>
            <p>
              Meet builders, find your next collaborator, and be first in line for ECell opportunities.
            </p>
            <a
              className="whatsapp-community-cta"
              href={SITE_LINKS.whatsappGroup}
              target="_blank"
              rel="noreferrer"
            >
              Join the community
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h11M11 5l5 5-5 5" />
              </svg>
            </a>
            <span className="whatsapp-community-note"><b>700+ students</b> are already in the loop.</span>
          </div>

          <div
            className="whatsapp-community-visual"
            aria-label="Preview of the ECell WhatsApp community"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="whatsapp-community-phone">
              <div className="whatsapp-community-phone-header">
                <span className="whatsapp-community-avatar" aria-hidden="true">
                  <svg viewBox="0 0 512 512" fill="currentColor">
                    <g transform="translate(64.368, 57.136) scale(0.8)">
                      <path d="M403.309 45.848H271.137c-8.426 0-17.25 5.285-24.035 9.668-16.723 10.805-34.711 26.371-50.7 38.816-17.882 13.926-55.245 50.512-76.921 50.512H75.773v62.137h68.985c5.539 0 17.816-5.688 22.769-8.824 37.047-23.446 72.035-62.391 109.484-85.352 4.551-2.8 14.219-6.929 19.399-6.929h106.898z" />
                      <path d="M403.309 165.906h-91.098c-8.282 0-23.426 8.047-30.375 12.809-29.574 20.281-58.156 46.968-87.18 68.683-12.051 9.039-27.613 21.696-43.601 21.696H75.773v61.086h99.524c12.07 0 25.637-7.5 35.199-14.305 33.723-23.988 65.273-55.289 99.816-78.164 4.93-3.266 17.422-10.723 22.98-10.723h70.017z" />
                      <path d="M403.309 287.02h-58.43c-7.707 0-22.832 9.289-29.32 13.859-32.457 22.981-62.746 52.153-95.184 75.45-8.699 5.015-21.273 13.882-29.972 13.882H75.773v61.082h138.492c7.055 0 23.086-7.73 29.277-11.793 33.321-21.867 64.856-54.41 98.344-77.535 5.88-4.067 21.528-13.883 28.246-13.883h33.176z" />
                    </g>
                  </svg>
                </span>
                <span>
                  <b>ECell Community</b>
                  <small>700+ members</small>
                </span>
                <i>•••</i>
              </div>
              <div className="whatsapp-community-chat" aria-live="polite">
                <span className="whatsapp-community-chat-date">TODAY</span>
                <div ref={messagesRef} className="whatsapp-community-messages">
                  {messages.map((message) => (
                    <div
                      className={`whatsapp-community-message whatsapp-community-message-${message.sender}`}
                      key={message.id}
                    >
                      {message.sender === "bot" && <b>ECell Guide</b>}
                      {message.text}
                      <small>{message.time}</small>
                    </div>
                  ))}
                  {isTyping && <div className="whatsapp-community-typing"><i /><i /><i /> ECell Guide is typing</div>}
                </div>
                <div className="whatsapp-community-chips" role="group" aria-label="Suggested questions">
                  {COMMUNITY_QA_RULES.slice(1, 6).map((rule) => (
                    <button
                      key={rule.id}
                      type="button"
                      className="whatsapp-community-chip"
                      onClick={() => handleSelectQuestion(rule.chipLabel, rule.reply)}
                      disabled={isTyping}
                    >
                      {rule.chipLabel}
                    </button>
                  ))}
                </div>
                <form className="whatsapp-community-composer" onSubmit={handleSendMessage}>
                  <label className="sr-only" htmlFor="community-message">Ask the ECell guide</label>
                  <input
                    ref={inputRef}
                    id="community-message"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type a question here..."
                    maxLength={280}
                    autoComplete="off"
                  />
                  <button type="submit" aria-label="Send message" disabled={!draft.trim() || isTyping}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 3-7.8 18-3.3-7-6.9-3.2L21 3Zm-11 11 4.1-4.1" /></svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
