import Link from "next/link";

import { Logo } from "../hero/Logo";
import { FooterCopyright } from "../footer/FooterCopyright";
import { FooterIconList } from "../footer/FooterIconList";

const Footer = () => (
  <div className="text-center flex flex-col w-full hwq-max-fit bg-gray-200 pt-3 pb-5 dark:invert">
    <div className="max-h-fit">
      <Logo />
    </div>
    <nav>
      <ul className="navbar flex flex-row w-full px-15 pb-5 justify-around font-medium text-xl text-gray-800">
        <li>
          <Link href="/">
            <div>Home</div>
          </Link>
        </li>
        <li>
          <Link href="/">
            <div>About</div>
          </Link>
        </li>
        <li>
          <Link href="/">
            <div>Docs</div>
          </Link>
        </li>
        <li>
          <Link href="/sisu">
            <div>Sign In/Sign Up</div>
          </Link>
        </li>
      </ul>
    </nav>
    <FooterIconList></FooterIconList>
    <div className="text-sm">
      <FooterCopyright />
    </div>
  </div>
);

export { Footer };
