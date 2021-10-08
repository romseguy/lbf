import { useRouter } from "next/router";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import tw, { css } from "twin.macro";
import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  Button,
  useToast,
  Icon,
  Textarea,
  Alert,
  AlertIcon,
  VStack
} from "@chakra-ui/react";
import { useSession } from "hooks/useAuth";
import api from "utils/api";
import type { IUser } from "models/User";
import { Layout } from "features/layout";
import { UserForm } from "features/forms/UserForm";
import {
  selectUserEmail,
  selectUserImage,
  selectUserName,
  setUserEmail
} from "./userSlice";
import { useGetUserQuery } from "./usersApi";
import { useAppDispatch } from "store";
import { signOut } from "next-auth/client";

export const UserPage = ({ ...props }: { user: IUser }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  console.log(session);

  const userQuery = useGetUserQuery(props.user.userName || props.user._id, {
    selectFromResult: (query) => query
  });
  const user = userQuery.data || props.user;

  const storedUserEmail = useSelector(selectUserEmail);
  const storedUserImage = useSelector(selectUserImage);
  const storedUserName = useSelector(selectUserName);

  const [data, setData] = useState<any>();
  const [isEdit, setIsEdit] = useState(false);

  return (
    <Layout pageTitle={user.userName}>
      <>
        <Flex mb={5} flexDirection="column">
          {user.email === session?.user.email && (
            <>
              <Box>
                <Button
                  aria-label="Modifier"
                  leftIcon={<Icon as={isEdit ? ArrowBackIcon : EditIcon} />}
                  mr={3}
                  onClick={() => setIsEdit(!isEdit)}
                  css={css`
                    &:hover {
                      ${tw`bg-green-300`}
                    }
                  `}
                  data-cy="userEdit"
                >
                  {isEdit ? "Retour" : "Modifier"}
                </Button>
              </Box>
              {session?.user.isAdmin && (
                <VStack spacing={5}>
                  <Alert mt={3} status="info">
                    <AlertIcon />
                    Vous êtes administrateur.
                  </Alert>

                  <Button onClick={() => router.push("/sandbox")}>
                    Sandbox
                  </Button>

                  <Button
                    onClick={async () => {
                      const { error, data } = await api.get("admin/backup");
                      const a = document.createElement("a");
                      const href = window.URL.createObjectURL(
                        new Blob([JSON.stringify(data)], {
                          type: "application/json"
                        })
                      );
                      a.href = href;
                      a.download = "data-" + format(new Date(), "dd-MM-yyyy");
                      a.click();
                      window.URL.revokeObjectURL(href);
                    }}
                  >
                    Exporter les données
                  </Button>

                  <Textarea
                    onChange={(e) => setData(e.target.value)}
                    placeholder="Copiez ici les données exportées précédemment"
                  />
                  <Button
                    isDisabled={!data}
                    onClick={async () => {
                      const query = await api.post("admin/backup", data);

                      if (query.error) {
                        toast({ status: "error", title: query.error.message });
                      } else {
                        toast({
                          status: "success",
                          title: "Les données ont été importées"
                        });
                      }
                    }}
                  >
                    Importer les données
                  </Button>
                </VStack>
              )}
            </>
          )}
        </Flex>

        {isEdit && (
          <UserForm
            user={{
              ...user,
              email: storedUserEmail || user.email,
              userImage: storedUserImage || user.userImage,
              userName: storedUserName || user.userName
            }}
            onSubmit={async ({ userName, email }) => {
              // let title;
              // if (email !== user.email && userName !== user.userName) {
              //   title = "Votre page a bien été modifiée !";
              // }
              // if (email !== user.email) {
              //   title = "Votre e-mail a bien été modifié !";
              // } else if (userName !== user.userName) {
              //   title = "Votre nom d'utilisateur a bien été modifié !";
              // }

              setIsEdit(false);

              if (email !== user.email) {
                toast({
                  title:
                    "Votre e-mail a été modifié. Merci de vous reconnecter.",
                  status: "warning",
                  isClosable: true
                });
                dispatch(setUserEmail(null));
                const { url } = await signOut({
                  redirect: false,
                  callbackUrl: "/"
                });
                router.push(url);
              } else {
                toast({
                  title: "Votre page a bien été modifiée !",
                  status: "success",
                  isClosable: true
                });
                if (userName !== user.userName) {
                  await router.push(`/${userName}`);
                }
              }
            }}
          />
        )}
      </>
    </Layout>
  );
};
