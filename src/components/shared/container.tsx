import { FC, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export const Container: FC<ContainerProps> = ({ children }) => {
  return (
    <div className="mx-auto lg:max-w-4xl lg:px-10 xl:max-w-7xl xl:px-20 2xl:max-w-full">
      {children}
    </div>
  );
};
