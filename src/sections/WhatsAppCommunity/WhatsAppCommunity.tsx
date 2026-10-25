"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { COMMUNITY_DEFAULT_REPLY, COMMUNITY_QA_RULES } from "@/src/content/community";
import { SITE_LINKS } from "@/src/content/site";

// WebGL beam (three.js) far down the page: load it in its own chunk.
const LaserFlow = dynamic(() => import("@/src/components/LaserFlow"), { ssr: false });
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

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsDecorativeReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

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
      {isDecorativeReady && (
        <div className="whatsapp-community-ambient-glow" aria-hidden="true" />
      )}
      <div className="wrap whatsapp-community-wrap">
        <div className="whatsapp-laser-header" aria-hidden="true">
          <LaserFlow
            horizontalBeamOffset={0.1}
            verticalBeamOffset={0.0}
            color="#8EDCFF"
          />
        </div>
        <div className="whatsapp-community-card">
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
                <span className="whatsapp-community-avatar">E</span>
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
