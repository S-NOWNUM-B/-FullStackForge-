import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as DiIcons from "react-icons/di";
import * as BiIcons from "react-icons/bi";
import * as MdIcons from "react-icons/md";
import * as Io5Icons from "react-icons/io5";
import * as RiIcons from "react-icons/ri";
import * as TbIcons from "react-icons/tb";
import { IconType } from "react-icons";

const iconLibraries: Record<string, unknown> = {
  ...SiIcons,
  ...FaIcons,
  ...DiIcons,
  ...BiIcons,
  ...MdIcons,
  ...Io5Icons,
  ...RiIcons,
  ...TbIcons,
};

/**
 * Возвращает компонент иконки по её строковому названию.
 * Поддерживает библиотеки: si, fa, di, bi, md, io5, ri, tb.
 * Пример: "SiReact", "FaNodeJs", "DiPython", "BiGitBranch"
 */
export const getIconByName = (iconName: string): IconType => {
  if (iconName && iconName in iconLibraries) {
    return iconLibraries[iconName] as IconType;
  }

  // Если иконка не найдена — выводим подсказку в консоли
  if (iconName) {
    console.warn(
      `[getIconByName] Icon "${iconName}" not found. Using default.`,
    );
  }

  return FaIcons.FaCode;
};
