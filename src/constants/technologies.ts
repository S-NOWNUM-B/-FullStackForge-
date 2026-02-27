// Полный список доступных технологий с иконками и цветами
import {
    FaNodeJs,
    FaHtml5,
    FaCss3Alt,
    FaDocker,
    FaGitAlt,
    FaFigma,
    FaJava
} from "react-icons/fa";

import {
    SiFlutter,
    SiNestjs,
    SiTypescript,
    SiNextdotjs,
    SiPostgresql,
    SiFirebase,
    SiPostman,
    SiReact,
    SiSpringboot,
    SiTailwindcss,
} from "react-icons/si";


export const TECHNOLOGIES = [
    // Языки программирования
    { name: "TYPESCRIPT", color: "bg-[#3178C6] hover:bg-[#3178C6]/90", icon: SiTypescript },
    { name: "JAVA", color: "bg-[#ED8B00] hover:bg-[#ED8B00]/90", icon: FaJava },
    
    // Frontend & Mobile
    { name: "HTML", color: "bg-[#e34f26] hover:bg-[#e34f26]/90", icon: FaHtml5 },
    { name: "CSS", color: "bg-[#38bdf8] hover:bg-[#38bdf8]/90", icon: FaCss3Alt },
    { name: "TAILWIND", color: "bg-[#1572B6] hover:bg-[#1572B6]/90", icon: SiTailwindcss },
    { name: "REACT", color: "bg-[#61dafb] hover:bg-[#61dafb]/90 text-black", icon: SiReact },
    { name: "NEXT.JS", color: "bg-[#000000] hover:bg-[#000000]/80 border border-white/10", icon: SiNextdotjs },
    { name: "FLUTTER", color: "bg-[#0276d3] hover:bg-[#0276d3]/90", icon: SiFlutter },
    
    // Backend
    { name: "NODE.JS", color: "bg-[#339933] hover:bg-[#339933]/90", icon: FaNodeJs },
    { name: "NESTJS", color: "bg-[#e0234e] hover:bg-[#e0234e]/90", icon: SiNestjs },
    { name: "SPRING BOOT", color: "bg-[#6db33f] hover:bg-[#6db33f]/90", icon: SiSpringboot },
    
    // Databases & Queues
    { name: "POSTGRESQL", color: "bg-[#336791] hover:bg-[#336791]/90", icon: SiPostgresql },
    { name: "FIREBASE", color: "bg-[#ffca28] hover:bg-[#ffca28]/90", icon: SiFirebase },
    
    // Infrastructure & Tools
    { name: "GIT", color: "bg-[#F05032] hover:bg-[#F05032]/90", icon: FaGitAlt },
    { name: "POSTMAN", color: "bg-[#FF6C37] hover:bg-[#FF6C37]/90", icon: SiPostman },
    { name: "DOCKER", color: "bg-[#2496ED] hover:bg-[#2496ED]/90", icon: FaDocker },
    
    // Design
    { name: "FIGMA", color: "bg-[#A259FF] hover:bg-[#A259FF]/90", icon: FaFigma },
] as const;

export const TECHNOLOGY_NAMES = TECHNOLOGIES.map(t => t.name);

export const getTechData = (name: string) => {
  return TECHNOLOGIES.find(t => t.name.toLowerCase() === name.toLowerCase());
};