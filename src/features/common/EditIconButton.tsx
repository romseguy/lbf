import { EditIcon } from "@chakra-ui/icons";
import {
  IconButton,
  IconButtonProps,
  Tooltip,
  TooltipProps
} from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

export const EditIconButton = ({
  label = "Modifier",
  placement = "bottom",
  ...props
}: Omit<IconButtonProps, "ref" | "aria-label"> &
  Omit<TooltipProps, "children">) => {
  const isMobile = useSelector(selectIsMobile);
  const [ibProps, setIbProps] = useState({
    colorScheme: "white",
    variant: "outline"
  });

  return (
    <Tooltip {...props}>
      <IconButton
        aria-label={label as string}
        icon={<EditIcon />}
        onMouseEnter={() =>
          setIbProps({ ...ibProps, colorScheme: "teal", variant: "solid" })
        }
        onMouseLeave={() =>
          setIbProps({ ...ibProps, colorScheme: "white", variant: "outline" })
        }
        {...ibProps}
        {...props}
      />
    </Tooltip>
  );
};

{
  /*
        //isMobile ?
        ...{
          colorScheme: "white",
          variant
        }
        // : {
        //     bgColor: "transparent",
        //     height: "auto",
        //     minWidth: 0,
        //     _hover: { color: "yellow" }
        //   }
      */
}
