import { AddIcon, AtSignIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  IconButton,
  Input,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
  HStack,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React, { useState } from "react";
import { useGetSettingsQuery } from "features/api/settingsApi";
import { useGetUsersQuery } from "features/api/usersApi";
import {
  ColorPicker,
  TabContainer,
  TabContainerContent,
  TabContainerHeader
} from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "main";

import { css } from "twin.macro";
import { scrollbarCss } from "features/layout/theme";
import { selectIsMobile } from "store/uiSlice";
import { useSelector } from "react-redux";
import { UserFormModal } from "features/modals/UserFormModal";
import { AdminSettingsForm } from "features/forms/AdminSettingsForm";
import { wrapper } from "store";
import { selectUserEmail } from "store/userSlice";

const AdminPage = ({ ...props }: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const toast = useToast({ position: "top" });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const settingsQuery = useGetSettingsQuery();
  const usersQuery = useGetUsersQuery({ select: "email" });

  const [color, setColor] = useState("#ffffff");

  return (
    <Layout {...props} pageTitle="Administration">
      <Tabs
        background={isDark ? "black" : "lightcyan"}
        borderWidth={1}
        lazyBehavior="keepMounted"
      >
        <TabList>
          <Tab>Général</Tab>
          <Tab>Utilisateurs</Tab>
          <Tab>Thème</Tab>
          <Tab>Autres</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <TabContainer>
              <TabContainerHeader heading="Configuration"></TabContainerHeader>
              <TabContainerContent p={3}>
                {isLoading ||
                settingsQuery.isLoading ||
                settingsQuery.isFetching ? (
                  <Spinner />
                ) : Array.isArray(settingsQuery.data) &&
                  settingsQuery.data.length > 0 ? (
                  <AdminSettingsForm setIsLoading={setIsLoading} />
                ) : (
                  <Text fontStyle="italic">Aucun paramètres.</Text>
                )}
              </TabContainerContent>
            </TabContainer>
          </TabPanel>

          <TabPanel>
            <Box>
              <Button
                colorScheme="teal"
                leftIcon={<AddIcon />}
                mb={3}
                onClick={() => {
                  onOpen();
                }}
              >
                Ajouter un utilisateur
              </Button>
              {isOpen && (
                <UserFormModal
                  isOpen
                  onCancel={onClose}
                  onClose={onClose}
                  onSubmit={async (user) => {
                    console.log(
                      "🚀 ~ file: admin.tsx:96 ~ onSubmit={ ~ user:",
                      user
                    );
                    onClose();
                  }}
                />
              )}
            </Box>

            <TabContainer>
              <TabContainerHeader heading="Liste des utilisateurs"></TabContainerHeader>
              <TabContainerContent p={3}>
                {isLoading ||
                settingsQuery.isLoading ||
                settingsQuery.isFetching ? (
                  <Spinner />
                ) : Array.isArray(settingsQuery.data) &&
                  settingsQuery.data.length > 0 ? (
                  <>
                    <Box
                      overflowX="auto"
                      css={css`
                        ${scrollbarCss}
                      `}
                    >
                      <Table
                        colorScheme="white"
                        css={css`
                          th {
                            font-size: ${isMobile ? "11px" : "inherit"};
                            padding: ${isMobile ? 0 : "4px"};
                          }
                          td {
                            padding: ${isMobile ? "8px 0" : "8px"};
                            padding-right: ${isMobile ? "4px" : "8px"};
                            button {
                              font-size: ${isMobile ? "13px" : "inherit"};
                            }
                          }
                        `}
                      >
                        <Thead>
                          <Tr>
                            <Th
                              color={isDark ? "white" : "black"}
                              cursor="pointer"
                              //onClick={() => setSelectedOrder(key)}
                            >
                              E-mail
                            </Th>
                            <Th></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {usersQuery.data?.map((user) => {
                            return (
                              <Tr key={user._id}>
                                <Td>{user.email}</Td>
                                <Td textAlign="right">
                                  <Tooltip
                                    placement="bottom"
                                    label="Modifier l'utilisateur"
                                  >
                                    <IconButton
                                      aria-label="Modifier l'utilisateur"
                                      icon={<EditIcon />}
                                      colorScheme="green"
                                      variant="outline"
                                      mr={3}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    />
                                  </Tooltip>
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>
                      </Table>
                    </Box>
                  </>
                ) : (
                  <Text fontStyle="italic">Aucun paramètres.</Text>
                )}
              </TabContainerContent>
            </TabContainer>
          </TabPanel>

          <TabPanel>
            <TabContainer>
              <TabContainerHeader heading="Couleurs"></TabContainerHeader>
              <TabContainerContent>
                <Box
                  overflowX="auto"
                  css={css`
                    ${scrollbarCss}
                  `}
                >
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Désignation</Th>
                        <Th width="100%">Palette</Th>
                        <Th minWidth="160px">Code</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Couleur de fond</Td>
                        <Td>
                          <ColorPicker
                            color={{ hex: color }}
                            height={50}
                            onChange={(color) => setColor(color.hex)}
                          />
                        </Td>
                        <Td>
                          <InputGroup>
                            <InputLeftElement children="#" p={0} />
                            <Input
                              type="text"
                              value={color?.substring(1, color.length)}
                              maxLength={6}
                              textTransform="uppercase"
                              p={0}
                              pl={8}
                              onChange={(e) => {
                                setColor("#" + e.target.value);
                              }}
                            />
                          </InputGroup>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </TabContainerContent>
            </TabContainer>
          </TabPanel>

          <TabPanel>
            <TabContainer>
              <TabContainerHeader heading="Configuration"></TabContainerHeader>
              <TabContainerContent>Autres</TabContainerContent>
            </TabContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const userEmail = selectUserEmail(store.getState());
    const isAdmin =
      typeof process.env.NEXT_PUBLIC_ADMIN_EMAILS === "string"
        ? process.env.NEXT_PUBLIC_ADMIN_EMAILS.split(",").includes(userEmail)
        : false;

    if (!isAdmin)
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
      };

    return {
      props: {}
    };
  }
);

export default AdminPage;
