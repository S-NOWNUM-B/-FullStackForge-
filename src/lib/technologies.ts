// Полный список доступных технологий с иконками и цветами
import {
    FaPython,
    FaNodeJs,
    FaHtml5,
    FaCss3Alt,
    FaDocker,
    FaGitAlt,
    FaAws,
    FaFigma,
    FaJava
} from "react-icons/fa";

import {
    SiFastapi,
    SiDart,
    SiFlutter,
    SiNestjs,
    SiTypescript,
    SiNextdotjs,
    SiJavascript,
    SiPostgresql,
    SiMysql,
    SiMongodb,
    SiRedis,
    SiRabbitmq,
    SiApachekafka,
    SiAdobephotoshop,
    SiPostman,
    SiKotlin,
    SiSwift,
    SiVuedotjs,      // исправлено: VueDotJs -> Vuedotjs
    SiAngular,       // это корректно
    SiFastify,       // это корректно
    SiDjango 
} from "react-icons/si";


export const TECHNOLOGIES = [
    // Языки программирования - Ряд 1
    { name: "PYTHON", color: "bg-[#3776AB] hover:bg-[#3776AB]/90", icon: FaPython },
    { name: "JAVASCRIPT", color: "bg-[#F7DF1E] hover:bg-[#F7DF1E]/90", icon: SiJavascript },
    { name: "TYPESCRIPT", color: "bg-[#3178C6] hover:bg-[#3178C6]/90", icon: SiTypescript },
    { name: "DART", color: "bg-[#0175C2] hover:bg-[#0175C2]/90", icon: SiDart },
    { name: "JAVA", color: "bg-[#ED8B00] hover:bg-[#ED8B00]/90", icon: FaJava },
    { name: "KOTLIN", color: "bg-[#7F52FF] hover:bg-[#7F52FF]/90", icon: SiKotlin },
    { name: "SWIFT",    color: "bg-[#F05138] hover:bg-[#F05138]/90", icon: SiSwift },
    
    // Frontend & Mobile - Ряд 2
    { name: "HTML", color: "bg-[#E34F26] hover:bg-[#E34F26]/90", icon: FaHtml5 },
    { name: "CSS", color: "bg-[#1572B6] hover:bg-[#1572B6]/90", icon: FaCss3Alt },
    { name: "FLUTTER", color: "bg-[#02569B] hover:bg-[#02569B]/90", icon: SiFlutter },
    { name: "VUE", color: "bg-[#41B883] hover:bg-[#41B883]/90", icon: SiVuedotjs },
    { name: "NEXT.JS", color: "bg-[#000000] hover:bg-[#000000]/90", icon: SiNextdotjs },
    { name: "ANGULAR", color: "bg-[#B52E31] hover:bg-[#B52E31]/90", icon: SiAngular },
    
    // Backend - Ряд 3
    { name: "NODE.JS", color: "bg-[#339933] hover:bg-[#339933]/90", icon: FaNodeJs },
    { name: "FASTAPI", color: "bg-[#009688] hover:bg-[#009688]/90", icon: SiFastapi },
    { name: "FASTIFY", color: "bg-[#1C1E21] hover:bg-[#1C1E21]/90", icon: SiFastify },
    { name: "NESTJS", color: "bg-[#E0234E] hover:bg-[#E0234E]/90", icon: SiNestjs },
    { name: "DJANGO", color: "bg-[#092E20] hover:bg-[#092E20]/90", icon: SiDjango },
    
    // Databases & Queues - Ряд 4
    { name: "MYSQL", color: "bg-[#4479A1] hover:bg-[#4479A1]/90", icon: SiMysql },
    { name: "POSTGRESQL", color: "bg-[#316192] hover:bg-[#316192]/90", icon: SiPostgresql },
    { name: "MONGODB", color: "bg-[#47A248] hover:bg-[#47A248]/90", icon: SiMongodb },
    { name: "REDIS", color: "bg-[#DC382D] hover:bg-[#DC382D]/90", icon: SiRedis },
    { name: "RABBITMQ", color: "bg-[#FF6600] hover:bg-[#FF6600]/90", icon: SiRabbitmq },
    { name: "APACHE KAFKA", color: "bg-[#231F20] hover:bg-[#231F20]/90", icon: SiApachekafka },
    
    // Infrastructure & Tools - Ряд 5
    { name: "GIT", color: "bg-[#F05032] hover:bg-[#F05032]/90", icon: FaGitAlt },
    { name: "POSTMAN", color: "bg-[#FF6C37] hover:bg-[#FF6C37]/90", icon: SiPostman },
    { name: "DOCKER", color: "bg-[#2496ED] hover:bg-[#2496ED]/90", icon: FaDocker },
    { name: "AWS", color: "bg-[#232F3E] hover:bg-[#232F3E]/90", icon: FaAws },
    
    // Design - Ряд 6
    { name: "FIGMA", color: "bg-[#F24E1E] hover:bg-[#F24E1E]/90", icon: FaFigma },
    { name: "PHOTOSHOP", color: "bg-[#31A8FF] hover:bg-[#31A8FF]/90", icon: SiAdobephotoshop },
] as const;

// Экспорт только названий для использования в фильтрах и формах
export const TECHNOLOGY_NAMES = TECHNOLOGIES.map(t => t.name);

// Функция для получения данных технологии по имени
export const getTechData = (name: string) => {
  return TECHNOLOGIES.find(t => t.name.toLowerCase() === name.toLowerCase());
};
