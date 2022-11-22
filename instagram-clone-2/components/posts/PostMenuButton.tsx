import React, { SVGProps } from "react";

type Props = {
  className: string;
  onClick: () => void;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

function PostMenuButton({ className, Icon, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-full transition-all duration-150 cursor-pointer ${className}`}
    >
      <Icon className="w-5 h-5 " />
    </div>
  );
}

export default PostMenuButton;
