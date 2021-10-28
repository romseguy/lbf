import React, { useMemo, useState } from "react";
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
import { ProjectItemVisibility } from "./ProjectItemVisibility";
import { ProjectsListFilters } from "./ProjectsListFilters";
import { ISelectedOrder, ProjectsListOrder } from "./ProjectsListOrder";
import { hasItems } from "utils/array";
import { IUser } from "models/User";

export const ProjectsList = ({
  org,
  orgQuery,
  isCreator,
  isFollowed,
  isSubscribed,
  isLogin,
  setIsLogin,
  user,
  userQuery,
  ...props
}: {
  org?: IOrg;
  orgQuery?: any;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
  user?: IUser;
  userQuery?: any;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const query = orgQuery || userQuery;

  //#region project
  const [deleteProject, deleteProjectMutation] = useDeleteProjectMutation();
  const projects = useMemo(
    () => [
      ...(org ? org.orgProjects || [] : user ? user.userProjects || [] : [])
    ],
    [org, user]
  );
  //#endregion

  //#region local state
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [projectModalState, setProjectModalState] = useState<{
    isOpen: boolean;
    project?: IProject;
  }>({ isOpen: false, project: undefined });
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<
    ISelectedOrder | undefined
  >({
    key: "createdAt",
    order: "desc"
  });
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
              if (org) {
                if (!isCreator && !isSubscribed) {
                  toast({
                    status: "error",
                    title: `Vous devez être adhérent ${orgTypeFull(
                      org.orgType
                    )} pour ajouter un projet`
                  });
                  return;
                }
              }

              setProjectModalState({ ...projectModalState, isOpen: true });
            } else {
              setIsLogin(isLogin + 1);
            }
          }
        }}
      >
        Ajouter un projet
      </Button>

      {Array.isArray(projects) && projects.length > 1 && (
        <>
          <ProjectsListFilters
            selectedStatuses={selectedStatuses}
            setSelectedStatuses={setSelectedStatuses}
            mb={5}
          />

          <ProjectsListOrder
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            mb={5}
          />
        </>
      )}

      <Grid data-cy="projectList" {...props}>
        {query.isLoading || query.isFetching ? (
          <Text>Chargement des projets...</Text>
        ) : (
          projects
            .sort((a, b) => {
              if (!selectedOrder) return 0;

              const valueA = a[selectedOrder.key];
              const valueB = b[selectedOrder.key];

              if (!valueA || !valueB) return 0;

              if (selectedOrder.order === "asc") {
                if (valueA < valueB) return -1;
                if (valueA > valueB) return 1;
              } else if (selectedOrder.order === "desc") {
                if (valueA > valueB) return -1;
                if (valueA < valueB) return 1;
              }

              return 0;
            })
            .map((project, projectIndex) => {
              const {
                projectName,
                projectDescription,
                projectStatus,
                createdBy,
                createdAt
              } = project;

              if (
                hasItems(selectedStatuses) &&
                !selectedStatuses.includes(projectStatus)
              )
                return null;

              const projectCreatedByUserName =
                typeof createdBy === "object"
                  ? createdBy.userName || createdBy.email?.replace(/@.+/, "")
                  : "";
              const { timeAgo, fullDate } = dateUtils.timeAgo(createdAt, true);
              const isCurrent =
                currentProject && project._id === currentProject._id;
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
                <Box key={project._id} mb={5}>
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
                        setCurrentProject(isCurrent ? null : project)
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
                            <ProjectItemVisibility
                              projectVisibility={project.projectVisibility}
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
                                    project: project
                                  });
                                }}
                              />
                            </Tooltip>

                            <Box aria-hidden mx={1}>
                              ·
                            </Box>

                            <DeleteButton
                              isIconOnly
                              isLoading={isLoading[project._id!]}
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
                                setIsLoading({ [project._id!]: true });
                                try {
                                  let deletedProject;

                                  if (project._id) {
                                    deletedProject = await deleteProject(
                                      project._id
                                    ).unwrap();
                                  }

                                  if (deletedProject) {
                                    // subQuery.refetch();
                                    query.refetch();

                                    toast({
                                      title: `${deletedProject.projectName} a bien été supprimé !`,
                                      status: "success",
                                      isClosable: true
                                    });
                                  }
                                } catch (error: any) {
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
                                project: project
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
                              {Array.isArray(project.projectNotified) &&
                              project.projectNotified.length > 0 ? (
                                project.projectNotified.map(
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
                            project={project}
                            query={query}
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
            query.refetch();
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
    </>
  );
};
