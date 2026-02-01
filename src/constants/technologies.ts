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
    SiDart,
    SiFlutter,
    SiNestjs,
    SiTypescript,
    SiNextdotjs,
    SiJavascript,
    SiPostgresql,
    SiFirebase,
    SiRedis,
    SiRabbitmq,
    SiAdobephotoshop,
    SiPostman,
    SiKotlin,
    SiSwift,
    SiReact,
    SiSpringboot,
    SiTailwindcss,
    SiAdobeillustrator
} from "react-icons/si";


export const TECHNOLOGIES = [
    // Языки программирования - Ряд 1 (от простых к системным)
    { name: "JAVASCRIPT", color: "bg-[#F7DF1E] hover:bg-[#F7DF1E]/90", icon: SiJavascript },
    { name: "TYPESCRIPT", color: "bg-[#3178C6] hover:bg-[#3178C6]/90", icon: SiTypescript },
    { name: "DART", color: "bg-[#0175C2] hover:bg-[#0175C2]/90", icon: SiDart },
    { name: "KOTLIN", color: "bg-[#7F52FF] hover:bg-[#7F52FF]/90", icon: SiKotlin },
    { name: "SWIFT", color: "bg-[#F05138] hover:bg-[#F05138]/90", icon: SiSwift },
    { name: "JAVA", color: "bg-[#ED8B00] hover:bg-[#ED8B00]/90", icon: FaJava },
    
    // Frontend & Mobile - Ряд 2 (от разметки к тяжелым фреймворкам)
    { name: "HTML", color: "bg-[#E34F26] hover:bg-[#E34F26]/90", icon: FaHtml5 },
    { name: "CSS", color: "bg-[#1572B6] hover:bg-[#1572B6]/90", icon: FaCss3Alt },
    { name: "TAILWIND", color: "bg-[#06B6D4] hover:bg-[#06B6D4]/90", icon: SiTailwindcss },
    { name: "REACT", color: "bg-[#61DAFB] hover:bg-[#61DAFB]/90", icon: SiReact },
    { name: "NEXT.JS", color: "bg-[#000000] hover:bg-[#000000]/90", icon: SiNextdotjs },
    { name: "FLUTTER", color: "bg-[#02569B] hover:bg-[#02569B]/90", icon: SiFlutter },
    
    // Backend - Ряд 3 (от легковесных к энтерпрайз решениям)
    { name: "NODE.JS", color: "bg-[#339933] hover:bg-[#339933]/90", icon: FaNodeJs },
    { name: "NESTJS", color: "bg-[#E0234E] hover:bg-[#E0234E]/90", icon: SiNestjs },
    { name: "SPRING BOOT", color: "bg-[#6DB33F] hover:bg-[#6DB33F]/90", icon: SiSpringboot },
    
    // Databases & Queues - Ряд 4
    { name: "POSTGRESQL", color: "bg-[#316192] hover:bg-[#316192]/90", icon: SiPostgresql },
    { name: "FIREBASE", color: "bg-[#FFCA28] hover:bg-[#FFCA28]/90", icon: SiFirebase },
    { name: "REDIS", color: "bg-[#DC382D] hover:bg-[#DC382D]/90", icon: SiRedis },
    { name: "RABBITMQ", color: "bg-[#FF6600] hover:bg-[#FF6600]/90", icon: SiRabbitmq },
    
    // Infrastructure & Tools - Ряд 5
    { name: "GIT", color: "bg-[#F05032] hover:bg-[#F05032]/90", icon: FaGitAlt },
    { name: "POSTMAN", color: "bg-[#FF6C37] hover:bg-[#FF6C37]/90", icon: SiPostman },
    { name: "DOCKER", color: "bg-[#2496ED] hover:bg-[#2496ED]/90", icon: FaDocker },
    
    // Design - Ряд 6
    { name: "FIGMA", color: "bg-[#F24E1E] hover:bg-[#F24E1E]/90", icon: FaFigma },
    { name: "PHOTOSHOP", color: "bg-[#31A8FF] hover:bg-[#31A8FF]/90", icon: SiAdobephotoshop },
    { name: "ILLUSTRATOR", color: "bg-[#FF9A00] hover:bg-[#FF9A00]/90", icon: SiAdobeillustrator },
] as const;

export const TECHNOLOGY_NAMES = TECHNOLOGIES.map(t => t.name);

export const getTechData = (name: string) => {
  return TECHNOLOGIES.find(t => t.name.toLowerCase() === name.toLowerCase());
};