import { ArrowBackIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  Button,
  useToast,
  Icon,
  Textarea,
  VStack
} from "@chakra-ui/react";
import { format } from "date-fns";
import { Session, User } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import tw, { css } from "twin.macro";

import { Layout } from "features/layout";
import { UserForm } from "features/forms/UserForm";
import { useSession } from "hooks/useAuth";
import { IUser } from "models/User";
import { useAppDispatch } from "store";
import api from "utils/api";

export const UserPage = ({
  ...props
}: {
  user: IUser;
  session: Session | null;
}) => {
  const router = useRouter();
  const { data: clientSession } = useSession();
  const session = clientSession || props.session;
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();

  // const userQuery = useGetUserQuery(props.user.userName || props.user._id);
  const isSelf = props.user._id === session?.user.userId;
  const user: Partial<IUser> = isSelf
    ? {
        ...props.user,
        _id: session?.user.userId,
        email: session?.user.email,
        userName: session?.user.userName,
        userImage: session?.user.userImage,
        isAdmin: session?.user.isAdmin
      }
    : props.user;

  const [data, setData] = useState<any>();
  const [isEdit, setIsEdit] = useState(false);

  return (
    <Layout pageTitle={user.userName} session={session}>
      <>
        <Flex mb={5} flexDirection="column">
          {(isSelf || session?.user.isAdmin) && (
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
          )}
        </Flex>

        {isEdit && (
          <UserForm
            user={user}
            onSubmit={async ({ userName }) => {
              setIsEdit(false);
              toast({
                title: "Votre profil a bien été modifié !",
                status: "success",
                isClosable: true
              });

              if (userName && userName !== user.userName) {
                await router.push(`/${userName}`);
              }
            }}
          />
        )}

        {isSelf && session?.user.isAdmin && !isEdit && (
          <VStack spacing={5}>
            <Button onClick={() => router.push("/sandbox")}>Sandbox</Button>

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
                  toast({
                    status: "error",
                    title: query.error.message
                  });
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
    </Layout>
  );
};
