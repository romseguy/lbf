import { AddIcon, EditIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
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
import React, { useMemo, useState } from "react";
import { FaFolderOpen, FaFolder } from "react-icons/fa";
import { useSession } from "hooks/useSession";
import { DeleteButton, Grid, GridItem, Link } from "features/common";
import { ProjectFormModal } from "features/modals/ProjectFormModal";
import { IOrg, orgTypeFull } from "models/Org";
import {
  IProject,
  EProjectStatus,
  EProjectInviteStatus,
  ProjectInviteStatuses,
  ProjectStatuses
} from "models/Project";
import { ISubscription } from "models/Subscription";
import { IUser } from "models/User";
import { hasItems } from "utils/array";
import * as dateUtils from "utils/date";
import { sanitize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { ProjectAttendingForm } from "./ProjectAttendingForm";
import { ProjectsListItemVisibility } from "./ProjectsListItemVisibility";
import {
  useAddProjectNotifMutation,
  useDeleteProjectMutation
} from "features/api/projectsApi";
import { ProjectsListFilters } from "./ProjectsListFilters";
import { ISelectedOrder, ProjectsListOrder } from "./ProjectsListOrder";
import {
  EntityNotifModal,
  NotifModalState
} from "features/modals/EntityNotifModal";
import { getRefId } from "models/Entity";

export const ProjectsList = ({
  org,
  orgQuery,
  user,
  userQuery,
  subQuery,
  isCreator,
  isFollowed,
  isLogin,
  setIsLogin,
  ...props
}: {
  // either
  org?: IOrg;
  orgQuery?: AppQueryWithData<IOrg>;
  // or
  user?: IUser;
  userQuery?: AppQueryWithData<IUser>;
  // end either
  subQuery?: AppQuery<ISubscription>;
  isCreator?: boolean;
  isFollowed?: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const query = (orgQuery || userQuery) as AppQueryWithData<IOrg | IUser>;

  //#region local state
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [notifyModalState, setNotifyModalState] = useState<
    NotifModalState<IProject>
  >({});
  const [projectModalState, setProjectModalState] = useState<{
    isOpen: boolean;
    project?: IProject;
  }>({ isOpen: false, project: undefined });
  const [selectedOrder, setSelectedOrder] = useState<
    ISelectedOrder | undefined
  >({
    key: "createdAt",
    order: "desc"
  });
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  //#endregion

  //#region project
  const addProjectNotifMutation = useAddProjectNotifMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const projects = useMemo(
    () =>
      [
        ...(org ? org.orgProjects : user ? user.userProjects : []).filter(
          (project) => {
            if (
              hasItems(selectedStatuses) &&
              !selectedStatuses.includes(project.projectStatus)
            )
              return false;
            return true;
          }
        )
      ].sort((a, b) => {
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
      }),

    [org, user, selectedOrder, selectedStatuses]
  );
  //#endregion

  const onDeleteClick = async (project: IProject) => {
    setIsLoading({ [project._id]: true });
    try {
      let deletedProject;

      if (project._id) {
        deletedProject = await deleteProject(project._id).unwrap();
      }

      if (deletedProject) {
        // subQuery.refetch();
        query.refetch();

        toast({
          title: `Le projet ${deletedProject.projectName} a été supprimé !`,
          status: "success"
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: `Le projet n'a pas pu être supprimé`,
        status: "error"
      });
    }
  };

  const onEditClick = (project: IProject) => {
    setProjectModalState({
      isOpen: true,
      project
    });
  };

  const onNotifClick = (project: IProject) => {
    setNotifyModalState({
      ...notifyModalState,
      entity: project
    });
  };

  return (
    <>
      <Flex>
        <Button
          colorScheme="teal"
          leftIcon={<AddIcon />}
          mb={5}
          onClick={() => {
            if (!isSessionLoading) {
              if (session) {
                if (org) {
                  if (!isCreator) {
                    toast({
                      status: "error",
                      title: `Vous n'avez pas la permission ${orgTypeFull(
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
      </Flex>

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

      <Grid data-cy="projectList">
        {query.isLoading ? (
          <Spinner />
        ) : !projects.length ? (
          <Alert status="warning">
            <AlertIcon /> Aucun projets.
          </Alert>
        ) : (
          projects.map((project, projectIndex) => {
            const isCurrent =
              currentProject && project._id === currentProject._id;
            const isProjectCreator =
              isCreator || getRefId(project) === session?.user.userId;
            const {
              projectName,
              projectDescription,
              projectStatus,
              projectVisibility,
              createdBy,
              createdAt
            } = project;

            const projectCreatedByUserName =
              typeof createdBy === "object"
                ? createdBy.userName || createdBy.email?.replace(/@.+/, "")
                : "";
            const { timeAgo, fullDate } = dateUtils.timeAgo(createdAt, true);

            return (
              <Box
                key={project._id}
                mb={projectIndex < projects.length - 1 ? 5 : 0}
              >
                <Link
                  as="div"
                  variant="no-underline"
                  onClick={() => setCurrentProject(isCurrent ? null : project)}
                  data-cy="project-list-item"
                >
                  <Flex
                    flexWrap="wrap"
                    borderTopRadius="xl"
                    borderBottomRadius={!isCurrent ? "xl" : undefined}
                    bg={
                      projectIndex % 2 === 0
                        ? isDark
                          ? "gray.600"
                          : "orange.200"
                        : isDark
                        ? "gray.500"
                        : "orange.100"
                    }
                  >
                    <Flex flexDirection="column" flexGrow={1} px={3} py={1}>
                      <Flex>
                        {isCurrent ? (
                          <Icon
                            as={FaFolderOpen}
                            boxSize={6}
                            color={isDark ? "teal.200" : "teal"}
                            mr={2}
                          />
                        ) : (
                          <Icon
                            as={FaFolder}
                            boxSize={6}
                            color={isDark ? "teal.200" : "teal"}
                            mr={2}
                          />
                        )}

                        <Tag
                          colorScheme={
                            projectStatus === EProjectStatus.PENDING
                              ? "red"
                              : projectStatus === EProjectStatus.ONGOING
                              ? "orange"
                              : "green"
                          }
                          variant="solid"
                          mr={2}
                        >
                          {ProjectStatuses[projectStatus]}
                        </Tag>

                        <Link variant="no-underline" fontWeight="bold">
                          {project.projectName}
                        </Link>
                      </Flex>

                      <Flex
                        flexWrap="wrap"
                        fontSize="smaller"
                        color={isDark ? "white" : "purple"}
                        ml={8}
                      >
                        <Tooltip label="Aller à la page de l'utilisateur">
                          <Link
                            href={`/${projectCreatedByUserName}`}
                            _hover={{
                              color: isDark ? "white" : "white",
                              textDecoration: "underline"
                            }}
                          >
                            {projectCreatedByUserName}
                          </Link>
                        </Tooltip>

                        <Box as="span" aria-hidden mx={1}>
                          ·
                        </Box>

                        <Tooltip
                          placement="bottom"
                          label={`Projet créé le ${fullDate}`}
                        >
                          <Text
                            cursor="default"
                            _hover={{
                              color: isDark ? "white" : "white"
                            }}
                          >
                            {timeAgo}
                          </Text>
                        </Tooltip>

                        <Box as="span" aria-hidden mx={1}>
                          ·
                        </Box>

                        <ProjectsListItemVisibility
                          org={org}
                          projectVisibility={projectVisibility}
                        />

                        {/* <ProjectsListItemShare aria-label="Partager" project={project} /> */}

                        {isCreator && (
                          <>
                            <Box as="span" aria-hidden mx={1}>
                              ·
                            </Box>

                            <Link
                              _hover={{
                                color: isDark ? "white" : "white",
                                textDecoration: "underline"
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onNotifClick(project);
                              }}
                            >
                              {project.projectNotifications.length} personnes
                              invitées
                            </Link>
                          </>
                        )}
                      </Flex>
                    </Flex>

                    <Flex alignItems="center" mb={-1} ml={2}>
                      {isLoading[project._id] && (
                        <Spinner mr={3} mt={1} mb={2} />
                      )}

                      {!isLoading[project._id] && (
                        <>
                          {org && isCreator && (
                            <Tooltip
                              placement="bottom"
                              label="Envoyer des invitations"
                            >
                              <IconButton
                                aria-label="Envoyer des invitations"
                                icon={<EmailIcon />}
                                variant="outline"
                                colorScheme="blue"
                                mr={3}
                                mt={1}
                                mb={2}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNotifClick(project);
                                }}
                              />
                            </Tooltip>
                          )}

                          {isProjectCreator && (
                            <>
                              <Tooltip
                                placement="bottom"
                                label="Modifier le projet"
                              >
                                <IconButton
                                  aria-label="Modifier le projet"
                                  icon={<EditIcon />}
                                  colorScheme="green"
                                  variant="outline"
                                  mr={3}
                                  mt={1}
                                  mb={2}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEditClick(project);
                                  }}
                                />
                              </Tooltip>

                              <DeleteButton
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
                                isIconOnly
                                isSmall={false}
                                mb={2}
                                mr={3}
                                mt={1}
                                placement="bottom"
                                variant="outline"
                                onClick={() => {
                                  onDeleteClick(project);
                                }}
                                data-cy="deleteTopic"
                              />
                            </>
                          )}
                        </>
                      )}
                    </Flex>
                  </Flex>
                </Link>

                {isCurrent && (
                  <>
                    <GridItem
                      p={3}
                      light={{ bg: "orange.50" }}
                      dark={{ bg: "gray.700" }}
                    >
                      {projectDescription ? (
                        <Box className="rteditor">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: sanitize(projectDescription)
                            }}
                          />
                        </Box>
                      ) : isProjectCreator ? (
                        <Link
                          onClick={() => {
                            setProjectModalState({
                              isOpen: true,
                              project
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
                      bg={isDark ? "#314356" : "blue.100"}
                      overflowX="auto"
                      borderBottomRadius="xl"
                      minHeight="12px"
                    >
                      {org && (
                        <>
                          {isProjectCreator ? (
                            <Table>
                              <Tbody>
                                {Array.isArray(project.projectNotifications) &&
                                project.projectNotifications.length > 0 ? (
                                  project.projectNotifications.map(
                                    ({ email, status }) => (
                                      <Tr>
                                        <Td>{email}</Td>
                                        <Td>
                                          <Tag
                                            variant="solid"
                                            colorScheme={
                                              status ===
                                              EProjectInviteStatus.PENDING
                                                ? "blue"
                                                : status ===
                                                  EProjectInviteStatus.OK
                                                ? "green"
                                                : "red"
                                            }
                                          >
                                            {ProjectInviteStatuses[status]}
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
                        </>
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
        <ProjectFormModal
          session={session}
          project={projectModalState.project}
          org={org}
          isCreator={isCreator}
          isFollowed={isFollowed}
          onCancel={() =>
            setProjectModalState({
              ...projectModalState,
              isOpen: false,
              project: undefined
            })
          }
          onSubmit={async (project) => {
            localStorage.removeItem("storageKey");
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

      {session && org && (
        <EntityNotifModal
          query={query as AppQueryWithData<IOrg>}
          mutation={addProjectNotifMutation}
          setModalState={setNotifyModalState}
          modalState={notifyModalState}
          session={session}
        />
      )}
    </>
  );
};

{
  /*
                    <GridItem lineHeight={1} py={3}>
                      <Flex flexDirection="column">
                        <Text fontWeight="bold">{projectName}</Text>
                        <Flex
                          alignItems="center"
                          flexWrap="wrap"
                          fontSize="smaller"
                          color={isDark ? "white" : "gray.600"}
                          mt={1}
                        >
                          <Text mr={1}>{projectCreatedByUserName}</Text>

                          <span aria-hidden> · </span>

                          <Tooltip placement="bottom" label={fullDate}>
                            <Text mx={1}>{timeAgo}</Text>
                          </Tooltip>

                          {org && (
                            <>
                              <span aria-hidden> · </span>

                              <ProjectsListItemVisibility
                                org={org}
                                projectVisibility={projectVisibility}
                                ml={1}
                              />
                            </>
                          )}
                        </Flex>
                      </Flex>
                    </GridItem>
  */
}
