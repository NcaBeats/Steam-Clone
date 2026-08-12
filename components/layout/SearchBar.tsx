export const SearchBar = () => {
  return (
    <search className="flex-1 max-w-64 ">
      <input
        type="search"
        placeholder="Search"
        aria-label="Search"
        className="w-full bg-[#1A1A1A] rounded-md outline-none px-2.5 h-8 hover:bg-[#272727] transition-colors duration-150 ease-out"
      />
    </search>
  );
};
