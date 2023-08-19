const Logo = () => {
  return (
    <div className="flex items-center justify-center opacity-60">
      <svg
        className="h-16 w-16 text-gray-900 stroke-current stroke-2"
        viewBox="0 0 24 24"
      >
        <path
          className="fill-none"
          d="M12 2c5.522 0 10 4.478 10 10s-4.478 10-10 10S2 17.522 2 12 6.478 2 12 2z"
        ></path>
        <path
          className="fill-gray-900"
          d="M12 6a4 4 0 0 1 0 8c-1.732 0-3.212-1.13-3.756-2.674l1.901-1.033A2 2 0 0 0 12 9a2 2 0 0 0 1.855-1.267l1.902 1.033C15.212 9.87 14.732 11 13 11a4 4 0 0 1-4-4z"
        ></path>
      </svg>
      <div className="font-extrabold text-lg text-gray-900 py-2">Compared</div>
    </div>
  );
};

export { Logo };
