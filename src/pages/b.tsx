import { Button, FormControl, FormLabel, Input } from "@chakra-ui/react";
import { Column } from "features/common";
import { useToast } from "hooks/useToast";
import { useState } from "react";

const BPage = () => {
  const toast = useToast();
  const [href, setHref] = useState("");
  const [title, setTitle] = useState("");
  return (
    <Column maxW="50%" m="12px auto">
      <FormControl mb={3}>
        <FormLabel>URL</FormLabel>
        <Input
          onChange={(e) => {
            setHref(e.target.value);
          }}
        />
      </FormControl>
      <FormControl mb={3}>
        <FormLabel>Title</FormLabel>
        <Input
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
      </FormControl>
      <FormControl>
        <Button
          colorScheme="green"
          onClick={() => {
            if (!href) {
              toast({ title: "no URL", status: "error" });
            }
            if (!title) {
              toast({ title: "no title", status: "error" });
            }
            window.open(
              `https://webtag.io/bookmark?url=${encodeURIComponent(
                href
              )}&title=${encodeURIComponent(title)}`
            );
          }}
        >
          Ajouter
        </Button>
      </FormControl>
    </Column>
  );
};
export default BPage;
