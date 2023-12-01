import { AddIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  IconButton,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useGetSettingsQuery } from "features/api/settingsApi";
import { useGetUsersQuery } from "features/api/usersApi";
import {
  TabContainer,
  TabContainerContent,
  TabContainerHeader
} from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "main";

import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
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
  const usersQuery = useGetUsersQuery();

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
      typeof process.env.ADMIN_EMAILS === "string"
        ? process.env.ADMIN_EMAILS.split(",").includes(user.email)
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
