import { ReactNode } from "react";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkedInIcon from "@material-ui/icons/LinkedIn";

const FooterIconList = () => (
  <div className="footer-icon-list flex flex-wrap justify-center pb-5">
    <div className="space-x-4">
      <a href="#" className="p-2 rounded-full hover:bg-blue-600">
        <FacebookIcon style={{ fontSize: 24 }} />
      </a>
      <a href="#" className="p-2 rounded-full hover:bg-red-600">
        <InstagramIcon style={{ fontSize: 24 }} />
      </a>
      <a href="#" className="p-2 rounded-full hover:bg-blue-500">
        <TwitterIcon style={{ fontSize: 24 }} />
      </a>
      <a href="#" className="p-2 rounded-full hover:bg-blue-500">
        <LinkedInIcon style={{ fontSize: 24 }} />
      </a>
    </div>
  </div>
);

export { FooterIconList };
