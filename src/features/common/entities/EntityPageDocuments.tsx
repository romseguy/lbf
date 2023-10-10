import {
  AddIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Icon
} from "@chakra-ui/icons";
import {
  Badge,
  BadgeProps,
  Box,
  Button,
  Flex,
  Heading,
  Progress,
  Text,
  useColorMode
} from "@chakra-ui/react";
import router from "next/router";
import { useState } from "react";
import { FaImages } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useGetDocumentsQuery } from "features/api/documentsApi";
import {
  AppHeading,
  Column,
  HostTag,
  TabContainer,
  TabContainerContent,
  TabContainerHeader
} from "features/common";
import { DocumentsList } from "features/documents/DocumentsList";
import { DocumentsListMasonry } from "features/documents/DocumentsListMasonry";
import { DocumentForm } from "features/forms/DocumentForm";
import { useDiskUsage } from "hooks/useDiskUsage";
import { useSession } from "hooks/useSession";
import { isOrg } from "models/Entity";
import { IOrg } from "models/Org";
import { IUser } from "models/User";
import { selectIsMobile } from "store/uiSlice";
import * as stringUtils from "utils/string";
import { AppQueryWithData } from "utils/types";

export const EntityPageDocuments = ({
  isCreator,
  query
}: {
  isCreator?: boolean;
  query: AppQueryWithData<IOrg | IUser>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const { data: session } = useSession();

  const badgeProps: BadgeProps = {
    colorScheme: "teal",
    variant: "solid",
    mr: 2
  };
  // const columnProps: ColumnProps = {
  //   bg: isDark ? "gray.700" : "lightblue"
  // };
  const entity = query.data;
  const isO = isOrg(entity);

  const [diskUsage, refreshDiskUsage] = useDiskUsage();
  const [isAdd, setIsAdd] = useState(false);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const documentsQuery = useGetDocumentsQuery({
    orgId: entity._id,
    userId: entity._id
  });

  return (
    <>
      <Flex alignItems="center" mb={3}>
        <Icon as={FaImages} boxSize={6} mr={3} />
        <AppHeading>Galerie</AppHeading>
      </Flex>

      <TabContainer borderBottomRadius="lg">
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

          <Badge {...badgeProps}>{documentsQuery.data?.length || ""}</Badge>

          <Heading size="sm">Liste des fichiers</Heading>
        </TabContainerHeader>
        {isFilesOpen && (
          <TabContainerContent
            pb={0}
            {...(isMobile
              ? { bgColor: "transparent" }
              : { borderBottomRadius: "lg", p: 3 })}
          >
            <Flex
              flexWrap="wrap"
              mb={3}
              {...(isMobile ? { mx: 3 } : { mt: -3 })}
            >
              <Box flexGrow={1} mt={3}>
                <Button
                  colorScheme="teal"
                  leftIcon={<AddIcon />}
                  rightIcon={isAdd ? <ChevronUpIcon /> : <ChevronRightIcon />}
                  onClick={() => {
                    if (!session) {
                      router.push("/login", "/login", { shallow: true });
                      return;
                    }

                    // if (org && !props.isCreator) {
                    //   toast({
                    //     status: "error",
                    //     title: `Vous n'avez pas la permission ${orgTypeFull(
                    //       org.orgType
                    //     )} pour ajouter un fichier`
                    //   });
                    //   return;
                    // }

                    setIsAdd(!isAdd);
                  }}
                >
                  Ajouter un fichier
                </Button>
              </Box>

              <Flex flexDir="column" mt={3}>
                <HostTag mb={1} />
                <Progress hasStripe value={diskUsage.pct} />
                {typeof diskUsage.current !== "undefined" &&
                  typeof diskUsage.max !== "undefined" && (
                    <Flex alignItems="center" fontSize="smaller" mt={1}>
                      <Text>
                        {stringUtils.bytesForHuman(diskUsage.current)} sur{" "}
                        {stringUtils.bytesForHuman(diskUsage.max)}
                      </Text>
                    </Flex>
                  )}
              </Flex>
            </Flex>

            {isAdd && (
              <Column>
                <DocumentForm
                  entity={entity}
                  onSubmit={() => {
                    refreshDiskUsage();
                    query.refetch();
                    setIsAdd(false);
                  }}
                />
              </Column>
            )}

            {!isAdd && (
              <DocumentsList
                entity={entity}
                isCreator={isCreator}
                onDelete={refreshDiskUsage}
              />
            )}
          </TabContainerContent>
        )}
      </TabContainer>

      {/* <Column {...columnProps}> */}
      <DocumentsListMasonry isCreator={isCreator} entity={entity} />
      {/* </Column> */}
    </>
  );
};
