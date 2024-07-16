import { GetServerSideProps } from "next";
import Layout from "~/components/layout/layout";

const Edit = () => {
  return <div>Edit</div>;
};

export default Layout(Edit);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.accessToken) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
