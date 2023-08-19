import Link from "next/link";

import { HeroOneButton } from "./HeroOneButton";
import { NavbarTwoColumns } from "../navigation/NavbarTwoColumns";
import { Logo } from "./Logo";
import { Button } from "../button/Button";
import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";

import { DropDown } from "./DropDown";
import { useRouter } from "next/router";
import { NavBar } from "../navigation/NavBar";

function Hero() {
  const router = useRouter();

  const [user, setUser] = useState(undefined);

  async function getUser() {
    try {
      const tempUser = await Auth.currentAuthenticatedUser();
      setUser(tempUser);
    } catch (e) {
      console.log("No user signed in");
    }
  }

  useEffect(() => {
    getUser();
  });

  return (
    <>
      <NavBar />
      {user ? (
        <div className="text-center hero lg:mt-1 dark:invert flex flex-col items-center justify-around box-border">
          <div className="text-6xl font-bold text-gray-500 mb-5">
            Compared
            <div className="text-4xl subpixel-antialiased font-bold pb-5 mt-5 pt-4 min-h-fit ">
              Helping You Make Decisions. Focusing On The Metrics that Matter.
            </div>
          </div>

          <h2 className="flex flex-col gap-2 text-2xl font-bold rotating-text pb-5">
            <div>Eliminate The Noise. </div>
            <div>Make The Right Choice.</div>
          </h2>
        </div>
      ) : (
        <div className="text-center hero lg:mt-1 flex flex-col items-center dark:invert justify-around box-border px-3 pb-10">
          <div className="text-6xl font-bold text-gray-500 mb-5">
            Compared
            <div className="text-4xl subpixel-antialiased font-bold pb-5 mt-5 pt-4 min-h-fit ">
              Helping You Make Decisions. Focusing On The Metrics that Matter.
            </div>
          </div>

          <h2 className="flex flex-col gap-2 text-2xl font-bold rotating-text pb-5">
            <div>Eliminate The Noise. </div>
            <div>Make The Right Choice.</div>
          </h2>
          <a
            onClick={() => {
              router.push("/compare");
            }}
            className="font-bold alignSelf-left text-xl hover:text-gray-700 dark:hover:text-gray-300 text-gray-100"
          >
            <Button xl={true}>Start Comparing Now</Button>
          </a>
        </div>
      )}
    </>
  );
}

export { Hero };

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { Auth } from "aws-amplify";
// import { useRouter } from "next/router";
// import { Typography, Box } from "@mui/material";
// import { NavBar } from "../navigation/NavBar";
// import { Button } from "../button/Button";

// function Hero() {
//   const router = useRouter();
//   const [user, setUser] = useState(undefined);

//   async function getUser() {
//     try {
//       const tempUser = await Auth.currentAuthenticatedUser();
//       setUser(tempUser);
//     } catch (e) {
//       console.log("No user signed in");
//     }
//   }

//   useEffect(() => {
//     getUser();
//   }, []);

//   return (
//     <>
//       <NavBar />
//       {user ? (
//         <Box
//           sx={{
//             textAlign: "center",
//             marginTop: "1rem",
//             invert: "dark",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "space-around",
//             boxSizing: "border-box",
//           }}
//         >
//           <Typography variant="h3" component="div" color="gray.500" mb={10}>
//             Compared
//             <Typography
//               variant="h2"
//               component="div"
//               color="gray.500"
//               sx={{
//                 fontWeight: "bold",
//                 animation: "rotating-text 8s infinite",
//                 paddingBottom: "10px",
//                 paddingTop: "4px",
//                 minHeight: "fit-content",
//               }}
//             >
//               Create. Connect. Style. Share.
//             </Typography>
//           </Typography>

//           <Typography variant="h6" component="h2" fontWeight="bold" pb={5}>
//             <div>Share your interests, ideas, opinions, and passions</div>
//             <div>
//               Learn from a vibrant community of consumers, creators, artists,
//               and professionals
//             </div>
//           </Typography>
//         </Box>
//       ) : (
//         <Box
//           sx={{
//             textAlign: "center",
//             marginTop: "1rem",
//             invert: "dark",
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             justifyContent: "space-around",
//             boxSizing: "border-box",
//             px: 3,
//             paddingBottom: "10px",
//           }}
//         >
//           <Typography variant="h3" component="div" color="gray.500" mb={10}>
//             Compared
//             <Typography
//               variant="h2"
//               component="div"
//               color="gray.500"
//               sx={{
//                 fontWeight: "bold",
//                 animation: "rotating-text 8s infinite",
//                 paddingBottom: "10px",
//                 paddingTop: "4px",
//                 minHeight: "fit-content",
//               }}
//             >
//               create. connect. style. share.
//             </Typography>
//           </Typography>

//           <Typography variant="h6" component="h2" fontWeight="bold" pb={5}>
//             <div>Share your interests, ideas, opinions, and passions</div>
//             <div className="mt-5">
//               Learn from a vibrant community of consumers, creators, artists,
//               and professionals
//             </div>
//           </Typography>

//           <a
//             onClick={() => {
//               router.push("/sisu");
//             }}
//           >
//             <Button>Create An Account Now</Button>
//           </a>
//         </Box>
//       )}
//     </>
//   );
// }

// export { Hero };
