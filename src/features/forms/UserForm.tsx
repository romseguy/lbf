import {
  Alert,
  AlertIcon,
  Avatar,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Tooltip
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useForm } from "react-hook-form";
import { EmailControl, ErrorMessageText, HostTag } from "features/common";
import { PhoneControl } from "features/common/forms/PhoneControl";
import { useEditUserMutation } from "features/api/usersApi";
import type { IUser } from "models/User";
import { useAppDispatch } from "store";
import { refetchOrg } from "store/orgSlice";
import { Session } from "utils/auth";
import { handleError } from "utils/form";
import {
  Base64Image,
  calculateScale,
  getBase64,
  getPicaInstance
} from "utils/image";
import { normalize } from "utils/string";

export const UserForm = (props: {
  user: IUser;
  session: Session;
  onSubmit: (user: Partial<IUser>) => void;
}) => {
  console.log(props);

  const dispatch = useAppDispatch();
  const [editUser] = useEditUserMutation();

  //#region local state
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
    setValue
  } = useForm({
    mode: "onChange"
  });

  const setEditorRef = useRef<AvatarEditor | null>(null);
  const [scale, setScale] = useState(1);
  const [upImg, setUpImg] = useState<Base64Image | undefined>();

  //#region locking behavior
  const [elementLocked, setElementLocked] = useState<
    { el: HTMLElement; locked: boolean } | undefined
  >();
  const disableScroll = (target: HTMLElement) => {
    disableBodyScroll(target);
  };
  const enableScroll = (target: HTMLElement) => {
    enableBodyScroll(target);
  };
  //#endregion

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: IUser) => {
    console.log("submitted", form);
    setIsLoading(true);

    const payload: {
      userName?: string;
      email?: string;
      phone?: string;
      userImage?: Base64Image;
    } = {
      userName:
        props.user.userName !== form.userName
          ? normalize(form.userName)
          : undefined,
      email: props.user.email !== form.email ? form.email : undefined,
      phone: props.user.phone !== form.phone ? form.phone : undefined
    };

    if (setEditorRef.current) {
      const canvas = setEditorRef.current.getImage();

      const offScreenCanvas = document.createElement("canvas");
      offScreenCanvas.width = 40;
      offScreenCanvas.height = 40;

      const picaCanvas = await getPicaInstance().resize(
        canvas,
        offScreenCanvas,
        {
          alpha: true
        }
      );

      payload.userImage = {
        width: 40,
        height: 40,
        base64: picaCanvas.toDataURL("image/png", 1.0)
      };
    }

    try {
      await editUser({
        slug: props.user.email,
        payload
      }).unwrap();
      dispatch(refetchOrg());
      setIsLoading(false);
      props.onSubmit && props.onSubmit(payload);
    } catch (error) {
      setIsLoading(false);
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
    }
  };
  //#endregion

  return (
    <form
      onChange={onChange}
      onSubmit={handleSubmit(onSubmit)}
      onWheel={(e) => {
        if (elementLocked) enableScroll(elementLocked.el);
      }}
    >
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

      <FormControl isRequired isInvalid={!!errors["userName"]} mb={3}>
        <FormLabel>Nom d'utilisateur</FormLabel>
        <Input
          name="userName"
          placeholder="Nom d'utilisateur"
          ref={register({
            required: "Veuillez saisir le nom de l'utilisateur"
            // pattern: {
            //   value: /^[a-z0-9 ]+$/i,
            //   message:
            //     "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
            // }
          })}
          defaultValue={props.user.userName}
          data-cy="username-input"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="userName" />
        </FormErrorMessage>
      </FormControl>

      <Alert status="info" mb={3}>
        <AlertIcon />
        <Box>
          Votre adresse e-mail et votre numéro de téléphone seront visibles aux
          administrateurs de <HostTag /> et des planètes/arbres où vous êtes
          adhérent et/ou abonné.
        </Box>
      </Alert>

      <EmailControl
        name="email"
        control={control}
        register={register}
        setValue={setValue}
        isDisabled
        defaultValue={props.user.email}
        errors={errors}
        isMultiple={false}
        mb={3}
      />

      <PhoneControl
        name="phone"
        register={register}
        setValue={setValue}
        control={control}
        errors={errors}
        isMultiple={false}
        defaultValue={props.user.phone}
        mb={3}
      />

      <FormControl isInvalid={!!errors["userImage"]} mb={3}>
        <FormLabel>Avatar</FormLabel>
        <Tooltip
          hasArrow
          label={
            props.user.userImage ? "Changer l'avatar" : "Définir un avatar"
          }
          placement="right"
        >
          <Avatar
            boxSize={10}
            name={props.user.userImage ? undefined : props.user.userName}
            src={props.user.userImage?.base64}
            mb={3}
            cursor="pointer"
            onClick={() => {
              document?.getElementById("fileInput")?.click();
            }}
          />
        </Tooltip>

        <Input
          name="userImage"
          display="none"
          type="file"
          accept="image/*"
          onChange={async ({ target: { files } }) => {
            if (files) {
              const file = files[0];

              if (file.size < 1000000) {
                setUpImg(await getBase64(file));
                clearErrors("userImage");
              }
            }
          }}
          ref={register({
            validate: (file) => {
              if (file && file[0] && file[0].size >= 1000000) {
                return "L'image ne doit pas dépasser 1Mo.";
              }
              return true;
            }
          })}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="userImage" />
        </FormErrorMessage>
      </FormControl>

      {upImg && upImg.base64 && (
        <Box
          width="200px"
          onWheel={(e) => {
            e.stopPropagation();
            setScale(calculateScale(scale, e.deltaY));

            const el = e.target as HTMLElement;
            disableScroll(el);
            if (!elementLocked) setElementLocked({ el, locked: true });
          }}
        >
          <AvatarEditor
            ref={setEditorRef}
            image={upImg.base64}
            border={0}
            borderRadius={100}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={scale}
            rotate={0}
            style={{ marginBottom: "12px" }}
          />
        </Box>
      )}

      {/* <FormControl
        mb={3}
        isRequired
        isInvalid={!!errors["password"]}
      >
        <FormLabel>Mot de passe</FormLabel>
        <Input
          name="password"
          ref={register({
            required: "Veuillez saisir un mot de passe"
          })}
          type="password"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="password" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        isRequired
        isInvalid={!!errors["passwordConfirm"]}
      >
        <FormLabel>Confirmation du mot de passe</FormLabel>
        <Input
          name="passwordConfirm"
          ref={register({
            validate: (value) =>
              value === password.current ||
              "Les mots de passe ne correspondent pas"
          })}
          type="password"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="passwordConfirm" />
        </FormErrorMessage>
      </FormControl> */}

      <Button
        colorScheme="green"
        type="submit"
        isLoading={isLoading}
        isDisabled={Object.keys(errors).length > 0}
        mb={2}
      >
        Modifier
      </Button>
    </form>
  );
};
