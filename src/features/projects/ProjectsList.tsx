import React, { useState } from "react";
import {
  AddIcon,
  EditIcon,
  EmailIcon,
  ViewIcon,
  ViewOffIcon
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
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
  StatusV,
  Visibility
} from "models/Project";
import { ProjectModal } from "features/modals/ProjectModal";
import { IOrg, orgTypeFull } from "models/Org";
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
import * as dateUtils from "utils/date";
import { IoMdPerson } from "react-icons/io";
import { FaGlobeEurope } from "react-icons/fa";

const ProjectVisibility = ({
  projectVisibility
}: {
  projectVisibility?: string;
}) =>
  projectVisibility === Visibility.SUBSCRIBERS ? (
    <Tooltip label="Projet réservé aux adhérents">
      <span>
        <Icon as={IoMdPerson} boxSize={4} />
      </span>
    </Tooltip>
  ) : projectVisibility === Visibility.FOLLOWERS ? (
    <Tooltip label="Projet réservé aux abonnés">
      <EmailIcon boxSize={4} />
    </Tooltip>
  ) : projectVisibility === Visibility.PUBLIC ? (
    <Tooltip label="Projet public">
      <span>
        <Icon as={FaGlobeEurope} boxSize={4} />
      </span>
    </Tooltip>
  ) : null;

export const ProjectsList = ({
  org,
  orgQuery,
  isCreator,
  isFollowed,
  isSubscribed,
  isLogin,
  setIsLogin,
  ...props
}: {
  org: IOrg;
  orgQuery: any;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
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
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
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
            if (session) {
              if (!isCreator && !isSubscribed) {
                toast({
                  status: "error",
                  title: `Vous devez être adhérent ${orgTypeFull(
                    org.orgType
                  )} pour ajouter un projet`
                });
              } else {
                setProjectModalState({ ...projectModalState, isOpen: true });
              }
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

      <Grid data-cy="projectList" {...props}>
        {orgQuery.isLoading || orgQuery.isFetching ? (
          <Text>Chargement des projets...</Text>
        ) : (
          org.orgProjects.map((orgProject, projectIndex) => {
            const {
              projectName,
              projectDescription,
              projectStatus,
              createdBy,
              createdAt
            } = orgProject;
            const projectCreatedByUserName =
              typeof createdBy === "object"
                ? createdBy.userName || createdBy.email?.replace(/@.+/, "")
                : "";
            const { timeAgo, fullDate } = dateUtils.timeAgo(createdAt, true);
            const isCurrent =
              currentProject && orgProject._id === currentProject._id;
            const isProjectCreator =
              typeof createdBy === "object"
                ? createdBy._id === session?.user.userId
                : "";
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
                      <GridItem display="flex" alignItems="center" pr={3}>
                        {currentProject && isCurrent ? (
                          <ViewIcon boxSize={6} />
                        ) : (
                          <ViewOffIcon boxSize={6} />
                        )}
                      </GridItem>

                      <GridItem display="flex" alignItems="center" pr={3}>
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

                      <GridItem>
                        <Text fontWeight="bold">{projectName}</Text>
                        <Box
                          display="inline"
                          fontSize="smaller"
                          color={isDark ? "white" : "gray.600"}
                        >
                          {projectCreatedByUserName}
                          <span aria-hidden> · </span>
                          <Tooltip placement="bottom" label={fullDate}>
                            <span>{timeAgo}</span>
                          </Tooltip>
                          <span aria-hidden> · </span>
                          <ProjectVisibility
                            projectVisibility={orgProject.projectVisibility}
                          />
                        </Box>
                      </GridItem>

                      {isProjectCreator && (
                        <GridItem display="flex" alignItems="center">
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

                          <Box aria-hidden mx={1}>
                            ·
                          </Box>

                          <DeleteButton
                            isIconOnly
                            isLoading={isLoading[orgProject._id!]}
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
                              setIsLoading({ [orgProject._id!]: true });
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
                        </GridItem>
                      )}
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
                        <Box className="ql-editor">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(projectDescription)
                            }}
                          />
                        </Box>
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
                              <Tr>
                                <Td>
                                  <Text fontStyle="italic">
                                    Personne n'a indiqué participer.
                                  </Text>
                                </Td>
                              </Tr>
                            )}
                          </Tbody>
                        </Table>
                      ) : (
                        <ProjectAttendingForm
                          project={orgProject}
                          orgQuery={orgQuery}
                        />
                      )}
                    </GridItem>
                  </>
                )}
              </Box>
            );
          })
        )}
      </Grid>
    </>
  );
};
