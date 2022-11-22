import { Ring } from "@uiball/loaders";
import React, { SVGProps } from "react";

type Props = {
  className: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
  onClick: () => void;
  loading?: boolean;
  loadingColor?: string;
};

function PostMenuButton({
  className,
  Icon,
  onClick,
  loading = false,
  loadingColor,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between cursor-pointer p-4  rounded-full transition-all duration-150  ${className} `}
    >
      {loading ? (
        <div>
          <Ring size={20} lineWeight={5} speed={2} color={loadingColor} />
        </div>
      ) : (
        <Icon className="h-5 w-5" />
      )}
    </div>
  );
}

export default PostMenuButton;
