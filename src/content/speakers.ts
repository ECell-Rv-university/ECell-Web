import type { CircularTestimonial } from "@/src/components/CircularTestimonials/CircularTestimonials";
import abrarPhoto from "@/src/assets/speakers/abrar.webp";
import adarshPhoto from "@/src/assets/speakers/adarsh.webp";
import adityaPhoto from "@/src/assets/speakers/aditya.webp";
import akhilaPhoto from "@/src/assets/speakers/akhila.webp";
import ambikaPhoto from "@/src/assets/speakers/ambika.webp";
import arshdeepPhoto from "@/src/assets/speakers/arshdeep.webp";
import bharathPhoto from "@/src/assets/speakers/bharath.webp";
import guhaPhoto from "@/src/assets/speakers/guha.webp";
import harpreetPhoto from "@/src/assets/speakers/harpreet.webp";
import himanshuPhoto from "@/src/assets/speakers/himanshu.webp";
import maheshPhoto from "@/src/assets/speakers/mahesh.webp";
import neelamPhoto from "@/src/assets/speakers/neelam1.webp";
import ravinPhoto from "@/src/assets/speakers/ravin.webp";
import shariffPhoto from "@/src/assets/speakers/shariff.webp";
import sunilPhoto from "@/src/assets/speakers/sunil.webp";
import swaroopPhoto from "@/src/assets/speakers/swaroop-ghosh.webp";

export type Speaker = Omit<CircularTestimonial, "quote"> & { quote?: string };

export const PREVIOUS_SPEAKERS: Speaker[] = [
  { name: "Aditya Goyal", designation: "SDE", src: adityaPhoto },
  { name: "Akhila Nandakumar", designation: "Vice President", src: akhilaPhoto },
  { name: "Himangshu Shekhar Jha", designation: "Director (SWE-3)", src: himanshuPhoto },
  { name: "Major Ravin Rajan (Retd)", designation: "Assistant Vice President", src: ravinPhoto },
  { name: "Sai Sunil", designation: "Manager, Engineering Applications", src: sunilPhoto },
  { name: "Adarsh U", designation: "SDE", src: adarshPhoto },
  { name: "Dr. Karthik Mahesh", designation: "Manager Deeptech", src: maheshPhoto },
  { name: "Abrar Ahmed", designation: "Cybersecurity & Tech Controls | AI ML Product Security", src: abrarPhoto },
  { name: "Neelam Godihal", designation: "Sr. Software Engineer", src: neelamPhoto, imagePosition: "center 32%" },
  {
    name: "Swaroop Ghosh",
    designation: "COO, R&D Critical Information Protection Leader, Nokia",
    src: swaroopPhoto,
  },
  {
    name: "Arshdeep Singh",
    designation: "Founder & CEO",
    src: arshdeepPhoto,
    imagePosition: "center center",
  },
  {
    name: "Harpreet Sohan",
    designation: "Creative Designer",
    src: harpreetPhoto,
    imagePosition: "100% 28%",
  },
  {
    name: "Mustafa Shariff",
    designation: "Founder",
    src: shariffPhoto,
    imagePosition: "40% 20%",
  },
  {
    name: "Ambika J",
    designation: "Director of Artificial Intelligence & IEEE Senior Member",
    src: ambikaPhoto,
    imagePosition: "50% 30%",
  },
  {
    name: "Biplab Guha",
    designation: "Venture Architect & Entrepreneur",
    src: guhaPhoto,
    imagePosition: "56% 24%",
  },
   { name: "Bharath KH",
     designation: "Staff Software engineer", 
     src: bharathPhoto },
];
