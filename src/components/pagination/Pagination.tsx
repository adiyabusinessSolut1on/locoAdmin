import { IoChevronBack, IoChevronForward } from "react-icons/io5";

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

  const firstPage = currentPage === 1 ? 1 : currentPage - 1;
  const secondPage = currentPage === 1 ? 2 : currentPage;
  const thirdPage = currentPage === 1 ? 3 : currentPage + 1;

  return (
    <div className="flex items-center justify-center w-full mt-4">
      <div className="flex justify-start w-[90%]">
        <p className="text-sm font-medium ">
          <span>Total Item: </span>
          <span>
            {apiData?.length > 9 ? apiData?.length : `0${apiData?.length}`}
          </span>
        </p>
      </div>
      <div className="flex justify-start w-full">
        {currentPage > 2 && (
          <button
            className="px-2 py-1 mx-1 text-white bg-blue-600 rounded shadow-lg hover:bg-blue-600"
            onClick={() => handleClick(currentPage - 1)}
          >
            <IoChevronBack />
          </button>
        )}

        {totalPages >= 1 && (
          <>
            <button
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === firstPage
                  ? "bg-blue-800 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => handleClick(firstPage)}
            >
              {firstPage}
            </button>
            {totalPages >= 2 && (
              <button
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === secondPage
                    ? "bg-blue-800 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => handleClick(secondPage)}
              >
                {secondPage}
              </button>
            )}
            {totalPages >= 3 && thirdPage <= totalPages && (
              <button
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === thirdPage
                    ? "bg-blue-800 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => handleClick(thirdPage)}
              >
                {thirdPage}
              </button>
            )}
          </>
        )}
        {currentPage < totalPages - 1 && (
          <button
            className="px-2 py-1 mx-1 text-white bg-blue-600 rounded shadow-lg hover:bg-blue-600"
            onClick={() => handleClick(currentPage + 1)}
          >
            <IoChevronForward className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
