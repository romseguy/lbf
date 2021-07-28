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

export const User = ({
  routeName,
  ...props
}: {
  user: IUser;
  routeName: string;
}) => {
  const router = useRouter();
  const query = useGetUserByNameQuery(routeName);
  const user = query.data || props.user;
  // const [deleteOrg, { isLoading }] = useDeleteUserMutation();
  const { data: session, loading: isSessionLoading } =
    useSession(/* {
    required: true,
    action() {
      router.push("/?login");
    }
  } */);
  const [isEdit, setIsEdit] = useState(false);
  const toast = useToast({ position: "top" });

  // if (isSessionLoading) return <Spinner />;

  return (
    <Layout pageTitle={user.userName}>
      <>
        <Flex mb={5}>
          {user.email === session?.user.email && (
            <>
              <IconButton
                aria-label="Modifier"
                icon={<Icon as={EditIcon} />}
                mr={3}
                onClick={() => setIsEdit(!isEdit)}
                css={css`
                  &:hover {
                    ${tw`bg-green-300`}
                  }
                  ${isEdit && tw`bg-green-300`}
                `}
                data-cy="userEdit"
              />
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
            user={user}
            onSubmit={async ({ userName, email }) => {
              // if (
              //   userName !== props.user.userName ||
              //   email !== props.user.email
              // ) {
              //   toast({
              //     title:
              //       "Votre profil a bien été modifié, merci de vous reconnecter.",
              //     status: "success",
              //     isClosable: true
              //   });

              //   await signOut({
              //     redirect: false
              //   });

              //   router.push("/?login");
              // } else {
              toast({
                title: "Votre profil a bien été modifié !",
                status: "success",
                isClosable: true
              });

              setIsEdit(false);

              const res = await api.get("auth/session?update");
              console.log(res);
              // }
            }}
          />
        )}
      </>
    </Layout>
  );
};
