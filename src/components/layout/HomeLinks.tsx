/* eslint-disable react/no-unescaped-entities */
import { Box, Typography } from "@mui/material";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function HomeLinks() {
  return (
    <Box className="flex grid text-center text-gray-500 my-10 px-20 gap-10 lg:grid-cols-4 font-bold ">
      <Box
        className="justifyCenter group rounded-lg border border-transparent pb-3 px-5 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        rel="noopener noreferrer"
      >
        <Typography
          variant="h2"
          color="secondary"
          className={`${inter.className} mb-3 text-2xl`}
        >
          Contextualize
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </Typography>
        <Typography
          variant="body1"
          className={`${inter.className} m-0 text-md opacity-70 w-full`}
        >
          Add a prompt, providing some context around the content you're
          submitting and why. Feel free to provide as much or as little detail
          as you'd like.
        </Typography>
      </Box>

      <Box
        className="justifyCenter group rounded-lg border border-transparent pb-3 px-5 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        rel="noopener noreferrer"
      >
        <Typography
          variant="h2"
          color="secondary"
          className={`${inter.className} mb-3 text-2xl`}
        >
          Prioritize
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </Typography>
        <Typography
          variant="body1"
          className={`${inter.className} m-0 text-md opacity-70 w-full`}
        >
          In your prompt, provide the assistant with a problem statement -
          explain what insights or knowledge you hope to gain from the content
          you submit.
        </Typography>
      </Box>

      <Box
        className="justifyCenter group rounded-lg border border-transparent pb-3 px-5 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        rel="noopener noreferrer"
      >
        <Typography
          variant="h2"
          color="secondary"
          className={`${inter.className} mb-3 text-2xl`}
        >
          Connect
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </Typography>
        <Typography
          variant="body1"
          className={`${inter.className} m-0 text-md opacity-70 w-full`}
        >
          Add links or upload files for our AI Assistant to Analyze.
        </Typography>
      </Box>

      <Box
        className="justifyCenter group rounded-lg border border-transparent pb-3 px-5 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        rel="noopener noreferrer"
      >
        <Typography
          variant="h2"
          color="secondary"
          className={`${inter.className} mb-3 text-2xl`}
        >
          Submit
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </Typography>
        <Typography
          variant="body1"
          className={`${inter.className} m-0 text-md opacity-70 w-full`}
        >
          Submit your problem statement and we'll generate an analysis of the
          content you've provided.
        </Typography>
      </Box>
      {/* <Box className="flex flex-col w-full">
        <h2 className="text-2xl font-semibold pb-5">
          <div>Speech Pathologists</div>
          <div>Sharing deliverables they used and had success with</div>
        </h2>
        <h2 className="text-2xl font-semibold pb-5">
          <div>Cross-Country Skier</div>
          <div>Showing the gear they use and routes they enjoy</div>
        </h2>
        <h2 className="text-2xl font-semibold pb-5">
          <div>Videographer</div>
          <div>Listing affordable gear to get started in filming</div>
        </h2>
        <h2 className="text-2xl font-semibold pb-5">
          <div>Financier</div>
          <div>Top tips and tricks for getting started in real estate</div>
        </h2>
      </Box> */}
    </Box>
  );
}
