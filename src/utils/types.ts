import { IconProps } from "@chakra-ui/icons";
import { ComponentWithAs } from "@chakra-ui/system";
import { IconType } from "react-icons";

export type AppIcon = ComponentWithAs<"svg", IconProps> | IconType;
