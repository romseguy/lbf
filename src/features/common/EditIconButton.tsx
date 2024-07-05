import { EditIcon } from "@chakra-ui/icons";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

export const EditIconButton = ({ ...props }: Omit<IconButtonProps, "ref">) => {
  const isMobile = useSelector(selectIsMobile);
  const [ibProps, setIbProps] = useState({
    colorScheme: "white",
    variant: "outline"
  });

  return (
    <IconButton
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
