import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { Toaster } from "react-hot-toast";
import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div>
      <Toaster />
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
