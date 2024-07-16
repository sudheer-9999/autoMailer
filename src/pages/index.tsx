import { GetServerSideProps } from "next";
import { api } from "~/utils/api";

export default function Home() {
  const { mutateAsync } = api.auth.logout.useMutation({
    onSuccess: () => window.location.reload(),
  });
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <button onClick={() => mutateAsync()} className="text-white">
          logout
        </button>
      </main>
    </>
  );
}

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
