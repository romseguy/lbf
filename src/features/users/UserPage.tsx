import { ArrowBackIcon, EditIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  IconButton,
  Input,
  Textarea,
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
  RTEditor,
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
import { AppQuery } from "utils/types";
import { defaultTabs, UserPageTabs } from "./UserPageTabs";
import { useEditUserMutation } from "./usersApi";

export const UserPage = ({
  email,
  isMobile,
  session,
  userQuery
}: PageProps & {
  userQuery: AppQuery<IUser>;
}) => {
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const isSelf = userQuery.data._id === session?.user.userId;
  const user = { ...(userQuery.data as IUser), email: email || "" };

  console.groupCollapsed("UserPage");
  console.log("session", session);
  console.log("isSelf", isSelf);
  console.log("user", user);
  console.groupEnd();

  const [editUser] = useEditUserMutation();
  const [isEdit, setIsEdit] = useState(false);
  const [isDescriptionEdit, setIsDescriptionEdit] = useState(false);
  const [isLogin, setIsLogin] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState<string | undefined>();

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

        {session && isEdit && (
          <Column m={undefined}>
            <UserForm
              session={session}
              user={user}
              onSubmit={async ({ userName }) => {
                userQuery.refetch();
                setIsEdit(false);
                toast({
                  title: "Votre profil a bien été modifié !",
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
                          {session && isDescriptionEdit ? (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                setIsLoading(true);
                                try {
                                  await editUser({
                                    payload: { userDescription: description },
                                    slug: session.user.userId
                                  }).unwrap();
                                  userQuery.refetch();
                                  toast({
                                    title:
                                      "Votre présentation a bien été enregistrée",
                                    status: "success"
                                  });
                                  setIsDescriptionEdit(false);
                                  setIsLoading(false);
                                } catch (error) {
                                  console.error(error);
                                  setIsLoading(false);
                                  toast({
                                    title:
                                      "Votre présentation n'a pas pu être enregistrée.",
                                    status: "error"
                                  });
                                }
                              }}
                            >
                              <RTEditor
                                session={session}
                                defaultValue={user.userDescription}
                                placeholder="Ajoutez ici votre présentation"
                                onChange={({ html }) => setDescription(html)}
                              />

                              <Flex justifyContent="space-between" mt={5}>
                                <Button
                                  onClick={() => setIsDescriptionEdit(false)}
                                >
                                  Annuler
                                </Button>

                                <Button
                                  colorScheme="green"
                                  type="submit"
                                  isLoading={isLoading}
                                >
                                  {user.userDescription
                                    ? "Modifier"
                                    : "Ajouter"}
                                </Button>
                              </Flex>
                            </form>
                          ) : (
                            <>
                              {user.userDescription ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: sanitize(user.userDescription)
                                  }}
                                />
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
                  <IconFooter />
                </TabPanel>
              )}

              {isSelf && (
                <TabPanel aria-hidden>
                  <DocumentsList
                    user={user}
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                  />
                  <IconFooter />
                </TabPanel>
              )}
            </TabPanels>
          </UserPageTabs>
        )}
      </>
    </Layout>
  );
};
