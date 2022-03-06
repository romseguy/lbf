import { ContactForm } from "features/forms/ContactForm";
import { Layout } from "features/layout";
import { PageProps } from "./_app";

const ContactPage = (props: PageProps) => {
  return (
    <Layout {...props} pageTitle="Contact">
      <ContactForm />
    </Layout>
  );
};

export default ContactPage;
