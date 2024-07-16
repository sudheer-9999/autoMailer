import React from "react";

interface LoaderProps {
  color?: string;
}

const Loader: React.FC<LoaderProps> = ({ color }) => {
  const c = color || "#FFFFFF";

  return (
    <div className="flex items-center justify-center">
      <div
        className={`inline-block h-6 w-6 py-2 px-2 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
        role="status"
        style={{ color: c }}
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loader;
