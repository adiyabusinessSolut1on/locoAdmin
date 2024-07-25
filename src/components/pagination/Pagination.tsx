// Define the type for the props
interface PaginationProps<T> {
  currentPage: number;
  apiData: T[];
  itemsPerPage: number;
  handleClick: (pageNumber: number) => void;
}

const Pagination = <T,>({
  currentPage,
  apiData,
  itemsPerPage,
  handleClick,
}: PaginationProps<T>) => {
  const totalPages = Math.ceil(apiData?.length / itemsPerPage);
  return (
    <div className="flex items-center justify-center w-full mt-4">
      <div className="flex justify-start w-[90%]">
        <p className="text-sm font-medium ">
          <span>Total Item: </span> <span>0{apiData?.length}</span>
        </p>
      </div>
      <div className="flex justify-start w-full">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`mx-1 px-3 py-1  rounded  ${
              currentPage === index + 1
                ? "bg-blue-800 text-[#DEE1E2]"
                : "bg-gray-300"
            }`}
            onClick={() => handleClick(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
