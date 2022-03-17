import { ArrowBackIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Grid,
  Heading,
  IconButton,
  Input,
  VStack,
  TabPanel,
  TabPanels,
  Tooltip,
  useToast
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { css } from "twin.macro";
import {
  Link,
  GridHeader,
  GridItem,
  IconFooter,
  Column
} from "features/common";
import { DocumentsList } from "features/documents/DocumentsList";
import { UserForm } from "features/forms/UserForm";
import { Layout } from "features/layout";
import { ProjectsList } from "features/projects/ProjectsList";
import { IUser } from "models/User";
import { PageProps } from "pages/_app";
import api from "utils/api";
import { sanitize } from "utils/string";
import { AppQueryWithData } from "utils/types";
import { defaultTabs, UserPageTabs } from "./UserPageTabs";
import { UserDescriptionForm } from "features/forms/UserDescriptionForm";

export const UserPage = ({
  email,
  isMobile,
  session,
  userQuery
}: PageProps & {
  userQuery: AppQueryWithData<IUser>;
}) => {
  const router = useRouter();
  const toast = useToast({ position: "top" });

  const isSelf =
    userQuery.data._id === session?.user.userId || session?.user.isAdmin;
  const user = { ...(userQuery.data as IUser), email: email || "" };

  console.groupCollapsed("UserPage");
  console.log("session", session);
  console.log("isSelf", isSelf);
  console.log("user", user);
  console.groupEnd();

  const [isEdit, setIsEdit] = useState(false);
  const [isDescriptionEdit, setIsDescriptionEdit] = useState(false);
  const [isLogin, setIsLogin] = useState(0);

  return (
    <Layout
      pageTitle={user.userName}
      isLogin={isLogin}
      isMobile={isMobile}
      session={session}
    >
      <>
        {session && (isSelf || session.user.isAdmin) && (
          <>
            {!isEdit ? (
              <Button
                colorScheme="teal"
                leftIcon={
                  <SettingsIcon boxSize={6} data-cy="user-settings-button" />
                }
                mb={5}
                onClick={() => setIsEdit(!isEdit)}
                data-cy="user-edit"
              >
                Configuration de votre compte
              </Button>
            ) : (
              <Button
                colorScheme="pink"
                leftIcon={
                  <ArrowBackIcon
                    boxSize={6}
                    data-cy="user-settings-back-button"
                  />
                }
                mb={5}
                onClick={() => setIsEdit(!isEdit)}
                data-cy="user-settings-back-button"
              >
                Revenir à votre page
              </Button>
            )}
          </>
        )}

        {session && isSelf && isEdit && (
          <Column>
            <UserForm
              session={session}
              user={user}
              onSubmit={async ({ userName }) => {
                setIsEdit(false);
                toast({
                  title: "Votre profil a été modifié !",
                  status: "success"
                });

                if (userName && userName !== user.userName) {
                  await router.push(`/${userName}`);
                }
              }}
            />
          </Column>
        )}

        {!isEdit && (
          <UserPageTabs
            isMobile={isMobile}
            tabs={
              isSelf
                ? defaultTabs
                : Object.keys(defaultTabs).reduce((tabs, tabLabel) => {
                    if (["Accueil", "Galerie"].includes(tabLabel))
                      return { ...tabs, [tabLabel]: defaultTabs[tabLabel] };
                    return tabs;
                  }, {})
            }
            height="auto"
          >
            <TabPanels
              css={css`
                & > * {
                  padding: 12px 0 !important;
                }
              `}
            >
              <TabPanel aria-hidden>
                <Grid
                  gridGap={5}
                  css={css`
                    @media (max-width: 650px) {
                      & {
                        grid-template-columns: 1fr !important;
                      }
                    }
                  `}
                >
                  <GridItem
                    light={{ bg: "orange.100" }}
                    dark={{ bg: "gray.500" }}
                    borderTopRadius="lg"
                  >
                    <Grid templateRows="auto 1fr">
                      <GridHeader
                        display="flex"
                        alignItems="center"
                        borderTopRadius="lg"
                      >
                        <Heading size="sm" py={3}>
                          Présentation
                        </Heading>
                        {isSelf && (
                          <Tooltip
                            placement="bottom"
                            label={
                              user.userDescription
                                ? "Modifier la présentation"
                                : "Ajouter une présentation"
                            }
                          >
                            <IconButton
                              aria-label={
                                user.userDescription
                                  ? "Modifier la présentation"
                                  : "Ajouter une présentation"
                              }
                              icon={<EditIcon />}
                              bg="transparent"
                              _hover={{ color: "green" }}
                              onClick={() => {
                                setIsDescriptionEdit(true);
                              }}
                            />
                          </Tooltip>
                        )}
                      </GridHeader>

                      <GridItem
                        light={{ bg: "orange.100" }}
                        dark={{ bg: "gray.500" }}
                      >
                        <Box p={5}>
                          {session && isSelf && isDescriptionEdit ? (
                            <UserDescriptionForm
                              session={session}
                              userQuery={userQuery}
                              onCancel={() => setIsDescriptionEdit(false)}
                              onSubmit={() => setIsDescriptionEdit(false)}
                            />
                          ) : (
                            <>
                              {user.userDescription ? (
                                <div className="rteditor">
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: sanitize(user.userDescription)
                                    }}
                                  />
                                </div>
                              ) : isSelf ? (
                                <Link
                                  variant="underline"
                                  onClick={() => setIsDescriptionEdit(true)}
                                >
                                  Cliquez ici pour ajouter une présentation
                                </Link>
                              ) : (
                                "Aucune présentation."
                              )}
                            </>
                          )}
                        </Box>
                      </GridItem>
                    </Grid>
                  </GridItem>

                  {isSelf && session?.user.isAdmin && !isEdit && (
                    <GridItem
                      light={{ bg: "orange.100" }}
                      dark={{ bg: "gray.500" }}
                      borderTopRadius="lg"
                    >
                      <Grid templateRows="auto 1fr">
                        <GridHeader borderTopRadius="lg" alignItems="center">
                          <Heading size="sm" py={3}>
                            Administration
                          </Heading>
                        </GridHeader>
                        <GridItem>
                          <VStack spacing={5} p={5}>
                            <Button onClick={() => router.push("/sandbox")}>
                              Sandbox
                            </Button>

                            <Button
                              onClick={async () => {
                                try {
                                  const { data } = await api.get(
                                    "admin/backup"
                                  );
                                  const a = document.createElement("a");
                                  const href = window.URL.createObjectURL(
                                    new Blob([JSON.stringify(data)], {
                                      type: "application/json"
                                    })
                                  );
                                  a.href = href;
                                  a.download =
                                    "data-" + format(new Date(), "dd-MM-yyyy");
                                  a.click();
                                  window.URL.revokeObjectURL(href);
                                } catch (error: any) {
                                  console.error(error);
                                  toast({
                                    status: "error",
                                    title: error
                                  });
                                }
                              }}
                            >
                              Exporter les données
                            </Button>

                            <Input
                              accept="*"
                              type="file"
                              height="auto"
                              onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  const file = e.target.files[0];
                                  const reader = new FileReader();
                                  reader.readAsText(file, "UTF-8");
                                  reader.onload = async () => {
                                    if (typeof reader.result !== "string")
                                      return;

                                    try {
                                      await api.post(
                                        "admin/backup",
                                        reader.result
                                      );
                                      toast({
                                        status: "success",
                                        title: "Les données ont été importées"
                                      });
                                    } catch (error: any) {
                                      console.error(error);
                                      toast({
                                        status: "error",
                                        title: error.message
                                      });
                                    }
                                  };
                                }
                              }}
                            />
                          </VStack>
                        </GridItem>
                      </Grid>
                    </GridItem>
                  )}
                </Grid>
              </TabPanel>

              {isSelf && (
                <TabPanel aria-hidden>
                  <ProjectsList
                    user={user}
                    userQuery={userQuery}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                  />
                </TabPanel>
              )}

              {isSelf && (
                <TabPanel aria-hidden>
                  <DocumentsList
                    user={user}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                  />
                </TabPanel>
              )}
            </TabPanels>
          </UserPageTabs>
        )}
      </>
    </Layout>
  );
};
