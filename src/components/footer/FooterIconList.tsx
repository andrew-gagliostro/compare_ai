import { ReactNode } from "react";
import { Facebook, Instagram, Twitter, LinkedIn  } from "@mui/icons-material";

const FooterIconList = () => (
  <div className="footer-icon-list flex flex-wrap justify-center pb-5">
    <div className="space-x-4">
      <a href="#" className="p-2 rounded-full hover:bg-blue-600">
        <Facebook style={{ fontSize: 24 }} />
      </a>
      <a href="#" className="p-2 rounded-full hover:bg-red-600">
        <Instagram style={{ fontSize: 24 }} />
      </a>
      <a href="#" className="p-2 rounded-full hover:bg-blue-500">
        <Twitter style={{ fontSize: 24 }} />
      </a>
      <a href="#" className="p-2 rounded-full hover:bg-blue-500">
        <LinkedIn style={{ fontSize: 24 }} />
      </a>
    </div>
  </div>
);

export { FooterIconList };
