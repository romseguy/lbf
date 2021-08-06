import React, { useEffect } from "react";
import type { GetServerSidePropsContext } from "next";
import Router, { useRouter } from "next/router";
import {
  Flex,
  Box,
  List,
  ListItem,
  Spinner,
  Text,
  Heading,
  Button,
  useToast,
  useColorModeValue,
  IconButton,
  Icon,
  Grid,
  GridItem,
  Textarea,
  FormLabel
} from "@chakra-ui/react";
import { wrapper } from "store";
import { isServer } from "utils/isServer";
import { OrgTypes } from "models/Org";
import type { IUser } from "models/User";
import { Layout } from "features/layout";
import { getUserByName, useGetUserByNameQuery } from "features/users/usersApi";
import { OrgForm } from "features/forms/OrgForm";
import { Link, GridHeader } from "features/common";
import { useSession } from "hooks/useAuth";
import { useState } from "react";
import { DeleteButton } from "features/common/DeleteButton";
import {
  AddIcon,
  ArrowBackIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  DeleteIcon,
  EditIcon,
  WarningIcon
} from "@chakra-ui/icons";
import { UserForm } from "features/forms/UserForm";
import tw, { css } from "twin.macro";
import api from "utils/api";
import router from "next/router";
import { signOut } from "next-auth/react";
import { selectUserEmail, selectUserImage, selectUserName } from "./userSlice";
import { useSelector } from "react-redux";

export const User = ({
  routeName,
  ...props
}: {
  user: IUser;
  routeName: string;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } =
    useSession(/* {
    required: true,
    action() {
      router.push("/?login");
    }
  } */);

  const query = useGetUserByNameQuery(routeName);
  const user = query.data || props.user;

  const storedUserEmail = useSelector(selectUserEmail);
  const storedUserImage = useSelector(selectUserImage);
  const storedUserName = useSelector(selectUserName);

  const [isEdit, setIsEdit] = useState(false);
  const toast = useToast({ position: "top" });

  // if (isSessionLoading) return <Spinner />;

  return (
    <Layout pageTitle={user.userName}>
      <>
        <Flex mb={5}>
          {user.email === session?.user.email && (
            <>
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
              {/* <DeleteButton
              isLoading={isLoading}
              body={
                <Box p={5} lineHeight={2}>
                  <WarningIcon color="red" /> Êtes vous certain(e) de vouloir
                  supprimer l'événement{" "}
                  <Text display="inline" color="red" fontWeight="bold">
                    {org.orgName}
                  </Text>{" "}
                  ?
                </Box>
              }
              onClick={async () => {
                try {
                  const deletedOrg = await deleteOrg(org.orgName).unwrap();

                  if (deletedOrg) {
                    await Router.push(`/`);
                    toast({
                      title: `${deletedOrg.orgName} a bien été supprimé !`,
                      status: "success",
                      isClosable: true
                    });
                  }
                } catch (error) {
                  toast({
                    title: error.data ? error.data.message : error.message,
                    status: "error",
                    isClosable: true
                  });
                }
              }}
            /> */}
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
              let title;

              if (
                email !== props.user.email &&
                userName !== props.user.userName
              ) {
                title = "Votre page a bien été modifiée !";
              }
              if (email !== props.user.email) {
                title = "Votre e-mail a bien été modifié !";
              } else if (userName !== props.user.userName) {
                title = "Votre nom d'utilisateur a bien été modifié !";
                await router.push(`/${userName}`);
              }

              if (title)
                toast({
                  title,
                  status: "success",
                  isClosable: true
                });

              setIsEdit(false);
            }}
          />
        )}
      </>
    </Layout>
  );
};
