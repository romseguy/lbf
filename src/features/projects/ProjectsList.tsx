import React, { useState } from "react";
import { AddIcon, EditIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Spinner,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { useSession } from "hooks/useAuth";
import {
  IProject,
  Status,
  StatusTypes,
  StatusTypesV,
  StatusV
} from "models/Project";
import { ProjectModal } from "features/modals/ProjectModal";
import { IOrg } from "models/Org";
import {
  DeleteButton,
  Grid,
  GridHeader,
  GridItem,
  Link
} from "features/common";
import { useDeleteProjectMutation } from "./projectsApi";
import DOMPurify from "isomorphic-dompurify";
import { ProjectAttendingForm } from "./ProjectAttendingForm";

export const ProjectsList = ({
  org,
  orgQuery,
  isCreator,
  isFollowed,
  isSubscribed,
  isLogin,
  setIsLogin,
  email,
  setEmail,
  ...props
}: {
  org: IOrg;
  orgQuery: any;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
  email: string;
  setEmail: (email: string) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });

  //#region project
  const [deleteProject, deleteProjectMutation] = useDeleteProjectMutation();
  const projectsCount = Array.isArray(org.orgProjects)
    ? org.orgProjects.length
    : 0;
  //#endregion

  //#region local state
  const [projectModalState, setProjectModalState] = useState<{
    isOpen: boolean;
    project?: IProject;
  }>({ isOpen: false, project: undefined });
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);
  //#endregion

  return (
    <>
      <Button
        colorScheme="teal"
        leftIcon={<AddIcon />}
        mb={5}
        onClick={() => {
          if (!isSessionLoading) {
            if (session && isCreator) {
              //setCurrentProject(null);
              setProjectModalState({ ...projectModalState, isOpen: true });
            } else {
              setIsLogin(isLogin + 1);
            }
          }
        }}
      >
        Ajouter un projet
      </Button>

      {projectModalState.isOpen && session && (
        <ProjectModal
          session={session}
          project={projectModalState.project}
          org={org}
          isCreator={isCreator}
          isFollowed={isFollowed}
          isSubscribed={isSubscribed}
          onCancel={() =>
            setProjectModalState({
              ...projectModalState,
              isOpen: false,
              project: undefined
            })
          }
          onSubmit={async (project) => {
            orgQuery.refetch();
            // subQuery.refetch();
            setProjectModalState({
              ...projectModalState,
              isOpen: false,
              project: undefined
            });
            setCurrentProject(project ? project : null);
          }}
          onClose={() =>
            setProjectModalState({
              ...projectModalState,
              isOpen: false,
              project: undefined
            })
          }
        />
      )}

      <Grid>
        {org.orgProjects.map((orgProject, projectIndex) => {
          const { projectName, projectDescription, projectStatus, createdBy } =
            orgProject;
          const isCurrent =
            currentProject && orgProject._id === currentProject._id;
          const isProjectCreator = createdBy === session?.user.userId;
          const bgColor = isDark
            ? projectIndex % 2 === 0
              ? "gray.600"
              : "gray.500"
            : projectIndex % 2 === 0
            ? "orange.200"
            : "orange.100";

          return (
            <Box key={orgProject._id} mb={5}>
              <GridItem
                minWidth="100%"
                p={3}
                borderTopRadius="xl"
                // borderBottomRadius="xl"
                // borderTopRadius={projectIndex === 0 ? "lg" : undefined}
                borderBottomRadius={!isCurrent ? "xl" : undefined}
                light={{
                  bg: bgColor,
                  _hover: {
                    bg: "orange.300"
                  }
                }}
                dark={{
                  bg: bgColor,
                  _hover: {
                    bg: "gray.400"
                  }
                }}
              >
                <Link
                  variant="no-underline"
                  onClick={() =>
                    setCurrentProject(isCurrent ? null : orgProject)
                  }
                  data-cy="project"
                >
                  <Grid templateColumns="auto auto 1fr auto">
                    <GridItem pr={3}>
                      {currentProject && isCurrent ? (
                        <ViewIcon boxSize={6} />
                      ) : (
                        <ViewOffIcon boxSize={6} />
                      )}
                    </GridItem>

                    <GridItem pr={3}>
                      <Tag
                        variant="solid"
                        colorScheme={
                          projectStatus === Status.PENDING
                            ? "red"
                            : projectStatus === Status.ONGOING
                            ? "orange"
                            : "green"
                        }
                      >
                        {StatusV[projectStatus]}
                      </Tag>
                    </GridItem>

                    <GridItem>{projectName}</GridItem>

                    <GridItem>
                      {isProjectCreator && (
                        <>
                          <Tooltip label="Modifier le projet">
                            <IconButton
                              aria-label="Modifier le projet"
                              icon={<EditIcon />}
                              bg="transparent"
                              _hover={{ bg: "transparent", color: "green" }}
                              height="auto"
                              minWidth={0}
                              onClick={() => {
                                setProjectModalState({
                                  isOpen: true,
                                  project: orgProject
                                });
                              }}
                            />
                          </Tooltip>
                          <span aria-hidden> · </span>
                          {deleteProjectMutation.isLoading ? (
                            <Spinner boxSize={4} />
                          ) : (
                            <DeleteButton
                              isIconOnly
                              placement="bottom"
                              bg="transparent"
                              height="auto"
                              minWidth={0}
                              _hover={{ color: "red" }}
                              header={
                                <>
                                  Êtes vous sûr de vouloir supprimer le projet
                                  <Text
                                    display="inline"
                                    color="red"
                                    fontWeight="bold"
                                  >
                                    {` ${projectName}`}
                                  </Text>{" "}
                                  ?
                                </>
                              }
                              onClick={async () => {
                                try {
                                  let deletedProject;

                                  if (orgProject._id) {
                                    deletedProject = await deleteProject(
                                      orgProject._id
                                    ).unwrap();
                                  }

                                  if (deletedProject) {
                                    // subQuery.refetch();
                                    orgQuery.refetch();

                                    toast({
                                      title: `${deletedProject.projectName} a bien été supprimé !`,
                                      status: "success",
                                      isClosable: true
                                    });
                                  }
                                } catch (error) {
                                  toast({
                                    title: error.data
                                      ? error.data.message
                                      : error.message,
                                    status: "error",
                                    isClosable: true
                                  });
                                }
                              }}
                              data-cy="deleteTopic"
                            />
                          )}
                        </>
                      )}
                    </GridItem>
                  </Grid>
                </Link>
              </GridItem>

              {isCurrent && (
                <>
                  <GridItem
                    p={3}
                    light={{ bg: "white" }}
                    dark={{ bg: "gray.700" }}
                  >
                    {projectDescription ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(projectDescription)
                        }}
                      />
                    ) : isProjectCreator ? (
                      <Link
                        onClick={() => {
                          setProjectModalState({
                            isOpen: true,
                            project: orgProject
                          });
                        }}
                        variant="underline"
                      >
                        Cliquez ici pour ajouter la description du projet.
                      </Link>
                    ) : (
                      <Text fontStyle="italic">Aucune description.</Text>
                    )}
                  </GridItem>
                  <GridItem
                    light={{ bg: bgColor }}
                    dark={{ bg: bgColor }}
                    overflowX="auto"
                    borderBottomRadius="xl"
                  >
                    {isProjectCreator ? (
                      <Table>
                        <Tbody>
                          {Array.isArray(orgProject.projectNotified) &&
                          orgProject.projectNotified.length > 0 ? (
                            orgProject.projectNotified.map(
                              ({ email, status }) => (
                                <Tr>
                                  <Td>{email}</Td>
                                  <Td>
                                    <Tag
                                      variant="solid"
                                      colorScheme={
                                        status === StatusTypes.PENDING
                                          ? "blue"
                                          : status === StatusTypes.OK
                                          ? "green"
                                          : "red"
                                      }
                                    >
                                      {StatusTypesV[status]}
                                    </Tag>
                                  </Td>
                                </Tr>
                              )
                            )
                          ) : (
                            <Box p={3} fontStyle="italic">
                              Personne n'a indiqué participer.
                            </Box>
                          )}
                        </Tbody>
                      </Table>
                    ) : (
                      <ProjectAttendingForm
                        project={orgProject}
                        orgQuery={orgQuery}
                        email={email}
                        setEmail={setEmail}
                      />
                    )}
                  </GridItem>
                </>
              )}
            </Box>
          );
        })}
      </Grid>
    </>
  );
};
