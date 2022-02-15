import { ContactForm } from "features/forms/ContactForm";
import { Layout } from "features/layout";
import { PageProps } from "./_app";

const ContactPage = (props: PageProps) => {
  return (
    <Layout {...props}>
      <ContactForm />
    </Layout>
  );
};

export default ContactPage;
