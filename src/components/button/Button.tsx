/* eslint-disable react/no-unknown-property */
import className from "classnames";

type IButtonProps = {
  xl?: boolean;
  children: string;
};

const Button = (props: IButtonProps) => {
  return (
    <div className="px-2 py-2 mx-2 my-5 text-gray-100 opacity-60 bg-gray-600 hover:bg-gray-800 rounded-lg border border-transparent">
      {props.children}
    </div>
  );
};

export { Button };
