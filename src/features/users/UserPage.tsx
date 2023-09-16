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
  useToast,
  FormControl,
  FormLabel
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { css } from "twin.macro";
import { Link, GridHeader, GridItem, Column, FileInput } from "features/common";
import {
  DocumentsList,
  DocumentsListMasonry
} from "features/documents/DocumentsList";
import { UserDescriptionForm } from "features/forms/UserDescriptionForm";
import { UserForm } from "features/forms/UserForm";
import { Layout } from "features/layout";
import { IUser } from "models/User";
import { PageProps } from "main";
import api from "utils/api";
import { sanitize } from "utils/string";
import { AppQueryWithData } from "utils/types";
import { defaultTabs, UserPageTabs } from "./UserPageTabs";
import { useSession } from "hooks/useSession";
import { useSelector } from "react-redux";
import { selectUserEmail } from "store/userSlice";

export const UserPage = ({
  isMobile,
  userQuery
}: PageProps & {
  userQuery: AppQueryWithData<IUser>;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const email = useSelector(selectUserEmail) || session?.user.email;

  const isSelf =
    userQuery.data._id === session?.user.userId || session?.user.isAdmin;
  const user = { ...userQuery.data, email: email || "" } as IUser;

  console.groupCollapsed("UserPage");
  console.log("session", session);
  console.log("isSelf", isSelf);
  console.log("user", user);
  console.groupEnd();

  const [isEdit, setIsEdit] = useState(false);
  const [isDescriptionEdit, setIsDescriptionEdit] = useState(false);
  const tabs = isSelf
    ? defaultTabs
    : Object.keys(defaultTabs).reduce((tabs, tabLabel) => {
        if (["Accueil"].includes(tabLabel))
          return { ...tabs, [tabLabel]: defaultTabs[tabLabel] };
        return tabs;
      }, {});

  return (
    <Layout entity={user} isMobile={isMobile}>
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
        <UserPageTabs tabs={tabs} height="auto">
          <TabPanels
            css={css`
              & > * {
                padding: 12px 0 !important;
              }
            `}
          >
            <TabPanel aria-hidden>
              <Grid templateRows="auto 1fr" mb={3}>
                <GridHeader
                  display="flex"
                  alignItems="center"
                  borderTopRadius="lg"
                  py={isSelf ? 0 : 3}
                >
                  <Heading size="sm">Présentation</Heading>

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
                  p={3}
                  pb={0}
                >
                  <>
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
                  </>
                </GridItem>
              </Grid>

              {isSelf && session?.user.isAdmin && !isEdit && (
                <Grid templateRows="auto 1fr">
                  <GridHeader borderTopRadius="lg" py={3}>
                    <Heading size="sm">Administration</Heading>
                  </GridHeader>
                  <GridItem
                    light={{ bg: "orange.100" }}
                    dark={{ bg: "gray.500" }}
                    p={3}
                  >
                    <form>
                      <FormControl mb={3}>
                        <FormLabel>Sandbox</FormLabel>
                        <Link href="/sandbox" target="_blank">
                          <Button alignSelf="flex-start" colorScheme="teal">
                            Ouvrir
                          </Button>
                        </Link>
                      </FormControl>

                      <FormControl mb={3}>
                        <FormLabel>Exporter les données</FormLabel>
                        <Button
                          alignSelf="flex-start"
                          colorScheme="teal"
                          onClick={async () => {
                            try {
                              const { data } = await api.get("admin/backup");
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
                          Exporter
                        </Button>
                      </FormControl>

                      <FormControl mb={3}>
                        <FormLabel>Importer les données</FormLabel>
                        <FileInput
                          height="auto"
                          width="auto"
                          pl={0}
                          css={css`
                            background: none !important;
                            border: none !important;
                          `}
                          onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              const reader = new FileReader();
                              reader.readAsText(file, "UTF-8");
                              reader.onload = async () => {
                                if (typeof reader.result !== "string") return;

                                try {
                                  await api.post("admin/backup", reader.result);
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
                      </FormControl>
                    </form>
                  </GridItem>
                </Grid>
              )}
            </TabPanel>

            {/* {isSelf && (
                <TabPanel aria-hidden>
                  <ProjectsList
                    user={user}
                    userQuery={userQuery}
                  />
                </TabPanel>
              )} */}

            {isSelf && (
              <TabPanel aria-hidden>
                <DocumentsList user={user} />
                <DocumentsListMasonry user={user} />
              </TabPanel>
            )}
          </TabPanels>
        </UserPageTabs>
      )}
    </Layout>
  );
};
