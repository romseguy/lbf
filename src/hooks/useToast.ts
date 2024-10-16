import { useToast as useChakraToast, UseToastOptions } from "@chakra-ui/toast";
//import { IToastProps, Toast } from "./Toast";

export function useToast(options?: UseToastOptions) {
  return useChakraToast({
    duration: options?.duration || 6000,
    isClosable: true,
    position: "top-right",
    ...options
    // render: ({ onClose }) => (
    //   <Toast
    //     message={message}
    //     onClose={onClose}
    //     variant={variant}
    //   />
    // )
  });
}
