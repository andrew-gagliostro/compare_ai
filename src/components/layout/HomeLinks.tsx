import { Box } from "@mui/material";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function HomeLinks() {
  return (
    <Box
      className="lg:grid-cols-4 font-bold dark:invert text-gray-500 lg:gap-10"
      sx={{
        display: "flex",
        minHeight: "40vh",
        alignItems: "center",
        textJustify: "center",
        textAlign: "center",
        minHight: "60vh",
      }}
    >
      <Box
        className="group rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        sx={{ height: "auto" }}
      >
        <h2 className={`${inter.className} mb-3 text-2xl rotating-text`}>
          How Can We Help?
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </h2>
        <Box
          className={`${inter.className} m-0 text-md opacity-70 w-full`}
          sx={{ fontSize: "auto" }}
        >
          Provide some context around what you're looking to compare and why.
          Feel free to provide as much or as little detail as you'd like.
        </Box>
      </Box>

      <Box className="group rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700">
        <h2
          className={`${inter.className} mb-3 text-2xl rotating-text justifyCenter`}
        >
          Connect
        </h2>
        <Box
          className={`${inter.className} m-0 text-md opacity-70 w-full`}
          sx={{ fontSize: "auto" }}
        >
          Provide links to products, services, or anything else you'd like to
          compare.
        </Box>
      </Box>

      <Box className="group rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700">
        <h2 className={`${inter.className} mb-3 text-2xl rotating-text`}>
          Prioritize
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </h2>
        <Box
          className={`${inter.className} m-0 text-md opacity-70 w-full`}
          sx={{ fontSize: "auto" }}
        >
          Let us know what factors are of greatest (or least) importance to you.
        </Box>
      </Box>

      <Box className="group rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700">
        <h2 className={`${inter.className} mb-3 text-2xl rotating-text`}>
          Submit
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </h2>
        <Box
          className={`${inter.className} m-0 text-md opacity-70 w-full`}
          sx={{ fontSize: "auto" }}
        >
          Submit your problem statement and we'll generate comparison of the
          options you've provided.
        </Box>
      </Box>
    </Box>
  );
}
