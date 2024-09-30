import { Column } from "features/common";
import { ContactForm } from "features/forms/ContactForm";
import { Layout } from "features/layout";
import { PageProps } from "main";

const ContactPage = (props: PageProps) => {
  return (
    <Layout {...props} noHeader pageTitle="Contact">
      <Column mx={3}>
        <ContactForm />
      </Column>
    </Layout>
  );
};

export default ContactPage;
