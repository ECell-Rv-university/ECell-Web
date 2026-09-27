"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import "./Gallery.css";
import type Lenis from "lenis";
import { acquireLenis } from "@/src/utils/lenis";
import { gsap, ScrollTrigger } from "@/src/utils/gsapSetup";
import DepthCarousel, { type DepthCarouselItem } from "./DepthCarousel";

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
import img_inauguration_14 from "@/src/assets/Argonyx26/inaugration/image copy 2.png";
import img_inauguration_15 from "@/src/assets/Argonyx26/inaugration/image copy 3.png";
import img_inauguration_16 from "@/src/assets/Argonyx26/inaugration/image copy.png";
import img_inauguration_17 from "@/src/assets/Argonyx26/inaugration/image.png";
import img_inauguration_18 from "@/src/assets/Argonyx26/inaugration/ing1.png";
import img_inauguration_19 from "@/src/assets/Argonyx26/inaugration/ing2.png";
import img_inauguration_20 from "@/src/assets/Argonyx26/inaugration/ing3.png";
import img_inauguration_21 from "@/src/assets/Argonyx26/inaugration/ing4.png";
import img_inauguration_22 from "@/src/assets/Argonyx26/inaugration/ing5.png";
import img_inauguration_23 from "@/src/assets/Argonyx26/inaugration/me1.png";
import img_inauguration_24 from "@/src/assets/Argonyx26/inaugration/me2.png";
import img_coding_sessions_25 from "@/src/assets/Argonyx26/coding-session-1/image copy 2.png";
import img_coding_sessions_26 from "@/src/assets/Argonyx26/coding-session-1/image copy 3.png";
import img_coding_sessions_27 from "@/src/assets/Argonyx26/coding-session-1/image copy 4.png";
import img_coding_sessions_28 from "@/src/assets/Argonyx26/coding-session-1/image copy 5.png";
import img_coding_sessions_29 from "@/src/assets/Argonyx26/coding-session-1/image copy 6.png";
import img_coding_sessions_30 from "@/src/assets/Argonyx26/coding-session-1/image copy 7.png";
import img_coding_sessions_31 from "@/src/assets/Argonyx26/coding-session-1/image copy 8.png";
import img_coding_sessions_32 from "@/src/assets/Argonyx26/coding-session-1/image copy 9.png";
import img_coding_sessions_33 from "@/src/assets/Argonyx26/coding-session-1/image copy 10.png";
import img_coding_sessions_34 from "@/src/assets/Argonyx26/coding-session-1/image copy 11.png";
import img_coding_sessions_35 from "@/src/assets/Argonyx26/coding-session-1/image copy 12.png";
import img_coding_sessions_36 from "@/src/assets/Argonyx26/coding-session-1/image copy 13.png";
import img_coding_sessions_37 from "@/src/assets/Argonyx26/coding-session-1/image copy 14.png";
import img_coding_sessions_38 from "@/src/assets/Argonyx26/coding-session-1/image copy 15.png";
import img_coding_sessions_39 from "@/src/assets/Argonyx26/coding-session-1/image copy 16.png";
import img_coding_sessions_40 from "@/src/assets/Argonyx26/coding-session-1/image copy 17.png";
import img_coding_sessions_41 from "@/src/assets/Argonyx26/coding-session-1/image copy 18.png";
import img_coding_sessions_42 from "@/src/assets/Argonyx26/coding-session-1/image copy 19.png";
import img_coding_sessions_43 from "@/src/assets/Argonyx26/coding-session-1/image copy 20.png";
import img_coding_sessions_44 from "@/src/assets/Argonyx26/coding-session-1/image copy 21.png";
import img_coding_sessions_45 from "@/src/assets/Argonyx26/coding-session-1/image copy 22.png";
import img_coding_sessions_46 from "@/src/assets/Argonyx26/coding-session-1/image copy 23.png";
import img_coding_sessions_47 from "@/src/assets/Argonyx26/coding-session-1/image copy 24.png";
import img_coding_sessions_48 from "@/src/assets/Argonyx26/coding-session-1/image copy 25.png";
import img_coding_sessions_49 from "@/src/assets/Argonyx26/coding-session-1/image copy 26.png";
import img_coding_sessions_50 from "@/src/assets/Argonyx26/coding-session-1/image copy 27.png";
import img_coding_sessions_51 from "@/src/assets/Argonyx26/coding-session-1/image copy 28.png";
import img_coding_sessions_52 from "@/src/assets/Argonyx26/coding-session-1/image copy 29.png";
import img_coding_sessions_53 from "@/src/assets/Argonyx26/coding-session-1/image copy 30.png";
import img_coding_sessions_54 from "@/src/assets/Argonyx26/coding-session-1/image copy 31.png";
import img_coding_sessions_55 from "@/src/assets/Argonyx26/coding-session-1/image copy 32.png";
import img_coding_sessions_56 from "@/src/assets/Argonyx26/coding-session-1/image copy 33.png";
import img_coding_sessions_57 from "@/src/assets/Argonyx26/coding-session-1/image copy 34.png";
import img_coding_sessions_58 from "@/src/assets/Argonyx26/coding-session-1/image copy 35.png";
import img_coding_sessions_59 from "@/src/assets/Argonyx26/coding-session-1/image copy 36.png";
import img_coding_sessions_60 from "@/src/assets/Argonyx26/coding-session-1/image copy 37.png";
import img_coding_sessions_61 from "@/src/assets/Argonyx26/coding-session-1/image copy 38.png";
import img_coding_sessions_62 from "@/src/assets/Argonyx26/coding-session-1/image copy 39.png";
import img_coding_sessions_63 from "@/src/assets/Argonyx26/coding-session-1/image copy 40.png";
import img_coding_sessions_64 from "@/src/assets/Argonyx26/coding-session-1/image copy.png";
import img_coding_sessions_65 from "@/src/assets/Argonyx26/coding-session-1/image.png";
import img_lunch_66 from "@/src/assets/Argonyx26/lunch/Faculty.png";
import img_lunch_67 from "@/src/assets/Argonyx26/lunch/image copy 2.png";
import img_lunch_68 from "@/src/assets/Argonyx26/lunch/image copy 3.png";
import img_lunch_69 from "@/src/assets/Argonyx26/lunch/image copy 4.png";
import img_lunch_70 from "@/src/assets/Argonyx26/lunch/image copy 5.png";
import img_lunch_71 from "@/src/assets/Argonyx26/lunch/image copy 6.png";
import img_lunch_72 from "@/src/assets/Argonyx26/lunch/image copy 7.png";
import img_lunch_73 from "@/src/assets/Argonyx26/lunch/image copy 8.png";
import img_lunch_74 from "@/src/assets/Argonyx26/lunch/image copy 9.png";
import img_lunch_75 from "@/src/assets/Argonyx26/lunch/image copy 10.png";
import img_lunch_76 from "@/src/assets/Argonyx26/lunch/image copy 11.png";
import img_lunch_77 from "@/src/assets/Argonyx26/lunch/image copy 12.png";
import img_lunch_78 from "@/src/assets/Argonyx26/lunch/image copy 13.png";
import img_lunch_79 from "@/src/assets/Argonyx26/lunch/image copy 14.png";
import img_lunch_80 from "@/src/assets/Argonyx26/lunch/image copy 15.png";
import img_lunch_81 from "@/src/assets/Argonyx26/lunch/image copy 16.png";
import img_lunch_82 from "@/src/assets/Argonyx26/lunch/image copy.png";
import img_lunch_83 from "@/src/assets/Argonyx26/lunch/image.png";
import img_lunch_84 from "@/src/assets/Argonyx26/lunch/kushal.png";
import img_lunch_85 from "@/src/assets/Argonyx26/lunch/lunch1.png";
import img_lunch_86 from "@/src/assets/Argonyx26/lunch/lunch2.png";
import img_lunch_87 from "@/src/assets/Argonyx26/Break/image.png";
import img_mentors_88 from "@/src/assets/Argonyx26/MentorsSessions/apoorv1.png";
import img_mentors_89 from "@/src/assets/Argonyx26/MentorsSessions/apoorv2.png";
import img_mentors_90 from "@/src/assets/Argonyx26/MentorsSessions/apoorv3.png";
import img_mentors_91 from "@/src/assets/Argonyx26/MentorsSessions/apoorv4.png";
import img_mentors_92 from "@/src/assets/Argonyx26/MentorsSessions/apoorv5.png";
import img_mentors_93 from "@/src/assets/Argonyx26/MentorsSessions/apoorv6.png";
import img_mentors_94 from "@/src/assets/Argonyx26/MentorsSessions/apoorv7.png";
import img_mentors_95 from "@/src/assets/Argonyx26/MentorsSessions/apoorv8.png";
import img_mentors_96 from "@/src/assets/Argonyx26/MentorsSessions/apoorv9.png";
import img_mentors_97 from "@/src/assets/Argonyx26/MentorsSessions/apoorv11.png";
import img_mentors_98 from "@/src/assets/Argonyx26/MentorsSessions/apoorv12.png";
import img_mentors_99 from "@/src/assets/Argonyx26/MentorsSessions/apoorv13.png";
import img_mentors_100 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh1.png";
import img_mentors_101 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh2.png";
import img_mentors_102 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh3.png";
import img_mentors_103 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh4.png";
import img_mentors_104 from "@/src/assets/Argonyx26/MentorsSessions/jaineesh5.png";
import img_mentors_105 from "@/src/assets/Argonyx26/MentorsSessions/longHairMen.png";
import img_mentors_106 from "@/src/assets/Argonyx26/MentorsSessions/longHairMen2.png";
import img_mentors_107 from "@/src/assets/Argonyx26/MentorsSessions/longHairMen3.png";
import img_mentors_108 from "@/src/assets/Argonyx26/MentorsSessions/longHairMen4.png";
import img_mentors_109 from "@/src/assets/Argonyx26/MentorsSessions/TallMen.png";
import img_mentors_110 from "@/src/assets/Argonyx26/MentorsSessions/TallMen2.png";
import img_mentors_111 from "@/src/assets/Argonyx26/MentorsSessions/TallMen3.png";
import img_mentors_112 from "@/src/assets/Argonyx26/MentorsSessions/TallMen4.png";
import img_mentors_113 from "@/src/assets/Argonyx26/MentorsSessions/TallMen5.png";
import img_mentors_114 from "@/src/assets/Argonyx26/MentorsSessions/TallMen8.png";
import img_mentors_115 from "@/src/assets/Argonyx26/MentorsSessions/viksha1.png";
import img_mentors_116 from "@/src/assets/Argonyx26/MentorsSessions/viksha2.png";
import img_mentors_117 from "@/src/assets/Argonyx26/MentorsSessions/viksha3.png";
import img_mentors_118 from "@/src/assets/Argonyx26/MentorsSessions/viksha4.png";
import img_mentors_119 from "@/src/assets/Argonyx26/MentorsSessions/viksha5.png";
import img_mentors_120 from "@/src/assets/Argonyx26/MentorsSessions/viksha6.png";
import img_mentors_121 from "@/src/assets/Argonyx26/MentorsSessions/viksha7.png";
import img_mentors_122 from "@/src/assets/Argonyx26/MentorsSessions/viksha8.png";
import img_mentors_123 from "@/src/assets/Argonyx26/MentorsSessions/viksha11.png";
import img_mentors_124 from "@/src/assets/Argonyx26/MentorsSessions/viksha12.png";
import img_mentors_125 from "@/src/assets/Argonyx26/MentorsSessions/viksha13.png";
import img_mentors_126 from "@/src/assets/Argonyx26/MentorsSessions/viksha14.png";
import img_mentors_127 from "@/src/assets/Argonyx26/MentorsSessions/viksha15.png";
import img_mentors_128 from "@/src/assets/Argonyx26/MentorsSessions/viksha16.png";
import img_mentors_129 from "@/src/assets/Argonyx26/MentorsSessions/viksha17.png";
import img_mentors_130 from "@/src/assets/Argonyx26/MentorsSessions/viksha18.png";
import img_night_coding_131 from "@/src/assets/Argonyx26/nightCoding/image copy 2.png";
import img_night_coding_132 from "@/src/assets/Argonyx26/nightCoding/image copy 3.png";
import img_night_coding_133 from "@/src/assets/Argonyx26/nightCoding/image copy 4.png";
import img_night_coding_134 from "@/src/assets/Argonyx26/nightCoding/image copy.png";
import img_night_coding_135 from "@/src/assets/Argonyx26/nightCoding/image.png";
import img_night_break_136 from "@/src/assets/Argonyx26/nightBreak/image copy 2.png";
import img_night_break_137 from "@/src/assets/Argonyx26/nightBreak/image copy 3.png";
import img_night_break_138 from "@/src/assets/Argonyx26/nightBreak/image copy 4.png";
import img_night_break_139 from "@/src/assets/Argonyx26/nightBreak/image copy 5.png";
import img_night_break_140 from "@/src/assets/Argonyx26/nightBreak/image copy 6.png";
import img_night_break_141 from "@/src/assets/Argonyx26/nightBreak/image copy.png";
import img_night_break_142 from "@/src/assets/Argonyx26/nightBreak/image.png";
import img_round2_walk_143 from "@/src/assets/Argonyx26/round2Walk/goat1.png";
import img_round2_walk_144 from "@/src/assets/Argonyx26/round2Walk/image copy 2.png";
import img_round2_walk_145 from "@/src/assets/Argonyx26/round2Walk/image copy 3.png";
import img_round2_walk_146 from "@/src/assets/Argonyx26/round2Walk/image copy 4.png";
import img_round2_walk_147 from "@/src/assets/Argonyx26/round2Walk/image copy 5.png";
import img_round2_walk_148 from "@/src/assets/Argonyx26/round2Walk/image copy 6.png";
import img_round2_walk_149 from "@/src/assets/Argonyx26/round2Walk/image copy 7.png";
import img_round2_walk_150 from "@/src/assets/Argonyx26/round2Walk/image copy 8.png";
import img_round2_walk_151 from "@/src/assets/Argonyx26/round2Walk/image copy 9.png";
import img_round2_walk_152 from "@/src/assets/Argonyx26/round2Walk/image copy 10.png";
import img_round2_walk_153 from "@/src/assets/Argonyx26/round2Walk/image copy 11.png";
import img_round2_walk_154 from "@/src/assets/Argonyx26/round2Walk/image copy.png";
import img_round2_walk_155 from "@/src/assets/Argonyx26/round2Walk/image.png";
import img_round2_156 from "@/src/assets/Argonyx26/roun2/image copy 2.png";
import img_round2_157 from "@/src/assets/Argonyx26/roun2/image copy 3.png";
import img_round2_158 from "@/src/assets/Argonyx26/roun2/image copy 4.png";
import img_round2_159 from "@/src/assets/Argonyx26/roun2/image copy.png";
import img_round2_160 from "@/src/assets/Argonyx26/roun2/image.png";
import img_judges_161 from "@/src/assets/Argonyx26/judges/image copy 2.png";
import img_judges_162 from "@/src/assets/Argonyx26/judges/image copy 5.png";
import img_judges_163 from "@/src/assets/Argonyx26/judges/image copy 6.png";
import img_judges_164 from "@/src/assets/Argonyx26/judges/image copy.png";
import img_judges_165 from "@/src/assets/Argonyx26/judges/image.png";
import img_final_pitch_166 from "@/src/assets/Argonyx26/finalPresentation/image copy 2.png";
import img_final_pitch_167 from "@/src/assets/Argonyx26/finalPresentation/image copy 3.png";
import img_final_pitch_168 from "@/src/assets/Argonyx26/finalPresentation/image copy 4.png";
import img_final_pitch_169 from "@/src/assets/Argonyx26/finalPresentation/image copy 5.png";
import img_final_pitch_170 from "@/src/assets/Argonyx26/finalPresentation/image copy 6.png";
import img_final_pitch_171 from "@/src/assets/Argonyx26/finalPresentation/image copy 7.png";
import img_final_pitch_172 from "@/src/assets/Argonyx26/finalPresentation/image copy 8.png";
import img_final_pitch_173 from "@/src/assets/Argonyx26/finalPresentation/image copy 9.png";
import img_final_pitch_174 from "@/src/assets/Argonyx26/finalPresentation/image copy 10.png";
import img_final_pitch_175 from "@/src/assets/Argonyx26/finalPresentation/image copy 11.png";
import img_final_pitch_176 from "@/src/assets/Argonyx26/finalPresentation/image copy 12.png";
import img_final_pitch_177 from "@/src/assets/Argonyx26/finalPresentation/image copy 13.png";
import img_final_pitch_178 from "@/src/assets/Argonyx26/finalPresentation/image copy 14.png";
import img_final_pitch_179 from "@/src/assets/Argonyx26/finalPresentation/image copy 15.png";
import img_final_pitch_180 from "@/src/assets/Argonyx26/finalPresentation/image copy 16.png";
import img_final_pitch_181 from "@/src/assets/Argonyx26/finalPresentation/image copy 17.png";
import img_final_pitch_182 from "@/src/assets/Argonyx26/finalPresentation/image copy 18.png";
import img_final_pitch_183 from "@/src/assets/Argonyx26/finalPresentation/image copy 19.png";
import img_final_pitch_184 from "@/src/assets/Argonyx26/finalPresentation/image copy 20.png";
import img_final_pitch_185 from "@/src/assets/Argonyx26/finalPresentation/image copy 21.png";
import img_final_pitch_186 from "@/src/assets/Argonyx26/finalPresentation/image copy 22.png";
import img_final_pitch_187 from "@/src/assets/Argonyx26/finalPresentation/image copy 23.png";
import img_final_pitch_188 from "@/src/assets/Argonyx26/finalPresentation/image copy 24.png";
import img_final_pitch_189 from "@/src/assets/Argonyx26/finalPresentation/image copy 25.png";
import img_final_pitch_190 from "@/src/assets/Argonyx26/finalPresentation/image copy 26.png";
import img_final_pitch_191 from "@/src/assets/Argonyx26/finalPresentation/image copy 27.png";
import img_final_pitch_192 from "@/src/assets/Argonyx26/finalPresentation/image copy 28.png";
import img_final_pitch_193 from "@/src/assets/Argonyx26/finalPresentation/image copy 29.png";
import img_final_pitch_194 from "@/src/assets/Argonyx26/finalPresentation/image copy 30.png";
import img_final_pitch_195 from "@/src/assets/Argonyx26/finalPresentation/image copy 31.png";
import img_final_pitch_196 from "@/src/assets/Argonyx26/finalPresentation/image copy 32.png";
import img_final_pitch_197 from "@/src/assets/Argonyx26/finalPresentation/image copy 33.png";
import img_final_pitch_198 from "@/src/assets/Argonyx26/finalPresentation/image copy 34.png";
import img_final_pitch_199 from "@/src/assets/Argonyx26/finalPresentation/image copy 35.png";
import img_final_pitch_200 from "@/src/assets/Argonyx26/finalPresentation/image copy 36.png";
import img_final_pitch_201 from "@/src/assets/Argonyx26/finalPresentation/image copy 37.png";
import img_final_pitch_202 from "@/src/assets/Argonyx26/finalPresentation/image copy 38.png";
import img_final_pitch_203 from "@/src/assets/Argonyx26/finalPresentation/image copy 39.png";
import img_final_pitch_204 from "@/src/assets/Argonyx26/finalPresentation/image copy 40.png";
import img_final_pitch_205 from "@/src/assets/Argonyx26/finalPresentation/image copy 41.png";
import img_final_pitch_206 from "@/src/assets/Argonyx26/finalPresentation/image copy 42.png";
import img_final_pitch_207 from "@/src/assets/Argonyx26/finalPresentation/image copy 43.png";
import img_final_pitch_208 from "@/src/assets/Argonyx26/finalPresentation/image copy 44.png";
import img_final_pitch_209 from "@/src/assets/Argonyx26/finalPresentation/image copy 45.png";
import img_final_pitch_210 from "@/src/assets/Argonyx26/finalPresentation/image copy 46.png";
import img_final_pitch_211 from "@/src/assets/Argonyx26/finalPresentation/image copy 47.png";
import img_final_pitch_212 from "@/src/assets/Argonyx26/finalPresentation/image copy 48.png";
import img_final_pitch_213 from "@/src/assets/Argonyx26/finalPresentation/image copy 49.png";
import img_final_pitch_214 from "@/src/assets/Argonyx26/finalPresentation/image copy 50.png";
import img_final_pitch_215 from "@/src/assets/Argonyx26/finalPresentation/image copy 51.png";
import img_final_pitch_216 from "@/src/assets/Argonyx26/finalPresentation/image copy 52.png";
import img_final_pitch_217 from "@/src/assets/Argonyx26/finalPresentation/image copy 53.png";
import img_final_pitch_218 from "@/src/assets/Argonyx26/finalPresentation/image copy 54.png";
import img_final_pitch_219 from "@/src/assets/Argonyx26/finalPresentation/image copy 55.png";
import img_final_pitch_220 from "@/src/assets/Argonyx26/finalPresentation/image copy 56.png";
import img_final_pitch_221 from "@/src/assets/Argonyx26/finalPresentation/image copy 57.png";
import img_final_pitch_222 from "@/src/assets/Argonyx26/finalPresentation/image copy 58.png";
import img_final_pitch_223 from "@/src/assets/Argonyx26/finalPresentation/image copy 59.png";
import img_final_pitch_224 from "@/src/assets/Argonyx26/finalPresentation/image copy 60.png";
import img_final_pitch_225 from "@/src/assets/Argonyx26/finalPresentation/image copy 61.png";
import img_final_pitch_226 from "@/src/assets/Argonyx26/finalPresentation/image copy 62.png";
import img_final_pitch_227 from "@/src/assets/Argonyx26/finalPresentation/image copy 63.png";
import img_final_pitch_228 from "@/src/assets/Argonyx26/finalPresentation/image copy 64.png";
import img_final_pitch_229 from "@/src/assets/Argonyx26/finalPresentation/image copy 65.png";
import img_final_pitch_230 from "@/src/assets/Argonyx26/finalPresentation/image copy 66.png";
import img_final_pitch_231 from "@/src/assets/Argonyx26/finalPresentation/image copy 67.png";
import img_final_pitch_232 from "@/src/assets/Argonyx26/finalPresentation/image copy 68.png";
import img_final_pitch_233 from "@/src/assets/Argonyx26/finalPresentation/image copy 69.png";
import img_final_pitch_234 from "@/src/assets/Argonyx26/finalPresentation/image copy 70.png";
import img_final_pitch_235 from "@/src/assets/Argonyx26/finalPresentation/image copy 71.png";
import img_final_pitch_236 from "@/src/assets/Argonyx26/finalPresentation/image copy 72.png";
import img_final_pitch_237 from "@/src/assets/Argonyx26/finalPresentation/image copy 73.png";
import img_final_pitch_238 from "@/src/assets/Argonyx26/finalPresentation/image copy 74.png";
import img_final_pitch_239 from "@/src/assets/Argonyx26/finalPresentation/image copy 75.png";
import img_final_pitch_240 from "@/src/assets/Argonyx26/finalPresentation/image copy 76.png";
import img_final_pitch_241 from "@/src/assets/Argonyx26/finalPresentation/image copy 77.png";
import img_final_pitch_242 from "@/src/assets/Argonyx26/finalPresentation/image copy 78.png";
import img_final_pitch_243 from "@/src/assets/Argonyx26/finalPresentation/image copy 79.png";
import img_final_pitch_244 from "@/src/assets/Argonyx26/finalPresentation/image copy 80.png";
import img_final_pitch_245 from "@/src/assets/Argonyx26/finalPresentation/image copy 81.png";
import img_final_pitch_246 from "@/src/assets/Argonyx26/finalPresentation/image copy 82.png";
import img_final_pitch_247 from "@/src/assets/Argonyx26/finalPresentation/image copy 83.png";
import img_final_pitch_248 from "@/src/assets/Argonyx26/finalPresentation/image copy 84.png";
import img_final_pitch_249 from "@/src/assets/Argonyx26/finalPresentation/image copy 85.png";
import img_final_pitch_250 from "@/src/assets/Argonyx26/finalPresentation/image copy 86.png";
import img_final_pitch_251 from "@/src/assets/Argonyx26/finalPresentation/image copy 87.png";
import img_final_pitch_252 from "@/src/assets/Argonyx26/finalPresentation/image copy 88.png";
import img_final_pitch_253 from "@/src/assets/Argonyx26/finalPresentation/image copy 89.png";
import img_final_pitch_254 from "@/src/assets/Argonyx26/finalPresentation/image copy 90.png";
import img_final_pitch_255 from "@/src/assets/Argonyx26/finalPresentation/image copy 91.png";
import img_final_pitch_256 from "@/src/assets/Argonyx26/finalPresentation/image copy 92.png";
import img_final_pitch_257 from "@/src/assets/Argonyx26/finalPresentation/image copy 93.png";
import img_final_pitch_258 from "@/src/assets/Argonyx26/finalPresentation/image copy 94.png";
import img_final_pitch_259 from "@/src/assets/Argonyx26/finalPresentation/image copy 95.png";
import img_final_pitch_260 from "@/src/assets/Argonyx26/finalPresentation/image copy.png";
import img_final_pitch_261 from "@/src/assets/Argonyx26/finalPresentation/image.png";
import img_selecting_teams_262 from "@/src/assets/Argonyx26/selectingWinners/image copy 2.png";
import img_selecting_teams_263 from "@/src/assets/Argonyx26/selectingWinners/image copy 3.png";
import img_selecting_teams_264 from "@/src/assets/Argonyx26/selectingWinners/image copy 4.png";
import img_selecting_teams_265 from "@/src/assets/Argonyx26/selectingWinners/image copy 5.png";
import img_selecting_teams_266 from "@/src/assets/Argonyx26/selectingWinners/image copy 6.png";
import img_selecting_teams_267 from "@/src/assets/Argonyx26/selectingWinners/image copy 7.png";
import img_selecting_teams_268 from "@/src/assets/Argonyx26/selectingWinners/image copy 8.png";
import img_selecting_teams_269 from "@/src/assets/Argonyx26/selectingWinners/image copy 9.png";
import img_selecting_teams_270 from "@/src/assets/Argonyx26/selectingWinners/image copy 10.png";
import img_selecting_teams_271 from "@/src/assets/Argonyx26/selectingWinners/image copy 11.png";
import img_selecting_teams_272 from "@/src/assets/Argonyx26/selectingWinners/image copy 12.png";
import img_selecting_teams_273 from "@/src/assets/Argonyx26/selectingWinners/image copy 13.png";
import img_selecting_teams_274 from "@/src/assets/Argonyx26/selectingWinners/image copy 14.png";
import img_selecting_teams_275 from "@/src/assets/Argonyx26/selectingWinners/image copy 15.png";
import img_selecting_teams_276 from "@/src/assets/Argonyx26/selectingWinners/image copy 16.png";
import img_selecting_teams_277 from "@/src/assets/Argonyx26/selectingWinners/image copy 17.png";
import img_selecting_teams_278 from "@/src/assets/Argonyx26/selectingWinners/image copy 18.png";
import img_selecting_teams_279 from "@/src/assets/Argonyx26/selectingWinners/image copy 19.png";
import img_selecting_teams_280 from "@/src/assets/Argonyx26/selectingWinners/image copy 20.png";
import img_selecting_teams_281 from "@/src/assets/Argonyx26/selectingWinners/image copy.png";
import img_selecting_teams_282 from "@/src/assets/Argonyx26/selectingWinners/image.png";
import img_valedictory_283 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 2.png";
import img_valedictory_284 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 3.png";
import img_valedictory_285 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 4.png";
import img_valedictory_286 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 5.png";
import img_valedictory_287 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 6.png";
import img_valedictory_288 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 7.png";
import img_valedictory_289 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 8.png";
import img_valedictory_290 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 9.png";
import img_valedictory_291 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 10.png";
import img_valedictory_292 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 11.png";
import img_valedictory_293 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 12.png";
import img_valedictory_294 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 13.png";
import img_valedictory_295 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 14.png";
import img_valedictory_296 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 15.png";
import img_valedictory_297 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 16.png";
import img_valedictory_298 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 17.png";
import img_valedictory_299 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 18.png";
import img_valedictory_300 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 19.png";
import img_valedictory_301 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 20.png";
import img_valedictory_302 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 21.png";
import img_valedictory_303 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 22.png";
import img_valedictory_304 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 23.png";
import img_valedictory_305 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 24.png";
import img_valedictory_306 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 25.png";
import img_valedictory_307 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 26.png";
import img_valedictory_308 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy 27.png";
import img_valedictory_309 from "@/src/assets/Argonyx26/veridictoryCeremony/image copy.png";
import img_valedictory_310 from "@/src/assets/Argonyx26/veridictoryCeremony/image.png";
import img_winners_311 from "@/src/assets/Argonyx26/winningTeams/winner.png";
import img_winners_312 from "@/src/assets/Argonyx26/winningTeams/runnerups.png";
import img_winners_313 from "@/src/assets/Argonyx26/winningTeams/secondrunnerup.png";
import img_winners_314 from "@/src/assets/Argonyx26/Winners/secondRunnerUp.png";
import img_winners_315 from "@/src/assets/Argonyx26/Winners/image.png";
import img_winners_316 from "@/src/assets/Argonyx26/Winners/image copy.png";
import img_winners_317 from "@/src/assets/Argonyx26/Winners/image copy 2.png";
import img_winners_318 from "@/src/assets/Argonyx26/Winners/image copy 3.png";
import img_winners_319 from "@/src/assets/Argonyx26/Winners/image copy 4.png";

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

/* Sections in exact chronological hackathon flow:
   opening -> inauguration -> coding session -> lunch -> mentors -> night coding -> night break -> round2 walk -> round 2 -> judges -> final pitch -> selecting teams -> valedictory -> winners
*/
const GALLERY_SECTIONS: GallerySection[] = [
  {
    id: "opening",
    title: "Registration & Opening",
    eyebrow: "DAY 1 · ARRIVAL",
    photos: [
      { src: img_opening_1, alt: "Registration & Opening · image" },
      { src: img_opening_2, alt: "Registration & Opening · op1" },
      { src: img_opening_3, alt: "Registration & Opening · op2" },
      { src: img_opening_4, alt: "Registration & Opening · reg" },
      { src: img_opening_5, alt: "Registration & Opening · reg2" },
      { src: img_opening_6, alt: "Registration & Opening · reg3" },
      { src: img_opening_7, alt: "Registration & Opening · reg4" },
      { src: img_opening_8, alt: "Registration & Opening · reg5" }
    ],
  },
  {
    id: "inauguration",
    title: "Inauguration Ceremony",
    eyebrow: "KEYNOTE · DAY 1",
    photos: [
      { src: img_inauguration_9, alt: "Inauguration Ceremony · alok1" },
      { src: img_inauguration_10, alt: "Inauguration Ceremony · alok2" },
      { src: img_inauguration_11, alt: "Inauguration Ceremony · ayush1" },
      { src: img_inauguration_12, alt: "Inauguration Ceremony · ayush2" },
      { src: img_inauguration_13, alt: "Inauguration Ceremony · eventLeads" },
      { src: img_inauguration_14, alt: "Inauguration Ceremony · image copy 2" },
      { src: img_inauguration_15, alt: "Inauguration Ceremony · image copy 3" },
      { src: img_inauguration_16, alt: "Inauguration Ceremony · image copy" },
      { src: img_inauguration_17, alt: "Inauguration Ceremony · image" },
      { src: img_inauguration_18, alt: "Inauguration Ceremony · ing1" },
      { src: img_inauguration_19, alt: "Inauguration Ceremony · ing2" },
      { src: img_inauguration_20, alt: "Inauguration Ceremony · ing3" },
      { src: img_inauguration_21, alt: "Inauguration Ceremony · ing4" },
      { src: img_inauguration_22, alt: "Inauguration Ceremony · ing5" },
      { src: img_inauguration_23, alt: "Inauguration Ceremony · me1" },
      { src: img_inauguration_24, alt: "Inauguration Ceremony · me2" }
    ],
  },
  {
    id: "coding-sessions",
    title: "Coding Sessions",
    eyebrow: "HACKING FLOOR · 24 HOURS",
    photos: [
      { src: img_coding_sessions_25, alt: "Coding Sessions · image copy 2" },
      { src: img_coding_sessions_26, alt: "Coding Sessions · image copy 3" },
      { src: img_coding_sessions_27, alt: "Coding Sessions · image copy 4" },
      { src: img_coding_sessions_28, alt: "Coding Sessions · image copy 5" },
      { src: img_coding_sessions_29, alt: "Coding Sessions · image copy 6" },
      { src: img_coding_sessions_30, alt: "Coding Sessions · image copy 7" },
      { src: img_coding_sessions_31, alt: "Coding Sessions · image copy 8" },
      { src: img_coding_sessions_32, alt: "Coding Sessions · image copy 9" },
      { src: img_coding_sessions_33, alt: "Coding Sessions · image copy 10" },
      { src: img_coding_sessions_34, alt: "Coding Sessions · image copy 11" },
      { src: img_coding_sessions_35, alt: "Coding Sessions · image copy 12" },
      { src: img_coding_sessions_36, alt: "Coding Sessions · image copy 13" },
      { src: img_coding_sessions_37, alt: "Coding Sessions · image copy 14" },
      { src: img_coding_sessions_38, alt: "Coding Sessions · image copy 15" },
      { src: img_coding_sessions_39, alt: "Coding Sessions · image copy 16" },
      { src: img_coding_sessions_40, alt: "Coding Sessions · image copy 17" },
      { src: img_coding_sessions_41, alt: "Coding Sessions · image copy 18" },
      { src: img_coding_sessions_42, alt: "Coding Sessions · image copy 19" },
      { src: img_coding_sessions_43, alt: "Coding Sessions · image copy 20" },
      { src: img_coding_sessions_44, alt: "Coding Sessions · image copy 21" },
      { src: img_coding_sessions_45, alt: "Coding Sessions · image copy 22" },
      { src: img_coding_sessions_46, alt: "Coding Sessions · image copy 23" },
      { src: img_coding_sessions_47, alt: "Coding Sessions · image copy 24" },
      { src: img_coding_sessions_48, alt: "Coding Sessions · image copy 25" },
      { src: img_coding_sessions_49, alt: "Coding Sessions · image copy 26" },
      { src: img_coding_sessions_50, alt: "Coding Sessions · image copy 27" },
      { src: img_coding_sessions_51, alt: "Coding Sessions · image copy 28" },
      { src: img_coding_sessions_52, alt: "Coding Sessions · image copy 29" },
      { src: img_coding_sessions_53, alt: "Coding Sessions · image copy 30" },
      { src: img_coding_sessions_54, alt: "Coding Sessions · image copy 31" },
      { src: img_coding_sessions_55, alt: "Coding Sessions · image copy 32" },
      { src: img_coding_sessions_56, alt: "Coding Sessions · image copy 33" },
      { src: img_coding_sessions_57, alt: "Coding Sessions · image copy 34" },
      { src: img_coding_sessions_58, alt: "Coding Sessions · image copy 35" },
      { src: img_coding_sessions_59, alt: "Coding Sessions · image copy 36" },
      { src: img_coding_sessions_60, alt: "Coding Sessions · image copy 37" },
      { src: img_coding_sessions_61, alt: "Coding Sessions · image copy 38" },
      { src: img_coding_sessions_62, alt: "Coding Sessions · image copy 39" },
      { src: img_coding_sessions_63, alt: "Coding Sessions · image copy 40" },
      { src: img_coding_sessions_64, alt: "Coding Sessions · image copy" },
      { src: img_coding_sessions_65, alt: "Coding Sessions · image" }
    ],
  },
  {
    id: "lunch",
    title: "Lunch & Breaks",
    eyebrow: "REFUEL · MID-DAY",
    photos: [
      { src: img_lunch_66, alt: "Lunch & Breaks · Faculty" },
      { src: img_lunch_67, alt: "Lunch & Breaks · image copy 2" },
      { src: img_lunch_68, alt: "Lunch & Breaks · image copy 3" },
      { src: img_lunch_69, alt: "Lunch & Breaks · image copy 4" },
      { src: img_lunch_70, alt: "Lunch & Breaks · image copy 5" },
      { src: img_lunch_71, alt: "Lunch & Breaks · image copy 6" },
      { src: img_lunch_72, alt: "Lunch & Breaks · image copy 7" },
      { src: img_lunch_73, alt: "Lunch & Breaks · image copy 8" },
      { src: img_lunch_74, alt: "Lunch & Breaks · image copy 9" },
      { src: img_lunch_75, alt: "Lunch & Breaks · image copy 10" },
      { src: img_lunch_76, alt: "Lunch & Breaks · image copy 11" },
      { src: img_lunch_77, alt: "Lunch & Breaks · image copy 12" },
      { src: img_lunch_78, alt: "Lunch & Breaks · image copy 13" },
      { src: img_lunch_79, alt: "Lunch & Breaks · image copy 14" },
      { src: img_lunch_80, alt: "Lunch & Breaks · image copy 15" },
      { src: img_lunch_81, alt: "Lunch & Breaks · image copy 16" },
      { src: img_lunch_82, alt: "Lunch & Breaks · image copy" },
      { src: img_lunch_83, alt: "Lunch & Breaks · image" },
      { src: img_lunch_84, alt: "Lunch & Breaks · kushal" },
      { src: img_lunch_85, alt: "Lunch & Breaks · lunch1" },
      { src: img_lunch_86, alt: "Lunch & Breaks · lunch2" },
      { src: img_lunch_87, alt: "Lunch & Breaks · image" }
    ],
  },
  {
    id: "mentors",
    title: "Mentor Sessions & Reviews",
    eyebrow: "MENTORSHIP · DAY 1 & 2",
    photos: [
      { src: img_mentors_88, alt: "Mentor Sessions & Reviews · apoorv1" },
      { src: img_mentors_89, alt: "Mentor Sessions & Reviews · apoorv2" },
      { src: img_mentors_90, alt: "Mentor Sessions & Reviews · apoorv3" },
      { src: img_mentors_91, alt: "Mentor Sessions & Reviews · apoorv4" },
      { src: img_mentors_92, alt: "Mentor Sessions & Reviews · apoorv5" },
      { src: img_mentors_93, alt: "Mentor Sessions & Reviews · apoorv6" },
      { src: img_mentors_94, alt: "Mentor Sessions & Reviews · apoorv7" },
      { src: img_mentors_95, alt: "Mentor Sessions & Reviews · apoorv8" },
      { src: img_mentors_96, alt: "Mentor Sessions & Reviews · apoorv9" },
      { src: img_mentors_97, alt: "Mentor Sessions & Reviews · apoorv11" },
      { src: img_mentors_98, alt: "Mentor Sessions & Reviews · apoorv12" },
      { src: img_mentors_99, alt: "Mentor Sessions & Reviews · apoorv13" },
      { src: img_mentors_100, alt: "Mentor Sessions & Reviews · jaineesh1" },
      { src: img_mentors_101, alt: "Mentor Sessions & Reviews · jaineesh2" },
      { src: img_mentors_102, alt: "Mentor Sessions & Reviews · jaineesh3" },
      { src: img_mentors_103, alt: "Mentor Sessions & Reviews · jaineesh4" },
      { src: img_mentors_104, alt: "Mentor Sessions & Reviews · jaineesh5" },
      { src: img_mentors_105, alt: "Mentor Sessions & Reviews · longHairMen" },
      { src: img_mentors_106, alt: "Mentor Sessions & Reviews · longHairMen2" },
      { src: img_mentors_107, alt: "Mentor Sessions & Reviews · longHairMen3" },
      { src: img_mentors_108, alt: "Mentor Sessions & Reviews · longHairMen4" },
      { src: img_mentors_109, alt: "Mentor Sessions & Reviews · TallMen" },
      { src: img_mentors_110, alt: "Mentor Sessions & Reviews · TallMen2" },
      { src: img_mentors_111, alt: "Mentor Sessions & Reviews · TallMen3" },
      { src: img_mentors_112, alt: "Mentor Sessions & Reviews · TallMen4" },
      { src: img_mentors_113, alt: "Mentor Sessions & Reviews · TallMen5" },
      { src: img_mentors_114, alt: "Mentor Sessions & Reviews · TallMen8" },
      { src: img_mentors_115, alt: "Mentor Sessions & Reviews · viksha1" },
      { src: img_mentors_116, alt: "Mentor Sessions & Reviews · viksha2" },
      { src: img_mentors_117, alt: "Mentor Sessions & Reviews · viksha3" },
      { src: img_mentors_118, alt: "Mentor Sessions & Reviews · viksha4" },
      { src: img_mentors_119, alt: "Mentor Sessions & Reviews · viksha5" },
      { src: img_mentors_120, alt: "Mentor Sessions & Reviews · viksha6" },
      { src: img_mentors_121, alt: "Mentor Sessions & Reviews · viksha7" },
      { src: img_mentors_122, alt: "Mentor Sessions & Reviews · viksha8" },
      { src: img_mentors_123, alt: "Mentor Sessions & Reviews · viksha11" },
      { src: img_mentors_124, alt: "Mentor Sessions & Reviews · viksha12" },
      { src: img_mentors_125, alt: "Mentor Sessions & Reviews · viksha13" },
      { src: img_mentors_126, alt: "Mentor Sessions & Reviews · viksha14" },
      { src: img_mentors_127, alt: "Mentor Sessions & Reviews · viksha15" },
      { src: img_mentors_128, alt: "Mentor Sessions & Reviews · viksha16" },
      { src: img_mentors_129, alt: "Mentor Sessions & Reviews · viksha17" },
      { src: img_mentors_130, alt: "Mentor Sessions & Reviews · viksha18" }
    ],
  },
  {
    id: "night-coding",
    title: "Night Coding",
    eyebrow: "MIDNIGHT SPRINT · DAY 1",
    photos: [
      { src: img_night_coding_131, alt: "Night Coding · image copy 2" },
      { src: img_night_coding_132, alt: "Night Coding · image copy 3" },
      { src: img_night_coding_133, alt: "Night Coding · image copy 4" },
      { src: img_night_coding_134, alt: "Night Coding · image copy" },
      { src: img_night_coding_135, alt: "Night Coding · image" }
    ],
  },
  {
    id: "night-break",
    title: "Night Break",
    eyebrow: "RECHARGE · 3:00 AM",
    photos: [
      { src: img_night_break_136, alt: "Night Break · image copy 2" },
      { src: img_night_break_137, alt: "Night Break · image copy 3" },
      { src: img_night_break_138, alt: "Night Break · image copy 4" },
      { src: img_night_break_139, alt: "Night Break · image copy 5" },
      { src: img_night_break_140, alt: "Night Break · image copy 6" },
      { src: img_night_break_141, alt: "Night Break · image copy" },
      { src: img_night_break_142, alt: "Night Break · image" }
    ],
  },
  {
    id: "round2-walk",
    title: "Round 2 — Walkthrough & Demos",
    eyebrow: "DEMO WALK · DAY 2",
    photos: [
      { src: img_round2_walk_143, alt: "Round 2 — Walkthrough & Demos · goat1" },
      { src: img_round2_walk_144, alt: "Round 2 — Walkthrough & Demos · image copy 2" },
      { src: img_round2_walk_145, alt: "Round 2 — Walkthrough & Demos · image copy 3" },
      { src: img_round2_walk_146, alt: "Round 2 — Walkthrough & Demos · image copy 4" },
      { src: img_round2_walk_147, alt: "Round 2 — Walkthrough & Demos · image copy 5" },
      { src: img_round2_walk_148, alt: "Round 2 — Walkthrough & Demos · image copy 6" },
      { src: img_round2_walk_149, alt: "Round 2 — Walkthrough & Demos · image copy 7" },
      { src: img_round2_walk_150, alt: "Round 2 — Walkthrough & Demos · image copy 8" },
      { src: img_round2_walk_151, alt: "Round 2 — Walkthrough & Demos · image copy 9" },
      { src: img_round2_walk_152, alt: "Round 2 — Walkthrough & Demos · image copy 10" },
      { src: img_round2_walk_153, alt: "Round 2 — Walkthrough & Demos · image copy 11" },
      { src: img_round2_walk_154, alt: "Round 2 — Walkthrough & Demos · image copy" },
      { src: img_round2_walk_155, alt: "Round 2 — Walkthrough & Demos · image" }
    ],
  },
  {
    id: "round2",
    title: "Round 2 — Pitches",
    eyebrow: "DEMO DAY · DAY 2",
    photos: [
      { src: img_round2_156, alt: "Round 2 — Pitches · image copy 2" },
      { src: img_round2_157, alt: "Round 2 — Pitches · image copy 3" },
      { src: img_round2_158, alt: "Round 2 — Pitches · image copy 4" },
      { src: img_round2_159, alt: "Round 2 — Pitches · image copy" },
      { src: img_round2_160, alt: "Round 2 — Pitches · image" }
    ],
  },
  {
    id: "judges",
    title: "Judging Panel & Evaluations",
    eyebrow: "JURY ROUND · DAY 2",
    photos: [
      { src: img_judges_161, alt: "Judging Panel & Evaluations · image copy 2" },
      { src: img_judges_162, alt: "Judging Panel & Evaluations · image copy 5" },
      { src: img_judges_163, alt: "Judging Panel & Evaluations · image copy 6" },
      { src: img_judges_164, alt: "Judging Panel & Evaluations · image copy" },
      { src: img_judges_165, alt: "Judging Panel & Evaluations · image" }
    ],
  },
  {
    id: "final-pitch",
    title: "Final Presentations & Pitches",
    eyebrow: "SHOWTIME · DAY 2",
    photos: [
      { src: img_final_pitch_166, alt: "Final Presentations & Pitches · image copy 2" },
      { src: img_final_pitch_167, alt: "Final Presentations & Pitches · image copy 3" },
      { src: img_final_pitch_168, alt: "Final Presentations & Pitches · image copy 4" },
      { src: img_final_pitch_169, alt: "Final Presentations & Pitches · image copy 5" },
      { src: img_final_pitch_170, alt: "Final Presentations & Pitches · image copy 6" },
      { src: img_final_pitch_171, alt: "Final Presentations & Pitches · image copy 7" },
      { src: img_final_pitch_172, alt: "Final Presentations & Pitches · image copy 8" },
      { src: img_final_pitch_173, alt: "Final Presentations & Pitches · image copy 9" },
      { src: img_final_pitch_174, alt: "Final Presentations & Pitches · image copy 10" },
      { src: img_final_pitch_175, alt: "Final Presentations & Pitches · image copy 11" },
      { src: img_final_pitch_176, alt: "Final Presentations & Pitches · image copy 12" },
      { src: img_final_pitch_177, alt: "Final Presentations & Pitches · image copy 13" },
      { src: img_final_pitch_178, alt: "Final Presentations & Pitches · image copy 14" },
      { src: img_final_pitch_179, alt: "Final Presentations & Pitches · image copy 15" },
      { src: img_final_pitch_180, alt: "Final Presentations & Pitches · image copy 16" },
      { src: img_final_pitch_181, alt: "Final Presentations & Pitches · image copy 17" },
      { src: img_final_pitch_182, alt: "Final Presentations & Pitches · image copy 18" },
      { src: img_final_pitch_183, alt: "Final Presentations & Pitches · image copy 19" },
      { src: img_final_pitch_184, alt: "Final Presentations & Pitches · image copy 20" },
      { src: img_final_pitch_185, alt: "Final Presentations & Pitches · image copy 21" },
      { src: img_final_pitch_186, alt: "Final Presentations & Pitches · image copy 22" },
      { src: img_final_pitch_187, alt: "Final Presentations & Pitches · image copy 23" },
      { src: img_final_pitch_188, alt: "Final Presentations & Pitches · image copy 24" },
      { src: img_final_pitch_189, alt: "Final Presentations & Pitches · image copy 25" },
      { src: img_final_pitch_190, alt: "Final Presentations & Pitches · image copy 26" },
      { src: img_final_pitch_191, alt: "Final Presentations & Pitches · image copy 27" },
      { src: img_final_pitch_192, alt: "Final Presentations & Pitches · image copy 28" },
      { src: img_final_pitch_193, alt: "Final Presentations & Pitches · image copy 29" },
      { src: img_final_pitch_194, alt: "Final Presentations & Pitches · image copy 30" },
      { src: img_final_pitch_195, alt: "Final Presentations & Pitches · image copy 31" },
      { src: img_final_pitch_196, alt: "Final Presentations & Pitches · image copy 32" },
      { src: img_final_pitch_197, alt: "Final Presentations & Pitches · image copy 33" },
      { src: img_final_pitch_198, alt: "Final Presentations & Pitches · image copy 34" },
      { src: img_final_pitch_199, alt: "Final Presentations & Pitches · image copy 35" },
      { src: img_final_pitch_200, alt: "Final Presentations & Pitches · image copy 36" },
      { src: img_final_pitch_201, alt: "Final Presentations & Pitches · image copy 37" },
      { src: img_final_pitch_202, alt: "Final Presentations & Pitches · image copy 38" },
      { src: img_final_pitch_203, alt: "Final Presentations & Pitches · image copy 39" },
      { src: img_final_pitch_204, alt: "Final Presentations & Pitches · image copy 40" },
      { src: img_final_pitch_205, alt: "Final Presentations & Pitches · image copy 41" },
      { src: img_final_pitch_206, alt: "Final Presentations & Pitches · image copy 42" },
      { src: img_final_pitch_207, alt: "Final Presentations & Pitches · image copy 43" },
      { src: img_final_pitch_208, alt: "Final Presentations & Pitches · image copy 44" },
      { src: img_final_pitch_209, alt: "Final Presentations & Pitches · image copy 45" },
      { src: img_final_pitch_210, alt: "Final Presentations & Pitches · image copy 46" },
      { src: img_final_pitch_211, alt: "Final Presentations & Pitches · image copy 47" },
      { src: img_final_pitch_212, alt: "Final Presentations & Pitches · image copy 48" },
      { src: img_final_pitch_213, alt: "Final Presentations & Pitches · image copy 49" },
      { src: img_final_pitch_214, alt: "Final Presentations & Pitches · image copy 50" },
      { src: img_final_pitch_215, alt: "Final Presentations & Pitches · image copy 51" },
      { src: img_final_pitch_216, alt: "Final Presentations & Pitches · image copy 52" },
      { src: img_final_pitch_217, alt: "Final Presentations & Pitches · image copy 53" },
      { src: img_final_pitch_218, alt: "Final Presentations & Pitches · image copy 54" },
      { src: img_final_pitch_219, alt: "Final Presentations & Pitches · image copy 55" },
      { src: img_final_pitch_220, alt: "Final Presentations & Pitches · image copy 56" },
      { src: img_final_pitch_221, alt: "Final Presentations & Pitches · image copy 57" },
      { src: img_final_pitch_222, alt: "Final Presentations & Pitches · image copy 58" },
      { src: img_final_pitch_223, alt: "Final Presentations & Pitches · image copy 59" },
      { src: img_final_pitch_224, alt: "Final Presentations & Pitches · image copy 60" },
      { src: img_final_pitch_225, alt: "Final Presentations & Pitches · image copy 61" },
      { src: img_final_pitch_226, alt: "Final Presentations & Pitches · image copy 62" },
      { src: img_final_pitch_227, alt: "Final Presentations & Pitches · image copy 63" },
      { src: img_final_pitch_228, alt: "Final Presentations & Pitches · image copy 64" },
      { src: img_final_pitch_229, alt: "Final Presentations & Pitches · image copy 65" },
      { src: img_final_pitch_230, alt: "Final Presentations & Pitches · image copy 66" },
      { src: img_final_pitch_231, alt: "Final Presentations & Pitches · image copy 67" },
      { src: img_final_pitch_232, alt: "Final Presentations & Pitches · image copy 68" },
      { src: img_final_pitch_233, alt: "Final Presentations & Pitches · image copy 69" },
      { src: img_final_pitch_234, alt: "Final Presentations & Pitches · image copy 70" },
      { src: img_final_pitch_235, alt: "Final Presentations & Pitches · image copy 71" },
      { src: img_final_pitch_236, alt: "Final Presentations & Pitches · image copy 72" },
      { src: img_final_pitch_237, alt: "Final Presentations & Pitches · image copy 73" },
      { src: img_final_pitch_238, alt: "Final Presentations & Pitches · image copy 74" },
      { src: img_final_pitch_239, alt: "Final Presentations & Pitches · image copy 75" },
      { src: img_final_pitch_240, alt: "Final Presentations & Pitches · image copy 76" },
      { src: img_final_pitch_241, alt: "Final Presentations & Pitches · image copy 77" },
      { src: img_final_pitch_242, alt: "Final Presentations & Pitches · image copy 78" },
      { src: img_final_pitch_243, alt: "Final Presentations & Pitches · image copy 79" },
      { src: img_final_pitch_244, alt: "Final Presentations & Pitches · image copy 80" },
      { src: img_final_pitch_245, alt: "Final Presentations & Pitches · image copy 81" },
      { src: img_final_pitch_246, alt: "Final Presentations & Pitches · image copy 82" },
      { src: img_final_pitch_247, alt: "Final Presentations & Pitches · image copy 83" },
      { src: img_final_pitch_248, alt: "Final Presentations & Pitches · image copy 84" },
      { src: img_final_pitch_249, alt: "Final Presentations & Pitches · image copy 85" },
      { src: img_final_pitch_250, alt: "Final Presentations & Pitches · image copy 86" },
      { src: img_final_pitch_251, alt: "Final Presentations & Pitches · image copy 87" },
      { src: img_final_pitch_252, alt: "Final Presentations & Pitches · image copy 88" },
      { src: img_final_pitch_253, alt: "Final Presentations & Pitches · image copy 89" },
      { src: img_final_pitch_254, alt: "Final Presentations & Pitches · image copy 90" },
      { src: img_final_pitch_255, alt: "Final Presentations & Pitches · image copy 91" },
      { src: img_final_pitch_256, alt: "Final Presentations & Pitches · image copy 92" },
      { src: img_final_pitch_257, alt: "Final Presentations & Pitches · image copy 93" },
      { src: img_final_pitch_258, alt: "Final Presentations & Pitches · image copy 94" },
      { src: img_final_pitch_259, alt: "Final Presentations & Pitches · image copy 95" },
      { src: img_final_pitch_260, alt: "Final Presentations & Pitches · image copy" },
      { src: img_final_pitch_261, alt: "Final Presentations & Pitches · image" }
    ],
  },
  {
    id: "selecting-teams",
    title: "Selecting Teams & Deliberation",
    eyebrow: "DELIBERATION · DAY 2",
    photos: [
      { src: img_selecting_teams_262, alt: "Selecting Teams & Deliberation · image copy 2" },
      { src: img_selecting_teams_263, alt: "Selecting Teams & Deliberation · image copy 3" },
      { src: img_selecting_teams_264, alt: "Selecting Teams & Deliberation · image copy 4" },
      { src: img_selecting_teams_265, alt: "Selecting Teams & Deliberation · image copy 5" },
      { src: img_selecting_teams_266, alt: "Selecting Teams & Deliberation · image copy 6" },
      { src: img_selecting_teams_267, alt: "Selecting Teams & Deliberation · image copy 7" },
      { src: img_selecting_teams_268, alt: "Selecting Teams & Deliberation · image copy 8" },
      { src: img_selecting_teams_269, alt: "Selecting Teams & Deliberation · image copy 9" },
      { src: img_selecting_teams_270, alt: "Selecting Teams & Deliberation · image copy 10" },
      { src: img_selecting_teams_271, alt: "Selecting Teams & Deliberation · image copy 11" },
      { src: img_selecting_teams_272, alt: "Selecting Teams & Deliberation · image copy 12" },
      { src: img_selecting_teams_273, alt: "Selecting Teams & Deliberation · image copy 13" },
      { src: img_selecting_teams_274, alt: "Selecting Teams & Deliberation · image copy 14" },
      { src: img_selecting_teams_275, alt: "Selecting Teams & Deliberation · image copy 15" },
      { src: img_selecting_teams_276, alt: "Selecting Teams & Deliberation · image copy 16" },
      { src: img_selecting_teams_277, alt: "Selecting Teams & Deliberation · image copy 17" },
      { src: img_selecting_teams_278, alt: "Selecting Teams & Deliberation · image copy 18" },
      { src: img_selecting_teams_279, alt: "Selecting Teams & Deliberation · image copy 19" },
      { src: img_selecting_teams_280, alt: "Selecting Teams & Deliberation · image copy 20" },
      { src: img_selecting_teams_281, alt: "Selecting Teams & Deliberation · image copy" },
      { src: img_selecting_teams_282, alt: "Selecting Teams & Deliberation · image" }
    ],
  },
  {
    id: "valedictory",
    title: "Valedictory Ceremony",
    eyebrow: "CLOSING · GRAND FINALE",
    photos: [
      { src: img_valedictory_283, alt: "Valedictory Ceremony · image copy 2" },
      { src: img_valedictory_284, alt: "Valedictory Ceremony · image copy 3" },
      { src: img_valedictory_285, alt: "Valedictory Ceremony · image copy 4" },
      { src: img_valedictory_286, alt: "Valedictory Ceremony · image copy 5" },
      { src: img_valedictory_287, alt: "Valedictory Ceremony · image copy 6" },
      { src: img_valedictory_288, alt: "Valedictory Ceremony · image copy 7" },
      { src: img_valedictory_289, alt: "Valedictory Ceremony · image copy 8" },
      { src: img_valedictory_290, alt: "Valedictory Ceremony · image copy 9" },
      { src: img_valedictory_291, alt: "Valedictory Ceremony · image copy 10" },
      { src: img_valedictory_292, alt: "Valedictory Ceremony · image copy 11" },
      { src: img_valedictory_293, alt: "Valedictory Ceremony · image copy 12" },
      { src: img_valedictory_294, alt: "Valedictory Ceremony · image copy 13" },
      { src: img_valedictory_295, alt: "Valedictory Ceremony · image copy 14" },
      { src: img_valedictory_296, alt: "Valedictory Ceremony · image copy 15" },
      { src: img_valedictory_297, alt: "Valedictory Ceremony · image copy 16" },
      { src: img_valedictory_298, alt: "Valedictory Ceremony · image copy 17" },
      { src: img_valedictory_299, alt: "Valedictory Ceremony · image copy 18" },
      { src: img_valedictory_300, alt: "Valedictory Ceremony · image copy 19" },
      { src: img_valedictory_301, alt: "Valedictory Ceremony · image copy 20" },
      { src: img_valedictory_302, alt: "Valedictory Ceremony · image copy 21" },
      { src: img_valedictory_303, alt: "Valedictory Ceremony · image copy 22" },
      { src: img_valedictory_304, alt: "Valedictory Ceremony · image copy 23" },
      { src: img_valedictory_305, alt: "Valedictory Ceremony · image copy 24" },
      { src: img_valedictory_306, alt: "Valedictory Ceremony · image copy 25" },
      { src: img_valedictory_307, alt: "Valedictory Ceremony · image copy 26" },
      { src: img_valedictory_308, alt: "Valedictory Ceremony · image copy 27" },
      { src: img_valedictory_309, alt: "Valedictory Ceremony · image copy" },
      { src: img_valedictory_310, alt: "Valedictory Ceremony · image" }
    ],
  },
  {
    id: "winners",
    title: "Winners & Champions",
    eyebrow: "PODIUM · VICTORY",
    photos: [
      { src: img_winners_311, alt: "Winners & Champions · winner" },
      { src: img_winners_312, alt: "Winners & Champions · runnerups" },
      { src: img_winners_313, alt: "Winners & Champions · secondrunnerup" },
      { src: img_winners_314, alt: "Winners & Champions · secondRunnerUp" },
      { src: img_winners_315, alt: "Winners & Champions · image" },
      { src: img_winners_316, alt: "Winners & Champions · image copy" },
      { src: img_winners_317, alt: "Winners & Champions · image copy 2" },
      { src: img_winners_318, alt: "Winners & Champions · image copy 3" },
      { src: img_winners_319, alt: "Winners & Champions · image copy 4" }
    ],
  }
];

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
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  /* Keyboard + scroll lock */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      }
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

  /* Track browser fullscreen state */
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    document.addEventListener("webkitfullscreenchange", onFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", onFsChange);
      document.removeEventListener("webkitfullscreenchange", onFsChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const el = overlayRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      (el.requestFullscreen?.() ??
        /* Safari */ (el as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen?.())
        ?.catch(() => {});
    } else {
      (document.exitFullscreen?.() ??
        /* Safari */ (document as unknown as { webkitExitFullscreen: () => void }).webkitExitFullscreen?.());
    }
  };

  /* Click on black backdrop → close; click on image → toggle fullscreen */
  const handleOverlayClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest(".lightbox-bottom-bar")) return;
    if (target.tagName === "IMG") {
      toggleFullscreen();
      return;
    }
    onClose();
  };

  return (
    <div
      ref={overlayRef}
      className="lightbox-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Photo lightbox"
    >
      {/* ── Image fills entire overlay ── */}
      <div className="lightbox-image-wrap">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="100vw"
          style={{
            objectFit: "contain",
            cursor: isFullscreen ? "zoom-out" : "zoom-in",
          }}
          quality={95}
          priority
          onClick={toggleFullscreen}
        />
      </div>

      {/* ── Close ── */}
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close lightbox"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* ── Fullscreen toggle ── */}
      <button
        className="lightbox-fullscreen-btn"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
      >
        {isFullscreen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="8 3 3 3 3 8" /><line x1="3" y1="3" x2="10" y2="10" />
            <polyline points="16 3 21 3 21 8" /><line x1="21" y1="3" x2="14" y2="10" />
            <polyline points="8 21 3 21 3 16" /><line x1="3" y1="21" x2="10" y2="14" />
            <polyline points="16 21 21 21 21 16" /><line x1="21" y1="21" x2="14" y2="14" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 3 21 3 21 9" /><line x1="21" y1="3" x2="14" y2="10" />
            <polyline points="9 21 3 21 3 15" /><line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        )}
      </button>

      {/* ── Prev ── */}
      <button className="lightbox-nav lightbox-nav--prev" onClick={onPrev} aria-label="Previous photo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* ── Next ── */}
      <button className="lightbox-nav lightbox-nav--next" onClick={onNext} aria-label="Next photo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── Bottom bar ── */}
      <div className="lightbox-bottom-bar">
        <p className="lightbox-caption">{photo.alt}</p>
        <span className="lightbox-counter">
          {String(currentIndex + 1).padStart(2, "0")} / {String(totalCount).padStart(2, "0")}
        </span>
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
  const currentPhotos =
    lightboxSection === "team-photo"
      ? [
          {
            src: teamArgonyx,
            alt: "Team Argonyx '26 — Organised by ECell, IEEE and VIKSHA Coding Club · RV University",
          },
        ]
      : currentSection?.photos || [];

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
            <div
              className="gallery-showcase__card gallery-showcase__card--main"
              onClick={() => openLightbox("opening", 2)}
              role="button"
              tabIndex={0}
              style={{ cursor: "zoom-in" }}
              aria-label="View photo full screen"
            >
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
              <div
                className="gallery-showcase__card gallery-showcase__card--left"
                onClick={() => openLightbox("opening", 3)}
                role="button"
                tabIndex={0}
                style={{ cursor: "zoom-in" }}
                aria-label="View photo full screen"
              >
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
            <div
              className="gallery-showcase__card gallery-showcase__card--top-right"
              onClick={() => openLightbox("coding-sessions", 0)}
              role="button"
              tabIndex={0}
              style={{ cursor: "zoom-in" }}
              aria-label="View photo full screen"
            >
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
              <div
                className="gallery-showcase__card gallery-showcase__card--bottom-right"
                onClick={() => openLightbox("round2-walk", 1)}
                role="button"
                tabIndex={0}
                style={{ cursor: "zoom-in" }}
                aria-label="View photo full screen"
              >
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
                  <span className="gallery-section__index">
                    {String(sIdx + 1).padStart(2, "0")}.
                  </span>{" "}
                  {section.title}
                </h2>
              </div>
            </div>

            <DepthCarousel
              key={section.id}
              items={section.photos.map(
                (p): DepthCarouselItem => ({ image: p.src, alt: p.alt })
              )}
              depth={220}
              spread={90}
              tilt={22}
              tiltDirection="right"
              perspective={1400}
              visibleCards={4}
              falloff={0.2}
              blur={6}
              autoplay={false}
              loop
              onCardClick={(idx) => openLightbox(section.id, idx)}
            />
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
            <div
              className="gallery-team-photo__img-wrap"
              ref={teamImgWrapRef}
              onClick={() => openLightbox("team-photo", 0)}
              role="button"
              tabIndex={0}
              style={{ cursor: "zoom-in" }}
              aria-label="View Team Argonyx photo full screen"
            >
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
