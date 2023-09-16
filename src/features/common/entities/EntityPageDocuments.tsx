import { ChevronRightIcon, ChevronUpIcon, Icon } from "@chakra-ui/icons";
import {
  Badge,
  BadgeProps,
  Flex,
  Heading,
  useColorMode
} from "@chakra-ui/react";
import { useState } from "react";
import { FaImages } from "react-icons/fa";
import { useGetDocumentsQuery } from "features/api/documentsApi";
import {
  AppHeading,
  Column,
  ColumnProps,
  TabContainer,
  TabContainerContent,
  TabContainerHeader
} from "features/common";
import {
  DocumentsList,
  DocumentsListMasonry
} from "features/documents/DocumentsList";
import { IOrg } from "models/Org";
import { AppQueryWithData } from "utils/types";

export const EntityPageDocuments = ({
  isCreator,
  orgQuery
}: {
  isCreator: boolean;
  orgQuery: AppQueryWithData<IOrg>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const badgeProps: BadgeProps = {
    colorScheme: "teal",
    variant: "solid",
    mr: 2
  };
  const columnProps: ColumnProps = {
    bg: isDark ? "gray.700" : "lightblue"
  };
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const org = orgQuery.data;
  const query = useGetDocumentsQuery({ orgId: org._id });

  return (
    <>
      <Flex>
        <Icon as={FaImages} boxSize={6} mr={3} mt={3} />
        <AppHeading noContainer mb={3}>
          Galerie
        </AppHeading>
      </Flex>

      <TabContainer borderBottomRadius={isFilesOpen ? undefined : "lg"}>
        <TabContainerHeader
          alignItems="center"
          borderBottomRadius={isFilesOpen ? undefined : "lg"}
          cursor="pointer"
          py={3}
          _hover={{ backgroundColor: isDark ? "gray.500" : "cyan.100" }}
          onClick={() => setIsFilesOpen(!isFilesOpen)}
        >
          <Icon
            as={isFilesOpen ? ChevronUpIcon : ChevronRightIcon}
            boxSize={6}
            ml={3}
            mr={1}
          />

          <Badge {...badgeProps}>{query.data?.length || ""}</Badge>

          <Heading size="sm">Liste des fichiers</Heading>
        </TabContainerHeader>
        {isFilesOpen && (
          <TabContainerContent p={3} pb={0}>
            <DocumentsList org={org} isCreator={isCreator} />
          </TabContainerContent>
        )}
      </TabContainer>

      {/* <Column {...columnProps}> */}
      <DocumentsListMasonry isCreator={isCreator} org={org} />
      {/* </Column> */}
    </>
  );
};
