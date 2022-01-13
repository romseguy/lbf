import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PasswordControl } from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "pages/_app";

export const OrgPageLogin = ({
  onSubmit,
  ...props
}: PageProps & { onSubmit: (orgPassword: string) => Promise<void> }) => {
  const { errors, handleSubmit, register } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Layout {...props}>
      <form
        onSubmit={handleSubmit(async (form: { orgPassword: string }) => {
          console.log("submitted", form);
          setIsLoading(true);

          await onSubmit(form.orgPassword);

          setIsLoading(false);
        })}
      >
        <PasswordControl
          name="orgPassword"
          errors={errors}
          register={register}
          mb={3}
        />

        <Button
          colorScheme="green"
          type="submit"
          isLoading={isLoading}
          isDisabled={Object.keys(errors).length > 0}
          data-cy="orgFormSubmit"
        >
          Valider
        </Button>
      </form>
    </Layout>
  );
};
