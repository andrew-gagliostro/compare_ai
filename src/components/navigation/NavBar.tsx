import { Logo } from "../hero/Logo";
import { DropDown } from "../hero/DropDown";
import { NavbarTwoColumns } from "./NavbarTwoColumns";

export function NavBar() {
  return (
    <div className="z-10 flex flex-full w-full min-h-fit max-h-fit px-10 pb-10 pt-10 content-center">
      <NavbarTwoColumns logo={<Logo />}>
        <div className="pr-auto">
          <DropDown />
        </div>
      </NavbarTwoColumns>
    </div>
  );
}
