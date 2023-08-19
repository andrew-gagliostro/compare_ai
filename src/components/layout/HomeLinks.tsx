import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function HomeLinks() {
  return (
    <div className="flex grid text-center my-10 px-20 gap-10 lg:grid-cols-4 font-bold dark:invert">
      <a
        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
        className="justifyCenter group rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`${inter.className} mb-3 text-2xl rotating-text`}>
          Create
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </h2>
        <p className={`${inter.className} m-0 text-md opacity-70 w-full`}>
          Choose from a selectiion of templates and start adding content to your
          profile
        </p>
      </a>

      <a
        href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
        className="group rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2
          className={`${inter.className} mb-3 text-2xl rotating-text justifyCenter`}
        >
          Connect
        </h2>
        <p className={`${inter.className} m-0 text-md opacity-70 justify`}>
          Connect with like-minded people who share your passions and interests,
          and discover new ones
        </p>
      </a>

      <a
        href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
        className="group rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`${inter.className} mb-3 text-2xl rotating-text`}>
          Style
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </h2>
        <p className={`${inter.className} m-0 text-md opacity-70`}>
          Customize your profile to highlight the collections important to you
        </p>
      </a>

      <a
        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
        className="group rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`${inter.className} mb-3 text-2xl rotating-text`}>
          Share
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </h2>
        <p className={`${inter.className} m-0 text-md opacity-70`}>
          Generate links to share your entire profile or specific collections
        </p>
      </a>
      <a className="flex flex-col w-full">
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
      </a>
    </div>
  );
}
