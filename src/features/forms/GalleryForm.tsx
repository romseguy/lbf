import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Flex,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useFormPersist from "hooks/useFormPersist";
import Creatable from "react-select/creatable";
import { ErrorMessageText } from "features/common";
import { useEditOrgMutation } from "features/api/orgsApi";
import {
  AddGalleryPayload,
  EditGalleryPayload,
  useAddGalleryMutation,
  useEditGalleryMutation
} from "features/api/galleriesApi";
import { useSession } from "hooks/useSession";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import { IOrg, orgTypeFull } from "models/Org";
import { IGallery } from "models/Gallery";
import { handleError } from "utils/form";
import { defaultErrorMessage } from "utils/string";
import { AppQueryWithData } from "utils/types";

export const GalleryForm = ({
  query,
  //subQuery,
  ...props
}: {
  query: AppQueryWithData<IOrg>;
  gallery?: IGallery;
  isCreator?: boolean;
  onCancel?: () => void;
  onSubmit?: (gallery: IGallery) => void;
}) => {
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const [addGallery, addGalleryMutation] = useAddGalleryMutation();
  const [editGallery, editGalleryMutation] = useEditGalleryMutation();
  const [edit] = useEditOrgMutation();

  //#region local state
  const entity = query.data;
  // const isEntityPrivate =
  //   org?.orgVisibility === EOrgVisibility.PRIVATE ||
  //   event?.eventVisibility === EEventVisibility.PRIVATE;
  //const edit = isE ? editEvent : editOrg;
  const galleryCategories =
    //isE ? entity.eventGalleryCategories : isO ?
    entity.orgGalleryCategories || [];
  const galleryCategory =
    props.gallery &&
    props.gallery.galleryCategory &&
    galleryCategories.find(
      ({ catId }) => catId === props.gallery!.galleryCategory
    );
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region form
  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    setValue,
    formState
  } = useFormPersist(
    useForm<{
      galleryName: string;
      galleryCategory: { label: string; value: string } | null;
      //galleryMessage?: string;
    }>({
      mode: "onChange",
      defaultValues: {
        galleryName: props.gallery?.galleryName,
        galleryCategory: galleryCategory
          ? { label: galleryCategory.label, value: galleryCategory.catId }
          : null
        //galleryMessage: ""
      }
    })
  );
  useLeaveConfirm({ formState });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: {
    galleryName: string;
    galleryMessage?: string;
    galleryCategory?: { label: string; value: string } | null;
    galleryVisibility?: [{ label: string; value: string }];
  }) => {
    console.log("submitted", form);
    setIsLoading(true);

    let gallery: Partial<IGallery> = {
      galleryCategory: form.galleryCategory ? form.galleryCategory.value : null,
      galleryName: form.galleryName
      // galleryVisibility: (form.galleryVisibility || []).map(
      //   ({ label, value }) => value
      // )
    };

    try {
      if (props.gallery) {
        const payload: EditGalleryPayload = {
          gallery
        };

        const editedGallery = await editGallery({
          payload,
          galleryId: props.gallery._id
        }).unwrap();

        toast({
          title: "La galerie a été modifiée",
          status: "success"
        });

        setIsLoading(false);
        props.onSubmit && props.onSubmit(editedGallery);
      } else {
        // if (
        //   typeof form.galleryMessage === "string" &&
        //   form.galleryMessage !== ""
        // ) {
        //   gallery.galleryMessages = [
        //     {
        //       message: form.galleryMessage,
        //       //messageHtml: form.galleryMessage,
        //       createdBy: session.user.userId
        //     }
        //   ];
        // }

        let payload: AddGalleryPayload = {
          org: entity,
          gallery
        };

        const newGallery = await addGallery({
          payload
        }).unwrap();

        toast({
          title: "La galerie a été ajoutée !",
          status: "success"
        });

        setIsLoading(false);
        props.onSubmit && props.onSubmit(newGallery);
      }
    } catch (error: any) {
      setIsLoading(false);
      handleError(error, (message, field) =>
        field
          ? setError(field, { type: "manual", message })
          : setError("formErrorMessage", { type: "manual", message })
      );
    }
  };
  //#endregion

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isRequired isInvalid={!!errors["galleryName"]} mb={3}>
        <FormLabel>Nom de la galerie</FormLabel>
        <Input
          name="galleryName"
          ref={register({
            required: "Veuillez saisir l'nom de la galerie"
          })}
          autoComplete="off"
          placeholder="Nom"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="galleryName" />
        </FormErrorMessage>
      </FormControl>

      {/* {!props.gallery && (
        <FormControl isInvalid={!!errors["galleryMessage"]} mb={3}>
          <FormLabel>Message (optionnel)</FormLabel>
          <Controller
            name="galleryMessage"
            control={control}
            render={(renderProps) => {
              return (
                <RTEditor
                  placeholder="Contenu de votre message"
                  onChange={({ html }) => {
                    renderProps.onChange(html);
                  }}
                />
              );
            }}
          />
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="galleryMessage" />
          </FormErrorMessage>
        </FormControl>
      )} */}

      <FormControl isInvalid={!!errors["galleryCategory"]} mb={3}>
        <FormLabel>Catégorie (optionnel)</FormLabel>
        <Controller
          name="galleryCategory"
          control={control}
          render={(renderProps) => {
            let value = renderProps.value;

            return (
              <Creatable
                value={value}
                onChange={renderProps.onChange}
                options={
                  galleryCategories.map(({ catId: value, label }) => {
                    return {
                      label,
                      value
                    };
                  }) || []
                }
                allowCreateWhileLoading
                formatCreateLabel={(inputValue: string) =>
                  `Ajouter la catégorie "${inputValue}"`
                }
                onCreateOption={async (inputValue: string) => {
                  // if (!props.isCreator) {
                  //   toast({
                  //     status: "error",
                  //     title: `Vous n'avez pas la permission ${
                  //       isE
                  //         ? "de l'événement"
                  //         : isO
                  //         ? orgTypeFull(entity.orgType)
                  //         : ""
                  //     } pour ajouter une catégorie`
                  //   });
                  //   return;
                  // }

                  // if (
                  //   entity.orgGalleryCategories.find(
                  //     (orgGalleriesCategory) =>
                  //       orgGalleriesCategory === normalize(inputValue, false)
                  //   )
                  // ) {
                  //   toast({
                  //     status: "error",
                  //     title: `Ce nom de catégorie n'est pas disponible`,
                  //                         //   });
                  //   return;
                  // }

                  try {
                    const catId = "" + galleryCategories.length;
                    await edit({
                      ["orgId"]: entity._id,
                      payload: {
                        ["orgGalleryCategories"]: [
                          ...galleryCategories,
                          {
                            catId,
                            label: inputValue
                          }
                        ]
                      }
                    }).unwrap();
                    //}

                    setValue("galleryCategory", {
                      label: inputValue,
                      value: catId
                    });
                    toast({
                      status: "success",
                      title: "La catégorie a été ajoutée !"
                    });
                  } catch (error) {
                    console.error(error);
                    toast({
                      status: "error",
                      title: defaultErrorMessage
                    });
                  }
                }}
                isClearable
                placeholder="Rechercher ou ajouter une catégorie"
                noOptionsMessage={() => "Aucun résultat"}
                className="react-select-container"
                classNamePrefix="react-select"
                styles={{
                  control: (defaultStyles: any) => {
                    return {
                      ...defaultStyles,
                      borderColor: "#e2e8f0"
                    };
                  },
                  placeholder: () => {
                    return {
                      color: "#A0AEC0"
                    };
                  }
                }}
              />
            );
          }}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="galleryCategory" />
        </FormErrorMessage>
      </FormControl>

      {/* {org && !isEntityPrivate && (
        <FormControl mb={3}>
          <FormLabel>Visibilité (optionnel)</FormLabel>
          <Controller
            name="galleryVisibility"
            control={control}
            defaultValue={
              props.gallery?.galleryVisibility.map((listName) => ({
                label: listName,
                value: listName
              })) || []
            }
            render={(renderProps) => {
              return (
                <MultiSelect
                  value={renderProps.value}
                  onChange={renderProps.onChange}
                  options={
                    org.orgLists.map(({ listName }) => ({
                      label: listName,
                      value: listName
                    })) || []
                  }
                  allOptionLabel="Toutes les listes"
                  //closeMenuOnSelect={false}
                  placeholder="Sélectionner une ou plusieurs listes"
                  noOptionsMessage={() => "Aucun résultat"}
                  isClearable
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (defaultStyles: any) => {
                      return {
                        ...defaultStyles,
                        borderColor: "#e2e8f0"
                      };
                    },
                    placeholder: () => {
                      return {
                        color: "#A0AEC0"
                      };
                    }
                  }}
                />
              );
            }}
          />
        </FormControl>
      )} */}

      {/*hasItems(galleryVisibility) && (
        <Alert status="warning" mb={3}>
          <AlertIcon />
          La galerie ne sera visible que par les membres des listes
          sélectionnées.
        </Alert>
      )*/}

      <ErrorMessage
        errors={errors}
        name="formErrorMessage"
        render={({ message }) => (
          <Alert status="error" mb={3}>
            <AlertIcon />
            <ErrorMessageText>{message}</ErrorMessageText>
          </Alert>
        )}
      />

      <Flex justifyContent="space-between">
        {props.onCancel && (
          <Button colorScheme="red" onClick={props.onCancel}>
            Annuler
          </Button>
        )}

        <Button
          colorScheme="green"
          type="submit"
          isLoading={
            isLoading ||
            addGalleryMutation.isLoading ||
            editGalleryMutation.isLoading
          }
          isDisabled={Object.keys(errors).length > 0}
          data-cy="addGallery"
        >
          {props.gallery ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};
