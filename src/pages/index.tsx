import { GetServerSideProps } from "next";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";
import Layout from "~/components/layout/layout";
import Loader from "~/components/login/common/Loader";
import { api } from "~/utils/api";

const Home = () => {
  const [formData, setFormData] = useState({
    hrMail: "",
    role: "",
  });

  const { mutateAsync, isPending } = api.mail.autoApply.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setFormData({ hrMail: "", role: "" }); // Clear inputs after successful submission
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send mail");
    },
  });

  const { mutateAsync: runScript, isPending: isScriptRunning } =
    api.script.run.useMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendMail = async () => {
    await mutateAsync();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <button
          onClick={async () => await runScript()}
          type="button" // Ensure type is "button" for non-form buttons
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isScriptRunning ? <Loader /> : "RUN Script"}
        </button>
      </div>
      {/* <div className="mb-4">
        <label
          htmlFor="hrMail"
          className="block text-sm font-medium leading-6 text-black"
        >
          HR Mail
        </label>
        <input
          id="hrMail"
          name="hrMail"
          type="email"
          value={formData.hrMail}
          onChange={handleChange}
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="role"
          className="block text-sm font-medium leading-6 text-black"
        >
          Role
        </label>
        <input
          id="role"
          name="role"
          type="text"
          value={formData.role}
          onChange={handleChange}
          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div> */}
      <div className="mt-2">
        <button
          onClick={sendMail}
          type="button" // Ensure type is "button" for non-form buttons
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {isPending ? <Loader /> : "Send Application"}
        </button>
      </div>
    </main>
  );
};

export default Layout(Home);

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
