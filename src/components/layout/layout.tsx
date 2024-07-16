import React from "react";
import Navbar from "./navbar";

type LayoutProps = {
  // Define any props specific to the HOC if needed
};

const Layout = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const ComponentLayout: React.FC<P & LayoutProps> = (props) => (
    <div>
      <Navbar />
      <WrappedComponent {...props} />
    </div>
  );

  return ComponentLayout;
};

export default Layout;
