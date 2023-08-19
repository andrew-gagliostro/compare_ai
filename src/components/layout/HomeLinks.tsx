import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function HomeLinks() {
  return (
    <div className="flex grid text-center mb-10 mt-5 px-20 gap-10 lg:grid-cols-4 font-bold dark:invert">
      <a
        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
        className="justifyCenter group rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`${inter.className} mb-3 text-2xl rotating-text`}>
          How Can We Help?
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </h2>
        <p className={`${inter.className} m-0 text-md opacity-70 w-full`}>
          Provide some context around what you're looking to compare and why.
          Feel free to provide as much or as little detail as you'd like.
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
          Provide links to products, services, or anything else you'd like to
          compare.
        </p>
      </a>

      <a
        href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
        className="group rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`${inter.className} mb-3 text-2xl rotating-text`}>
          Prioritize
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </h2>
        <p className={`${inter.className} m-0 text-md opacity-70`}>
          Let us know what factors are of greatest (or least) importance to you.
        </p>
      </a>

      <a
        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
        className="group rounded-lg border border-transparent px-5 py-4 hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700"
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={`${inter.className} mb-3 text-2xl rotating-text`}>
          Submit
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none"></span>
        </h2>
        <p className={`${inter.className} m-0 text-md opacity-70`}>
          Submit your problem statement and we'll generate comparison of the
          options you've provided.
        </p>
      </a>
    </div>
  );
}
