import { GetServerSideProps } from "next";
import { useState } from "react";
import Signin from "~/components/login/signin";
import Signup from "~/components/login/signup";

const Login = () => {
  const [login, setlogin] = useState(true);
  return (
    <>
      {login ? <Signin setlogin={setlogin} /> : <Signup setlogin={setlogin} />}
    </>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (req.cookies.accessToken) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
