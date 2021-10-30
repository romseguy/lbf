import {
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Avatar,
  Tooltip
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useForm } from "react-hook-form";
import { EmailControl, ErrorMessageText } from "features/common";
import { setSession } from "features/session/sessionSlice";
import {
  useAddUserMutation,
  useEditUserMutation
} from "features/users/usersApi";
import type { IUser } from "models/User";
import { useAppDispatch } from "store";
import { handleError } from "utils/form";
import { calculateScale, getBase64, getPicaInstance } from "utils/image";
import { normalize } from "utils/string";
import { PhoneControl } from "features/common/forms/PhoneControl";

export const UserForm = (props: {
  user: Partial<IUser>;
  onSubmit: (user: Partial<IUser>) => void;
}) => {
  const dispatch = useAppDispatch();

  const [addUser, addUserMutation] = useAddUserMutation();
  const [editUser, editUserMutation] = useEditUserMutation();

  const [isLoading, setIsLoading] = useState(false);

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
  const [upImg, setUpImg] = useState<string | File>();
  const [scale, setScale] = useState(1);
  const [elementLocked, setElementLocked] = useState<
    { el: HTMLElement; locked: boolean } | undefined
  >();
  const disableScroll = (target: HTMLElement) => {
    disableBodyScroll(target);
  };
  const enableScroll = (target: HTMLElement) => {
    enableBodyScroll(target);
  };

  const setEditorRef = useRef<AvatarEditor | null>(null);

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: IUser) => {
    console.log("submitted", form);

    setIsLoading(true);
    const payload = {
      ...form,
      userName:
        props.user.userName !== form.userName
          ? normalize(form.userName)
          : undefined
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
      if (props.user) {
        await editUser({
          payload,
          userName: props.user.userName || props.user._id
        }).unwrap();
        dispatch(setSession(null));
      }

      props.onSubmit && props.onSubmit(payload);
    } catch (error) {
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      <FormControl
        id="userName"
        isRequired
        isInvalid={!!errors["userName"]}
        mb={3}
      >
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
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="userName" />
        </FormErrorMessage>
      </FormControl>

      {/* <AddressControl
        name="userAddress"
        defaultValue={props.user?.userAddress || ""}
        errors={errors}
        control={control}
        mb={3}
      /> */}

      <EmailControl
        name="email"
        control={control}
        register={register}
        setValue={setValue}
        isRequired
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

      <FormControl id="userImage" isInvalid={!!errors["userImage"]} mb={3}>
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
          id="fileInput"
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

      {upImg && (
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
            image={upImg}
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
        id="password"
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
        id="passwordConfirm"
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
