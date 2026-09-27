"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import "./Gallery.css";
import type Lenis from "lenis";
import { acquireLenis } from "@/src/utils/lenis";
import { gsap, ScrollTrigger } from "@/src/utils/gsapSetup";

/* ── Photo Imports ── */
import img_opening_1 from "@/src/assets/Argonyx26/opening/image.png";
import img_opening_2 from "@/src/assets/Argonyx26/opening/op1.png";
import img_opening_3 from "@/src/assets/Argonyx26/opening/op2.png";
import img_opening_4 from "@/src/assets/Argonyx26/opening/reg.png";
import img_opening_5 from "@/src/assets/Argonyx26/opening/reg2.png";
import img_opening_6 from "@/src/assets/Argonyx26/opening/reg3.png";
import img_opening_7 from "@/src/assets/Argonyx26/opening/reg4.png";
import img_opening_8 from "@/src/assets/Argonyx26/opening/reg5.png";
import img_inauguration_9 from "@/src/assets/Argonyx26/inaugration/alok1.png";
import img_inauguration_10 from "@/src/assets/Argonyx26/inaugration/alok2.png";
import img_inauguration_11 from "@/src/assets/Argonyx26/inaugration/ayush1.png";
import img_inauguration_12 from "@/src/assets/Argonyx26/inaugration/ayush2.png";
import img_inauguration_13 from "@/src/assets/Argonyx26/inaugration/eventLeads.png";
import img_inauguration_14 from "@/src/assets/Argonyx26/inaugration/ing1.png";
import img_inauguration_15 from "@/src/assets/Argonyx26/inaugration/ing2.png";
import img_inauguration_16 from "@/src/assets/Argonyx26/inaugration/ing3.png";
import img_inauguration_17 from "@/src/assets/Argonyx26/inaugration/ing4.png";
import img_inauguration_18 from "@/src/assets/Argonyx26/inaugration/ing5.png";
import img_inauguration_19 from "@/src/assets/Argonyx26/inaugration/me1.png";
import img_inauguration_20 from "@/src/assets/Argonyx26/inaugration/me2.png";
import img_coding_sessions_21 from "@/src/assets/Argonyx26/coding-session-1/image copy.png";
import img_coding_sessions_22 from "@/src/assets/Argonyx26/coding-session-1/image.png";
import img_lunch_23 from "@/src/assets/Argonyx26/lunch/Faculty.png";
import img_lunch_24 from "@/src/assets/Argonyx26/lunch/image copy 2.png";
import img_lunch_25 from "@/src/assets/Argonyx26/lunch/image copy 3.png";
import img_lunch_26 from "@/src/assets/Argonyx26/lunch/image copy 4.png";
import img_lunch_27 from "@/src/assets/Argonyx26/lunch/image copy.png";
import img_lunch_28 from "@/src/assets/Argonyx26/lunch/image.png";
import img_lunch_29 from "@/src/assets/Argonyx26/lunch/kushal.png";
import img_lunch_30 from "@/src/assets/Argonyx26/lunch/lunch1.png";
import img_lunch_31 from "@/src/assets/Argonyx26/lunch/lunch2.png";
import img_mentors_32 from "@/src/assets/Argonyx26/MentorsSessions/TallMen.png";
import img_mentors_33 from "@/src/assets/Argonyx26/MentorsSessions/TallMen2.png";
import img_mentors_34 from "@/src/assets/Argonyx26/MentorsSessions/TallMen3.png";
import img_mentors_35 from "@/src/assets/Argonyx26/MentorsSessions/TallMen4.png";
import img_mentors_36 from "@/src/assets/Argonyx26/MentorsSessions/apoorv1.png";
import img_mentors_37 from "@/src/assets/Argonyx26/MentorsSessions/apoorv2.png";
import img_mentors_38 from "@/src/assets/Argonyx26/MentorsSessions/apoorv3.png";
import img_mentors_39 from "@/src/assets/Argonyx26/MentorsSessions/apoorv4.png";
import img_mentors_40 from "@/src/assets/Argonyx26/MentorsSessions/apoorv5.png";
import img_mentors_41 from "@/src/assets/Argonyx26/MentorsSessions/apoorv6.png";
import img_mentors_42 from "@/src/assets/Argonyx26/MentorsSessions/apoorv7.png";
import img_mentors_43 from "@/src/assets/Argonyx26/MentorsSessions/apoorv8.png";
import img_mentors_44 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh1.png";
import img_mentors_45 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh2.png";
import img_mentors_46 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh3.png";
import img_mentors_47 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh4.png";
import img_mentors_48 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh5.png";
import img_mentors_49 from "@/src/assets/Argonyx26/MentorsSessions/longHairMen.png";
import img_mentors_50 from "@/src/assets/Argonyx26/MentorsSessions/longHairMen2.png";
import img_mentors_51 from "@/src/assets/Argonyx26/MentorsSessions/longHairMen3.png";
import img_mentors_52 from "@/src/assets/Argonyx26/MentorsSessions/longHairMen4.png";
import img_mentors_53 from "@/src/assets/Argonyx26/MentorsSessions/viksha1.png";
import img_mentors_54 from "@/src/assets/Argonyx26/MentorsSessions/viksha2.png";
import img_mentors_55 from "@/src/assets/Argonyx26/MentorsSessions/viksha3.png";
import img_mentors_56 from "@/src/assets/Argonyx26/MentorsSessions/viksha4.png";
import img_mentors_57 from "@/src/assets/Argonyx26/MentorsSessions/viksha5.png";
import img_mentors_58 from "@/src/assets/Argonyx26/MentorsSessions/viksha6.png";
import img_mentors_59 from "@/src/assets/Argonyx26/MentorsSessions/viksha7.png";
import img_judges_60 from "@/src/assets/Argonyx26/judges/image copy 5.png";
import img_judges_61 from "@/src/assets/Argonyx26/judges/image copy 6.png";
import img_round2_62 from "@/src/assets/Argonyx26/roun2/image copy 2.png";
import img_round2_63 from "@/src/assets/Argonyx26/roun2/image copy 3.png";
import img_round2_64 from "@/src/assets/Argonyx26/roun2/image copy 4.png";
import img_round2_65 from "@/src/assets/Argonyx26/roun2/image copy.png";
import img_round2_66 from "@/src/assets/Argonyx26/roun2/image.png";
import img_round2_walk_67 from "@/src/assets/Argonyx26/round2Walk/goat1.png";
import img_round2_walk_68 from "@/src/assets/Argonyx26/round2Walk/image copy 10.png";
import img_round2_walk_69 from "@/src/assets/Argonyx26/round2Walk/image copy 11.png";
import img_round2_walk_70 from "@/src/assets/Argonyx26/round2Walk/image copy 2.png";
import img_round2_walk_71 from "@/src/assets/Argonyx26/round2Walk/image copy 3.png";
import img_round2_walk_72 from "@/src/assets/Argonyx26/round2Walk/image copy 4.png";
import img_round2_walk_73 from "@/src/assets/Argonyx26/round2Walk/image copy 5.png";
import img_round2_walk_74 from "@/src/assets/Argonyx26/round2Walk/image copy 6.png";
import img_round2_walk_75 from "@/src/assets/Argonyx26/round2Walk/image copy 7.png";
import img_round2_walk_76 from "@/src/assets/Argonyx26/round2Walk/image copy 8.png";
import img_round2_walk_77 from "@/src/assets/Argonyx26/round2Walk/image copy 9.png";
import img_round2_walk_78 from "@/src/assets/Argonyx26/round2Walk/image copy.png";
import img_round2_walk_79 from "@/src/assets/Argonyx26/round2Walk/image.png";
import img_final_presentations_80 from "@/src/assets/Argonyx26/finalPresentation/image copy 10.png";
import img_final_presentations_81 from "@/src/assets/Argonyx26/finalPresentation/image copy 11.png";
import img_final_presentations_82 from "@/src/assets/Argonyx26/finalPresentation/image copy 12.png";
import img_final_presentations_83 from "@/src/assets/Argonyx26/finalPresentation/image copy 13.png";
import img_final_presentations_84 from "@/src/assets/Argonyx26/finalPresentation/image copy 14.png";
import img_final_presentations_85 from "@/src/assets/Argonyx26/finalPresentation/image copy 15.png";
import img_final_presentations_86 from "@/src/assets/Argonyx26/finalPresentation/image copy 16.png";
import img_final_presentations_87 from "@/src/assets/Argonyx26/finalPresentation/image copy 17.png";
import img_final_presentations_88 from "@/src/assets/Argonyx26/finalPresentation/image copy 18.png";
import img_final_presentations_89 from "@/src/assets/Argonyx26/finalPresentation/image copy 19.png";
import img_final_presentations_90 from "@/src/assets/Argonyx26/finalPresentation/image copy 2.png";
import img_final_presentations_91 from "@/src/assets/Argonyx26/finalPresentation/image copy 20.png";
import img_final_presentations_92 from "@/src/assets/Argonyx26/finalPresentation/image copy 21.png";
import img_final_presentations_93 from "@/src/assets/Argonyx26/finalPresentation/image copy 22.png";
import img_final_presentations_94 from "@/src/assets/Argonyx26/finalPresentation/image copy 23.png";
import img_final_presentations_95 from "@/src/assets/Argonyx26/finalPresentation/image copy 24.png";
import img_final_presentations_96 from "@/src/assets/Argonyx26/finalPresentation/image copy 25.png";
import img_final_presentations_97 from "@/src/assets/Argonyx26/finalPresentation/image copy 26.png";
import img_final_presentations_98 from "@/src/assets/Argonyx26/finalPresentation/image copy 27.png";
import img_final_presentations_99 from "@/src/assets/Argonyx26/finalPresentation/image copy 28.png";
import img_final_presentations_100 from "@/src/assets/Argonyx26/finalPresentation/image copy 29.png";
import img_final_presentations_101 from "@/src/assets/Argonyx26/finalPresentation/image copy 3.png";
import img_final_presentations_102 from "@/src/assets/Argonyx26/finalPresentation/image copy 30.png";
import img_final_presentations_103 from "@/src/assets/Argonyx26/finalPresentation/image copy 31.png";
import img_final_presentations_104 from "@/src/assets/Argonyx26/finalPresentation/image copy 32.png";
import img_final_presentations_105 from "@/src/assets/Argonyx26/finalPresentation/image copy 33.png";
import img_final_presentations_106 from "@/src/assets/Argonyx26/finalPresentation/image copy 34.png";
import img_final_presentations_107 from "@/src/assets/Argonyx26/finalPresentation/image copy 35.png";
import img_final_presentations_108 from "@/src/assets/Argonyx26/finalPresentation/image copy 36.png";
import img_final_presentations_109 from "@/src/assets/Argonyx26/finalPresentation/image copy 37.png";
import img_final_presentations_110 from "@/src/assets/Argonyx26/finalPresentation/image copy 38.png";
import img_final_presentations_111 from "@/src/assets/Argonyx26/finalPresentation/image copy 39.png";
import img_final_presentations_112 from "@/src/assets/Argonyx26/finalPresentation/image copy 4.png";
import img_final_presentations_113 from "@/src/assets/Argonyx26/finalPresentation/image copy 40.png";
import img_final_presentations_114 from "@/src/assets/Argonyx26/finalPresentation/image copy 41.png";
import img_final_presentations_115 from "@/src/assets/Argonyx26/finalPresentation/image copy 42.png";
import img_final_presentations_116 from "@/src/assets/Argonyx26/finalPresentation/image copy 5.png";
import img_final_presentations_117 from "@/src/assets/Argonyx26/finalPresentation/image copy 6.png";
import img_final_presentations_118 from "@/src/assets/Argonyx26/finalPresentation/image copy 7.png";
import img_final_presentations_119 from "@/src/assets/Argonyx26/finalPresentation/image copy 8.png";
import img_final_presentations_120 from "@/src/assets/Argonyx26/finalPresentation/image copy 9.png";
import img_final_presentations_121 from "@/src/assets/Argonyx26/finalPresentation/image copy.png";
import img_final_presentations_122 from "@/src/assets/Argonyx26/finalPresentation/image.png";
import img_selecting_winners_123 from "@/src/assets/Argonyx26/selectingWinners/image copy 10.png";
import img_selecting_winners_124 from "@/src/assets/Argonyx26/selectingWinners/image copy 11.png";
import img_selecting_winners_125 from "@/src/assets/Argonyx26/selectingWinners/image copy 12.png";
import img_selecting_winners_126 from "@/src/assets/Argonyx26/selectingWinners/image copy 13.png";
import img_selecting_winners_127 from "@/src/assets/Argonyx26/selectingWinners/image copy 14.png";
import img_selecting_winners_128 from "@/src/assets/Argonyx26/selectingWinners/image copy 15.png";
import img_selecting_winners_129 from "@/src/assets/Argonyx26/selectingWinners/image copy 16.png";
import img_selecting_winners_130 from "@/src/assets/Argonyx26/selectingWinners/image copy 17.png";
import img_selecting_winners_131 from "@/src/assets/Argonyx26/selectingWinners/image copy 2.png";
import img_selecting_winners_132 from "@/src/assets/Argonyx26/selectingWinners/image copy 3.png";
import img_selecting_winners_133 from "@/src/assets/Argonyx26/selectingWinners/image copy 4.png";
import img_selecting_winners_134 from "@/src/assets/Argonyx26/selectingWinners/image copy 5.png";
import img_selecting_winners_135 from "@/src/assets/Argonyx26/selectingWinners/image copy 6.png";
import img_selecting_winners_136 from "@/src/assets/Argonyx26/selectingWinners/image copy 7.png";
import img_selecting_winners_137 from "@/src/assets/Argonyx26/selectingWinners/image copy 8.png";
import img_selecting_winners_138 from "@/src/assets/Argonyx26/selectingWinners/image copy 9.png";
import img_selecting_winners_139 from "@/src/assets/Argonyx26/selectingWinners/image copy.png";
import img_selecting_winners_140 from "@/src/assets/Argonyx26/selectingWinners/image.png";
import img_dinner_141 from "@/src/assets/Argonyx26/dinner/image copy 2.png";
import img_dinner_142 from "@/src/assets/Argonyx26/dinner/image copy.png";
import img_dinner_143 from "@/src/assets/Argonyx26/dinner/image.png";
import img_dinner_144 from "@/src/assets/Argonyx26/dinner/mingos1.png";
import img_valedictory_145 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 10.png";
import img_valedictory_146 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 11.png";
import img_valedictory_147 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 12.png";
import img_valedictory_148 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 13.png";
import img_valedictory_149 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 14.png";
import img_valedictory_150 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 15.png";
import img_valedictory_151 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 16.png";
import img_valedictory_152 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 17.png";
import img_valedictory_153 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 18.png";
import img_valedictory_154 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 19.png";
import img_valedictory_155 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 2.png";
import img_valedictory_156 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 20.png";
import img_valedictory_157 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 21.png";
import img_valedictory_158 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 22.png";
import img_valedictory_159 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 23.png";
import img_valedictory_160 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 24.png";
import img_valedictory_161 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 25.png";
import img_valedictory_162 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 26.png";
import img_valedictory_163 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 3.png";
import img_valedictory_164 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 4.png";
import img_valedictory_165 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 5.png";
import img_valedictory_166 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 6.png";
import img_valedictory_167 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 7.png";
import img_valedictory_168 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 8.png";
import img_valedictory_169 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 9.png";
import img_valedictory_170 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy.png";
import img_valedictory_171 from "@/src/assets/Argonyx26/veridictoryCeremony/image.png";
/* ── Team Argonyx Photo ── */
import teamArgonyx from "@/src/assets/Argonyx26/Teams/TeamArgonyx.png";

/* ── Hero Showcase Photos (strictly from Argonyx26 folder) ── */
import heroStagePhoto from "@/src/assets/Argonyx26/opening/op2.png";
import heroWelcomePhoto from "@/src/assets/Argonyx26/opening/reg.png";
import heroHackingPhoto from "@/src/assets/Argonyx26/coding-session-1/image.png";
import heroAudiencePhoto from "@/src/assets/Argonyx26/round2Walk/image.png";

/* ────────────────────────────── GALLERY DATA ────────────────────────────── */

interface GalleryPhoto {
  src: StaticImageData;
  alt: string;
}

interface GallerySection {
  id: string;
  title: string;
  eyebrow: string;
  photos: GalleryPhoto[];
}

/* Sections in exact chronological hackathon flow */
const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: "opening",
    title: "Registration & Opening",
    eyebrow: "DAY 1 · ARRIVAL",
    photos: [
      { src: img_opening_1, alt: "Registration desk & opening ceremony · moment" },
      { src: img_opening_2, alt: "Registration desk & opening ceremony · op1" },
      { src: img_opening_3, alt: "Registration desk & opening ceremony · op2" },
      { src: img_opening_4, alt: "Registration desk & opening ceremony · reg" },
      { src: img_opening_5, alt: "Registration desk & opening ceremony · reg2" },
      { src: img_opening_6, alt: "Registration desk & opening ceremony · reg3" },
      { src: img_opening_7, alt: "Registration desk & opening ceremony · reg4" },
      { src: img_opening_8, alt: "Registration desk & opening ceremony · reg5" },
    ],
  },
  {
    id: "inauguration",
    title: "Inauguration Ceremony",
    eyebrow: "KEYNOTE · DAY 1",
    photos: [
      { src: img_inauguration_9, alt: "Inauguration ceremony address · alok1" },
      { src: img_inauguration_10, alt: "Inauguration ceremony address · alok2" },
      { src: img_inauguration_11, alt: "Inauguration ceremony address · ayush1" },
      { src: img_inauguration_12, alt: "Inauguration ceremony address · ayush2" },
      { src: img_inauguration_13, alt: "Inauguration ceremony address · eventLeads" },
      { src: img_inauguration_14, alt: "Inauguration ceremony address · ing1" },
      { src: img_inauguration_15, alt: "Inauguration ceremony address · ing2" },
      { src: img_inauguration_16, alt: "Inauguration ceremony address · ing3" },
      { src: img_inauguration_17, alt: "Inauguration ceremony address · ing4" },
      { src: img_inauguration_18, alt: "Inauguration ceremony address · ing5" },
      { src: img_inauguration_19, alt: "Inauguration ceremony address · me1" },
      { src: img_inauguration_20, alt: "Inauguration ceremony address · me2" },
    ],
  },
  {
    id: "coding-sessions",
    title: "Coding Sessions",
    eyebrow: "HACKING FLOOR · 24 HOURS",
    photos: [
      { src: img_coding_sessions_21, alt: "Hackers coding on the floor · moment 1" },
      { src: img_coding_sessions_22, alt: "Hackers coding on the floor · moment" },
    ],
  },
  {
    id: "lunch",
    title: "Lunch & Breaks",
    eyebrow: "REFUEL · MID-DAY",
    photos: [
      { src: img_lunch_23, alt: "Lunch break & networking · Faculty" },
      { src: img_lunch_24, alt: "Lunch break & networking · moment 2" },
      { src: img_lunch_25, alt: "Lunch break & networking · moment 3" },
      { src: img_lunch_26, alt: "Lunch break & networking · moment 4" },
      { src: img_lunch_27, alt: "Lunch break & networking · moment 1" },
      { src: img_lunch_28, alt: "Lunch break & networking · moment" },
      { src: img_lunch_29, alt: "Lunch break & networking · kushal" },
      { src: img_lunch_30, alt: "Lunch break & networking · lunch1" },
      { src: img_lunch_31, alt: "Lunch break & networking · lunch2" },
    ],
  },
  {
    id: "mentors",
    title: "Mentor Sessions & Reviews",
    eyebrow: "MENTORSHIP · DAY 1 & 2",
    photos: [
      { src: img_mentors_32, alt: "Mentorship & code review · TallMen" },
      { src: img_mentors_33, alt: "Mentorship & code review · TallMen2" },
      { src: img_mentors_34, alt: "Mentorship & code review · TallMen3" },
      { src: img_mentors_35, alt: "Mentorship & code review · TallMen4" },
      { src: img_mentors_36, alt: "Mentorship & code review · apoorv1" },
      { src: img_mentors_37, alt: "Mentorship & code review · apoorv2" },
      { src: img_mentors_38, alt: "Mentorship & code review · apoorv3" },
      { src: img_mentors_39, alt: "Mentorship & code review · apoorv4" },
      { src: img_mentors_40, alt: "Mentorship & code review · apoorv5" },
      { src: img_mentors_41, alt: "Mentorship & code review · apoorv6" },
      { src: img_mentors_42, alt: "Mentorship & code review · apoorv7" },
      { src: img_mentors_43, alt: "Mentorship & code review · apoorv8" },
      { src: img_mentors_44, alt: "Mentorship & code review · jaineesh1" },
      { src: img_mentors_45, alt: "Mentorship & code review · jaineesh2" },
      { src: img_mentors_46, alt: "Mentorship & code review · jaineesh3" },
      { src: img_mentors_47, alt: "Mentorship & code review · jaineesh4" },
      { src: img_mentors_48, alt: "Mentorship & code review · jaineesh5" },
      { src: img_mentors_49, alt: "Mentorship & code review · longHairMen" },
      { src: img_mentors_50, alt: "Mentorship & code review · longHairMen2" },
      { src: img_mentors_51, alt: "Mentorship & code review · longHairMen3" },
      { src: img_mentors_52, alt: "Mentorship & code review · longHairMen4" },
      { src: img_mentors_53, alt: "Mentorship & code review · viksha1" },
      { src: img_mentors_54, alt: "Mentorship & code review · viksha2" },
      { src: img_mentors_55, alt: "Mentorship & code review · viksha3" },
      { src: img_mentors_56, alt: "Mentorship & code review · viksha4" },
      { src: img_mentors_57, alt: "Mentorship & code review · viksha5" },
      { src: img_mentors_58, alt: "Mentorship & code review · viksha6" },
      { src: img_mentors_59, alt: "Mentorship & code review · viksha7" },
    ],
  },
  {
    id: "judges",
    title: "Judging Panel & Evaluations",
    eyebrow: "JURY ROUND · DAY 2",
    photos: [
      { src: img_judges_60, alt: "Judging panel evaluation · moment 5" },
      { src: img_judges_61, alt: "Judging panel evaluation · moment 6" },
    ],
  },
  {
    id: "round2",
    title: "Round 2 — Pitches",
    eyebrow: "DEMO DAY · DAY 2",
    photos: [
      { src: img_round2_62, alt: "Round 2 pitch presentation · moment 2" },
      { src: img_round2_63, alt: "Round 2 pitch presentation · moment 3" },
      { src: img_round2_64, alt: "Round 2 pitch presentation · moment 4" },
      { src: img_round2_65, alt: "Round 2 pitch presentation · moment 1" },
      { src: img_round2_66, alt: "Round 2 pitch presentation · moment" },
    ],
  },
  {
    id: "round2-walk",
    title: "Round 2 — Walkthrough & Demos",
    eyebrow: "DEMO WALK · DAY 2",
    photos: [
      { src: img_round2_walk_67, alt: "Round 2 project walkthrough · goat1" },
      { src: img_round2_walk_68, alt: "Round 2 project walkthrough · moment 10" },
      { src: img_round2_walk_69, alt: "Round 2 project walkthrough · moment 11" },
      { src: img_round2_walk_70, alt: "Round 2 project walkthrough · moment 2" },
      { src: img_round2_walk_71, alt: "Round 2 project walkthrough · moment 3" },
      { src: img_round2_walk_72, alt: "Round 2 project walkthrough · moment 4" },
      { src: img_round2_walk_73, alt: "Round 2 project walkthrough · moment 5" },
      { src: img_round2_walk_74, alt: "Round 2 project walkthrough · moment 6" },
      { src: img_round2_walk_75, alt: "Round 2 project walkthrough · moment 7" },
      { src: img_round2_walk_76, alt: "Round 2 project walkthrough · moment 8" },
      { src: img_round2_walk_77, alt: "Round 2 project walkthrough · moment 9" },
      { src: img_round2_walk_78, alt: "Round 2 project walkthrough · moment 1" },
      { src: img_round2_walk_79, alt: "Round 2 project walkthrough · moment" },
    ],
  },
  {
    id: "final-presentations",
    title: "Final Presentations",
    eyebrow: "SHOWTIME · DAY 2",
    photos: [
      { src: img_final_presentations_80, alt: "Final presentation on stage · moment 10" },
      { src: img_final_presentations_81, alt: "Final presentation on stage · moment 11" },
      { src: img_final_presentations_82, alt: "Final presentation on stage · moment 12" },
      { src: img_final_presentations_83, alt: "Final presentation on stage · moment 13" },
      { src: img_final_presentations_84, alt: "Final presentation on stage · moment 14" },
      { src: img_final_presentations_85, alt: "Final presentation on stage · moment 15" },
      { src: img_final_presentations_86, alt: "Final presentation on stage · moment 16" },
      { src: img_final_presentations_87, alt: "Final presentation on stage · moment 17" },
      { src: img_final_presentations_88, alt: "Final presentation on stage · moment 18" },
      { src: img_final_presentations_89, alt: "Final presentation on stage · moment 19" },
      { src: img_final_presentations_90, alt: "Final presentation on stage · moment 2" },
      { src: img_final_presentations_91, alt: "Final presentation on stage · moment 20" },
      { src: img_final_presentations_92, alt: "Final presentation on stage · moment 21" },
      { src: img_final_presentations_93, alt: "Final presentation on stage · moment 22" },
      { src: img_final_presentations_94, alt: "Final presentation on stage · moment 23" },
      { src: img_final_presentations_95, alt: "Final presentation on stage · moment 24" },
      { src: img_final_presentations_96, alt: "Final presentation on stage · moment 25" },
      { src: img_final_presentations_97, alt: "Final presentation on stage · moment 26" },
      { src: img_final_presentations_98, alt: "Final presentation on stage · moment 27" },
      { src: img_final_presentations_99, alt: "Final presentation on stage · moment 28" },
      { src: img_final_presentations_100, alt: "Final presentation on stage · moment 29" },
      { src: img_final_presentations_101, alt: "Final presentation on stage · moment 3" },
      { src: img_final_presentations_102, alt: "Final presentation on stage · moment 30" },
      { src: img_final_presentations_103, alt: "Final presentation on stage · moment 31" },
      { src: img_final_presentations_104, alt: "Final presentation on stage · moment 32" },
      { src: img_final_presentations_105, alt: "Final presentation on stage · moment 33" },
      { src: img_final_presentations_106, alt: "Final presentation on stage · moment 34" },
      { src: img_final_presentations_107, alt: "Final presentation on stage · moment 35" },
      { src: img_final_presentations_108, alt: "Final presentation on stage · moment 36" },
      { src: img_final_presentations_109, alt: "Final presentation on stage · moment 37" },
      { src: img_final_presentations_110, alt: "Final presentation on stage · moment 38" },
      { src: img_final_presentations_111, alt: "Final presentation on stage · moment 39" },
      { src: img_final_presentations_112, alt: "Final presentation on stage · moment 4" },
      { src: img_final_presentations_113, alt: "Final presentation on stage · moment 40" },
      { src: img_final_presentations_114, alt: "Final presentation on stage · moment 41" },
      { src: img_final_presentations_115, alt: "Final presentation on stage · moment 42" },
      { src: img_final_presentations_116, alt: "Final presentation on stage · moment 5" },
      { src: img_final_presentations_117, alt: "Final presentation on stage · moment 6" },
      { src: img_final_presentations_118, alt: "Final presentation on stage · moment 7" },
      { src: img_final_presentations_119, alt: "Final presentation on stage · moment 8" },
      { src: img_final_presentations_120, alt: "Final presentation on stage · moment 9" },
      { src: img_final_presentations_121, alt: "Final presentation on stage · moment 1" },
      { src: img_final_presentations_122, alt: "Final presentation on stage · moment" },
    ],
  },
  {
    id: "selecting-winners",
    title: "Selecting Winners",
    eyebrow: "DELIBERATION · DAY 2",
    photos: [
      { src: img_selecting_winners_123, alt: "Winner selection deliberation · moment 10" },
      { src: img_selecting_winners_124, alt: "Winner selection deliberation · moment 11" },
      { src: img_selecting_winners_125, alt: "Winner selection deliberation · moment 12" },
      { src: img_selecting_winners_126, alt: "Winner selection deliberation · moment 13" },
      { src: img_selecting_winners_127, alt: "Winner selection deliberation · moment 14" },
      { src: img_selecting_winners_128, alt: "Winner selection deliberation · moment 15" },
      { src: img_selecting_winners_129, alt: "Winner selection deliberation · moment 16" },
      { src: img_selecting_winners_130, alt: "Winner selection deliberation · moment 17" },
      { src: img_selecting_winners_131, alt: "Winner selection deliberation · moment 2" },
      { src: img_selecting_winners_132, alt: "Winner selection deliberation · moment 3" },
      { src: img_selecting_winners_133, alt: "Winner selection deliberation · moment 4" },
      { src: img_selecting_winners_134, alt: "Winner selection deliberation · moment 5" },
      { src: img_selecting_winners_135, alt: "Winner selection deliberation · moment 6" },
      { src: img_selecting_winners_136, alt: "Winner selection deliberation · moment 7" },
      { src: img_selecting_winners_137, alt: "Winner selection deliberation · moment 8" },
      { src: img_selecting_winners_138, alt: "Winner selection deliberation · moment 9" },
      { src: img_selecting_winners_139, alt: "Winner selection deliberation · moment 1" },
      { src: img_selecting_winners_140, alt: "Winner selection deliberation · moment" },
    ],
  },
  {
    id: "dinner",
    title: "Dinner & Celebrations",
    eyebrow: "CELEBRATION · EVENING",
    photos: [
      { src: img_dinner_141, alt: "Celebration dinner · moment 2" },
      { src: img_dinner_142, alt: "Celebration dinner · moment 1" },
      { src: img_dinner_143, alt: "Celebration dinner · moment" },
      { src: img_dinner_144, alt: "Celebration dinner · mingos1" },
    ],
  },
  {
    id: "valedictory",
    title: "Valedictory Ceremony",
    eyebrow: "CLOSING · GRAND FINALE",
    photos: [
      { src: img_valedictory_145, alt: "Valedictory awards ceremony · moment 10" },
      { src: img_valedictory_146, alt: "Valedictory awards ceremony · moment 11" },
      { src: img_valedictory_147, alt: "Valedictory awards ceremony · moment 12" },
      { src: img_valedictory_148, alt: "Valedictory awards ceremony · moment 13" },
      { src: img_valedictory_149, alt: "Valedictory awards ceremony · moment 14" },
      { src: img_valedictory_150, alt: "Valedictory awards ceremony · moment 15" },
      { src: img_valedictory_151, alt: "Valedictory awards ceremony · moment 16" },
      { src: img_valedictory_152, alt: "Valedictory awards ceremony · moment 17" },
      { src: img_valedictory_153, alt: "Valedictory awards ceremony · moment 18" },
      { src: img_valedictory_154, alt: "Valedictory awards ceremony · moment 19" },
      { src: img_valedictory_155, alt: "Valedictory awards ceremony · moment 2" },
      { src: img_valedictory_156, alt: "Valedictory awards ceremony · moment 20" },
      { src: img_valedictory_157, alt: "Valedictory awards ceremony · moment 21" },
      { src: img_valedictory_158, alt: "Valedictory awards ceremony · moment 22" },
      { src: img_valedictory_159, alt: "Valedictory awards ceremony · moment 23" },
      { src: img_valedictory_160, alt: "Valedictory awards ceremony · moment 24" },
      { src: img_valedictory_161, alt: "Valedictory awards ceremony · moment 25" },
      { src: img_valedictory_162, alt: "Valedictory awards ceremony · moment 26" },
      { src: img_valedictory_163, alt: "Valedictory awards ceremony · moment 3" },
      { src: img_valedictory_164, alt: "Valedictory awards ceremony · moment 4" },
      { src: img_valedictory_165, alt: "Valedictory awards ceremony · moment 5" },
      { src: img_valedictory_166, alt: "Valedictory awards ceremony · moment 6" },
      { src: img_valedictory_167, alt: "Valedictory awards ceremony · moment 7" },
      { src: img_valedictory_168, alt: "Valedictory awards ceremony · moment 8" },
      { src: img_valedictory_169, alt: "Valedictory awards ceremony · moment 9" },
      { src: img_valedictory_170, alt: "Valedictory awards ceremony · moment 1" },
      { src: img_valedictory_171, alt: "Valedictory awards ceremony · moment" },
    ],
  },
];

/* ────────────────────────────── LIGHTBOX ────────────────────────────── */

function Lightbox({
  photo,
  onClose,
  onPrev,
  onNext,
  currentIndex,
  totalCount,
}: {
  photo: GalleryPhoto;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalCount: number;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose} aria-label="Close Lightbox">
          ✕
        </button>
        <button
          className="lightbox-nav lightbox-nav--prev"
          onClick={onPrev}
          aria-label="Previous Photo"
        >
          ←
        </button>
        <div className="lightbox-image-wrap">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="95vw"
            style={{ objectFit: "contain" }}
            quality={92}
            priority
          />
        </div>
        <button
          className="lightbox-nav lightbox-nav--next"
          onClick={onNext}
          aria-label="Next Photo"
        >
          →
        </button>
        <div className="lightbox-bottom-bar">
          <p className="lightbox-caption">{photo.alt}</p>
          <span className="lightbox-counter">
            {currentIndex + 1} / {totalCount}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────── MAIN COMPONENT ────────────────────────────── */

export default function GalleryClient() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxSection, setLightboxSection] = useState<string | null>(null);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const topbarRef = useRef<HTMLElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const finaleStageRef = useRef<HTMLDivElement | null>(null);
  const finalePinRef = useRef<HTMLDivElement | null>(null);
  const loveLayerRef = useRef<HTMLDivElement | null>(null);
  const teamLayerRef = useRef<HTMLDivElement | null>(null);
  const teamImgWrapRef = useRef<HTMLDivElement | null>(null);
  const teamOverlayRef = useRef<HTMLDivElement | null>(null);

  const allPhotos = GALLERY_SECTIONS.flatMap((s) =>
    s.photos.map((p) => ({ ...p, sectionId: s.id }))
  );
  const totalCount = allPhotos.length;

  const filteredSections =
    activeFilter === "all"
      ? GALLERY_SECTIONS
      : GALLERY_SECTIONS.filter((s) => s.id === activeFilter);

  const openLightbox = useCallback((sectionId: string, idx: number) => {
    setLightboxSection(sectionId);
    setLightboxIndex(idx);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setLightboxSection(null);
  }, []);

  const currentSection = GALLERY_SECTIONS.find((s) => s.id === lightboxSection);
  const currentPhotos = currentSection?.photos || [];

  const goLightboxPrev = useCallback(() => {
    if (lightboxIndex === null || currentPhotos.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + currentPhotos.length) % currentPhotos.length);
  }, [lightboxIndex, currentPhotos.length]);

  const goLightboxNext = useCallback(() => {
    if (lightboxIndex === null || currentPhotos.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % currentPhotos.length);
  }, [lightboxIndex, currentPhotos.length]);

  const scrollToSection = (sectionId: string) => {
    setActiveFilter(sectionId);
    if (sectionId === "team-photo") {
      if (finaleStageRef.current) {
        const stageTop =
          finaleStageRef.current.getBoundingClientRect().top + window.scrollY;
        const targetTop = stageTop + window.innerHeight * 2.1;
        if (lenisRef.current) {
          lenisRef.current.scrollTo(targetTop, { duration: 1.6 });
        } else {
          window.scrollTo({ top: targetTop, behavior: "smooth" });
        }
      }
      return;
    }

    const el = sectionRefs.current[sectionId];
    if (el) {
      const targetTop = el.getBoundingClientRect().top + window.scrollY - 80;
      if (lenisRef.current) {
        lenisRef.current.scrollTo(targetTop, { duration: 1.2 });
      } else {
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const html = document.documentElement;
    const orig = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const t = setTimeout(() => {
      html.style.scrollBehavior = orig;
    }, 100);
    return () => clearTimeout(t);
  }, []);

  /* ── GSAP ScrollTrigger + Lenis for Team Photo Transition ── */
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const lenisHandle = isMobile ? null : acquireLenis();
    if (lenisHandle) {
      lenisRef.current = lenisHandle.instance;
    }

    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        if (teamLayerRef.current) {
          gsap.set(teamLayerRef.current, { yPercent: 0, scale: 1, borderRadius: 0 });
        }
        return;
      }

      if (!finaleStageRef.current || !finalePinRef.current || !teamLayerRef.current) return;

      // Initial positions
      gsap.set(loveLayerRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
      });

      gsap.set(teamLayerRef.current, {
        yPercent: 100,
        scale: 0.86,
        borderRadius: "28px",
        boxShadow: "0 35px 90px rgba(0, 0, 0, 0.9), 0 0 50px rgba(245, 158, 11, 0.12)",
        transformOrigin: "center bottom",
      });

      const imgEl = teamImgWrapRef.current?.querySelector("img");
      if (imgEl) {
        gsap.set(imgEl, { scale: 1.18, transformOrigin: "center center" });
      }

      if (teamOverlayRef.current) {
        gsap.set(teamOverlayRef.current, { opacity: 0, y: 35 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: finaleStageRef.current,
          start: "top top",
          end: "+=220%",
          pin: finalePinRef.current,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 0. Remove topbar from last photo (glide up & fade out)
      if (topbarRef.current) {
        tl.to(
          topbarRef.current,
          {
            yPercent: -100,
            opacity: 0,
            duration: 0.25,
            ease: "power2.inOut",
          },
          0
        );
      }

      // 1. "With love" layer gently lifts and dissolves away
      if (loveLayerRef.current) {
        tl.to(
          loveLayerRef.current,
          {
            opacity: 0,
            y: -60,
            scale: 0.94,
            duration: 0.35,
            ease: "power2.inOut",
          },
          0
        );
      }

      // 2. Team photo rises up from bottom to full screen
      tl.to(
        teamLayerRef.current,
        {
          yPercent: 0,
          scale: 1,
          borderRadius: "0px",
          boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
          duration: 0.75,
          ease: "power2.out",
        },
        0.15
      );

      // 3. Parallax image inside frame settles from 1.18 to 1.0
      if (imgEl) {
        tl.to(
          imgEl,
          {
            scale: 1.0,
            duration: 0.75,
            ease: "power2.out",
          },
          0.15
        );
      }

      // 4. Badge and team credit emerge smoothly
      if (teamOverlayRef.current) {
        tl.to(
          teamOverlayRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: "power3.out",
          },
          0.65
        );
      }
    }, finaleStageRef);

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
      lenisHandle?.release();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div className="gallery-page">
      {/* ── TOP BAR ── */}
      <header className="gallery-topbar" ref={topbarRef}>
        <div className="gallery-topbar__inner">
          <Link className="gallery-topbar__back" href="/events/argonyx-26">
            <span className="arrow">←</span> ARGONYX &apos;26
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="gallery-hero">
        <div className="gallery-hero__inner">
          <div className="gallery-hero__content">
            <p className="gallery-eyebrow">
              <span className="gallery-eyebrow__rule" />
              Photo Gallery · Argonyx &apos;26
            </p>
            <h1 className="gallery-hero__headline">
              Moments from
              <span className="gallery-hero__accent"> the floor.</span>
            </h1>
            <p className="gallery-hero__body">
              Highlights from the 24-hour national hackathon sprint at RV University — from opening
              arrival and keynote ceremonies to midnight coding, mentor reviews, live pitch defenses,
              and the podium finale.
            </p>
          </div>

          {/* ── HERO SHOWCASE COLLAGE (Photos from Argonyx folder only) ── */}
          <div className="gallery-hero__showcase" aria-label="Argonyx '26 photo collage">
            {/* Center / Main stage photo */}
            <div className="gallery-showcase__card gallery-showcase__card--main">
              <Image
                src={heroStagePhoto}
                alt="Argonyx '26 Keynote Auditorium Stage"
                fill
                sizes="(max-width: 1024px) 80vw, 45vw"
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="gallery-showcase__main-gradient" />
            </div>

            {/* Left tilted photo with 'IDEAS PEOPLE PROGRESS' accent */}
            <div className="gallery-showcase__left-wrap">
              <div className="gallery-showcase__tag gallery-showcase__tag--left">
                <span>IDEAS</span>
                <span>PEOPLE</span>
                <span>PROGRESS</span>
              </div>
              <div className="gallery-showcase__card gallery-showcase__card--left">
                <Image
                  src={heroWelcomePhoto}
                  alt="Argonyx '26 Welcome Banner and Registration"
                  fill
                  sizes="(max-width: 1024px) 35vw, 18vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>

            {/* Top-right tilted photo */}
            <div className="gallery-showcase__card gallery-showcase__card--top-right">
              <Image
                src={heroHackingPhoto}
                alt="Hackers sprinting at laptops"
                fill
                sizes="(max-width: 1024px) 35vw, 18vw"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>

            {/* Bottom-right photo with 'MORE THAN A HACKATHON' accent */}
            <div className="gallery-showcase__right-wrap">
              <div className="gallery-showcase__tag gallery-showcase__tag--right">
                <span>MORE</span>
                <span>THAN A</span>
                <span className="gallery-showcase__tag-accent">HACKATHON</span>
                <svg
                  className="gallery-showcase__brush"
                  viewBox="0 0 140 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10C40 3 95 4 137 8"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="gallery-showcase__card gallery-showcase__card--bottom-right">
                <Image
                  src={heroAudiencePhoto}
                  alt="Hackathon audience and demo showcase"
                  fill
                  sizes="(max-width: 1024px) 35vw, 18vw"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <nav className="gallery-filters" aria-label="Gallery Categories">
        <div className="gallery-filters__inner">
          <button
            type="button"
            className={`gallery-filter-btn ${activeFilter === "all" ? "is-active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All
          </button>
          {GALLERY_SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`gallery-filter-btn ${activeFilter === s.id ? "is-active" : ""}`}
              onClick={() => scrollToSection(s.id)}
            >
              {s.title}
            </button>
          ))}
          <button
            type="button"
            className="gallery-filter-btn gallery-filter-btn--team"
            onClick={() => scrollToSection("team-photo")}
          >
            ♥ Team Photo
          </button>
        </div>
      </nav>

      {/* ── CHRONOLOGICAL SECTIONS ── */}
      <main className="gallery-main">
        {filteredSections.map((section, sIdx) => (
          <section
            key={section.id}
            id={`gallery-${section.id}`}
            className="gallery-section"
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
          >
            <div className="gallery-section__header">
              <p className="gallery-eyebrow">
                <span className="gallery-eyebrow__rule" />
                {section.eyebrow}
              </p>
              <div className="gallery-section__title-row">
                <h2 className="gallery-section__title">
                  <span className="gallery-section__index">0{sIdx + 1}.</span> {section.title}
                </h2>
              </div>
            </div>

            <div className="gallery-grid">
              {section.photos.map((photo, idx) => (
                <button
                  key={`${section.id}-${idx}`}
                  type="button"
                  className="gallery-card"
                  onClick={() => openLightbox(section.id, idx)}
                  aria-label={`View ${photo.alt}`}
                >
                  <div className="gallery-card__media">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      style={{ objectFit: "cover" }}
                      quality={75}
                      loading="lazy"
                    />
                    <div className="gallery-card__overlay">
                      <span className="gallery-card__zoom-icon" aria-hidden="true">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* ── FINALE: WITH LOVE + TEAM ARGONYX GSAP & LENIS TRANSITION ── */}
      <section
        id="team-photo"
        className="gallery-finale-stage"
        ref={finaleStageRef}
        aria-label="Argonyx '26 Team Finale"
      >
        <div className="gallery-finale-pin" ref={finalePinRef}>
          {/* 'With Love' Transition Layer */}
          <div className="gallery-love-layer" ref={loveLayerRef}>
            <div className="gallery-love-transition__inner">
              <div className="gallery-love-transition__sparkle" aria-hidden="true">✦</div>
              <p className="gallery-love-transition__text">
                with love,
              </p>
              <h2 className="gallery-love-transition__team">
                Argonyx Team
              </h2>
              <div className="gallery-love-transition__line" />
              <p className="gallery-love-transition__sub">
                Built by builders, for builders. RV University · 2026
              </p>
              <div className="gallery-love-transition__scroll-indicator">
                <span className="gallery-love-transition__scroll-text">Scroll to reveal</span>
                <span className="gallery-love-transition__scroll-arrow">↓</span>
              </div>
            </div>
          </div>

          {/* Team Photo Reveal Layer (rises from bottom to fullscreen) */}
          <div className="gallery-team-layer" ref={teamLayerRef}>
            <div className="gallery-team-photo__img-wrap" ref={teamImgWrapRef}>
              <Image
                src={teamArgonyx}
                alt="Team Argonyx '26 — The team behind RV University's national hackathon"
                fill
                sizes="100vw"
                style={{ objectFit: "cover" }}
                quality={95}
                priority
              />
              <div className="gallery-team-photo__overlay" ref={teamOverlayRef}>
                <div className="gallery-team-photo__caption-wrap">
                  <h2 className="gallery-team-photo__title">
                    TEAM ARGONYX
                  </h2>
                  <p className="gallery-team-photo__sub">
                    Organised by ECell, IEEE and VIKSHA Coding Club
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightboxIndex !== null && currentPhotos[lightboxIndex] && (
        <Lightbox
          photo={currentPhotos[lightboxIndex]}
          onClose={closeLightbox}
          onPrev={goLightboxPrev}
          onNext={goLightboxNext}
          currentIndex={lightboxIndex}
          totalCount={currentPhotos.length}
        />
      )}
    </div>
  );
}
