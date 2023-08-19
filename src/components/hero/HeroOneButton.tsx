import { ReactNode } from 'react';

type IHeroOneButtonProps = {
  title: ReactNode;
  description?: string;
  button?: ReactNode;
};

const HeroOneButton = (props: IHeroOneButtonProps) => {

  if (props.description) {
    return (
      <header className="text-center">
        <h1 className="text-5xl text-purple-900 font-bold whitespace-pre-line leading-hero">
          {props.title}
        </h1>
        <div className="text-2xl text-purple-700 mt-4 mb-16">{props.description}</div>

        {props.button}
      </header>
    );
  }
  else if (props.button) {
    return (
      <header className="text-center">
        <h1 className="text-5xl text-purple-900 font-bold whitespace-pre-line leading-hero pb-10">
          {props.title}
        </h1>
        {props.button}
      </header>
    );
  }
  else {
    return (
      <header className="text-center">
        <h1 className="text-5xl text-purple-900 font-bold whitespace-pre-line leading-hero pb-10">
          {props.title}
        </h1>
      </header>
    );
  }

}

export { HeroOneButton };
