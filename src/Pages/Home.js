import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchContext } from "../context/SearchContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { useProductContext } from "../context/ProductContext";
import { useSearchParams } from "react-router-dom";
import Filter from "../components/Filter";
export default function Home() {
  const { searchStatus } = useSearchContext();
  const { setProducts, products, dispatch, state } = useProductContext();
  const [showNoResults, setShowNoResults] = useState(false);
  const [isCardView, setIsCardView] = useState(false);

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [hasMore, setHasMore] = useState(true);
  const [listName, setListName] = useState("Latest Updated");
  const [dropdown, setDropdown] = useState(false);
  const filterSections = ["Sectors", "Formats", "Tags", "Geographies"];
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("query") || "";
    console.log("Search Query:", query);
    setSearchQuery(query);

    const filterGroupMap = {
      sectors: "Sectors",
      tags: "Tags",
      formats: "Formats",
      geographies: "Geographies",
      geography: "Geographies",
    };

    for (const [paramKey, paramValue] of searchParams.entries()) {
      const normalizedKey = filterGroupMap[paramKey.toLowerCase()];
      if (normalizedKey) {
        const values = searchParams.getAll(paramKey).length
          ? searchParams.getAll(paramKey)
          : (paramValue || "").split(",");
        dispatch({
          type: "SET_SELECTED_FILTERS",
          payload: {
            filterGroup: normalizedKey,
            values,
          },
        });
      }
    }
  }, [dispatch, searchParams]);

  const searchedProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    async function fetchAPI() {
      try {
        const res = await fetch(
          `https://api.datakeep.civicdays.in/api/search/dataset/?page=${page}`
        );
        const data = await res.json();
        if (res.ok) {
          setProducts(data.results, page !== 1);
          setHasMore(data.results.length === 10);
        } else {
          console.error("Failed to fetch data");
          toast.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error fetching data");
      }
    }
    fetchAPI();
  }, [page, setProducts]);
  useEffect(() => {
    if (searchQuery && searchedProducts.length === 0) {
      const timeoutId = setTimeout(() => {
        setShowNoResults(true);
      }, 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setShowNoResults(false);
    }
  }, [searchQuery, searchedProducts]);

  const fetchMoreData = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <main>
      {searchStatus ? (
        <section className="flex flex-col md:flex-row h-auto md:h-2/5 border-b-2 p-4 justify-between m-2">
          <input
            placeholder="Start typing to Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-2 rounded p-2 m-1 w-full md:w-2/3 mb-4 md:mb-0 focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={() => setIsCardView(!isCardView)}
            className="flex items-center gap-2 my-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-2 rounded-full shadow hover:scale-105 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 ease-in-out"
          >
            <i
              className={`bi ${
                isCardView ? "bi-list-ul" : "bi-grid-3x3-gap-fill"
              }`}
            ></i>
            {isCardView ? "List View" : "Card View"}
          </button>

          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setDropdown(!dropdown)}
              className="w-full md:w-auto border-2 sm:m-2 p-3 rounded-full hover:bg-gray-800 hover:text-white"
            >
              {listName}{" "}
              {dropdown ? (
                <i class="bi bi-caret-up"></i>
              ) : (
                <i class="bi bi-caret-down"></i>
              )}
            </button>
            <div className="absolute flex-wrap top-12 left-18 w-40 rounded p-2">
              {dropdown ? (
                <ul className="text-white shadow-lg rounded flex flex-col bg-gray-700 w-full items-center justify-center">
                  <li
                    onClick={() => {
                      setListName("Downloads");
                      setDropdown(false);
                      dispatch({
                        type: "setDownloads",
                        payload: { downloads: !state.downloads },
                      });
                    }}
                    className="border-b-2 p-2 hover:cursor-pointer rounded hover:bg-gray-900 w-full"
                  >
                    Downloads
                  </li>
                  <li
                    onClick={() => {
                      setListName("Formats");
                      setDropdown(false);
                      dispatch({
                        type: "setFormats",
                        payload: { formats: !state.formats },
                      });
                    }}
                    className=" p-2 border-b-2 hover:cursor-pointer rounded hover:bg-gray-900 w-full"
                  >
                    Formats
                  </li>
                  <li
                    onClick={() => {
                      setListName("Latest Updated");
                      setDropdown(false);
                      dispatch({
                        type: "setLatestUpdated",
                        payload: { latestUpdated: !state.latestUpdated },
                      });
                    }}
                    className="border-b-2 p-2 hover:cursor-pointer rounded hover:bg-gray-900 w-full"
                  >
                    Latest Updated
                  </li>
                </ul>
              ) : (
                ""
              )}
            </div>
          </div>
        </section>
      ) : (
        ""
      )}
      <section className="flex flex-col lg:flex-row m-2">
        <div className="w-full lg:w-1/5 sm:h-46 flex-wrap min-h-screen border-2 shadow-xl rounded m-1 mb-4 lg:mr-3">
          <div className="flex justify-between items-center p-2 mb-4">
            <p className="font-semibold text-blue-900 ml-3">FILTERS</p>
            <p
              onClick={() => dispatch({ type: "RESET" })}
              className="text-yellow-400 text-sm font-semibold mr-3 hover:cursor-pointer"
            >
              RESET
            </p>
          </div>
          {filterSections.map((filter, index) => (
            <Filter key={index} filter={filter} />
          ))}
        </div>
        <div
          className={`w-full lg:w-4/5 min-h-screen rounded mt-1 shadow-xl ${
            isCardView ? "flex flex-wrap gap-4 justify-start" : ""
          }`}
        >
          <InfiniteScroll
            dataLength={searchedProducts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={
              <h4 className="text-center font-bold text-xl my-4">Loading...</h4>
            }
            endMessage={
              <p className="text-center my-4 text-gray-400">
                <b>
                  {!showNoResults && searchedProducts.length !== 0 && (
                    <>You have reached to the end of the Page!!</>
                  )}
                </b>
              </p>
            }
          >
            {showNoResults && searchedProducts.length === 0 ? (
              <div className="text-center my-6 text-gray-600 font-semibold text-lg">
                Sorry! No results found for your search.
              </div>
            ) : (
              <div
                className={`${
                  isCardView
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                    : "flex flex-col"
                }`}
              >
                {searchedProducts.map((product, index) => (
                  <div
                    key={index}
                    className={`p-6 mb-4 bg-white border-2 shadow-lg border-gray-200 rounded ${
                      isCardView ? "" : "w-full"
                    }`}
                  >
                    <h2 className="text-lg font-semibold text-blue-800">
                      {product.title}
                    </h2>
                    <p className="text-gray-600">{product.description}</p>
                    <div className="flex flex-wrap gap-4 items-center mt-2 text-sm text-gray-500">
                      <p className="flex items-center gap-1">
                        <i className="bi bi-calendar4 text-orange-900 font-bold text-lg"></i>
                        <span>Last Updated:</span>{" "}
                        {new Date(product.modified).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <p className="flex items-center gap-1">
                        <i className="bi bi-download text-orange-900 font-bold text-lg"></i>
                        <span>Downloads:</span>{" "}
                        <span className="text-black">
                          {product.download_count}+
                        </span>
                      </p>
                      <p className="flex items-center gap-1">
                        <i className="bi bi-globe text-orange-900 font-bold text-lg"></i>
                        Geography
                      </p>
                      <p className="flex items-center gap-1">
                        <i className="bi bi-bar-chart text-orange-900 font-bold text-lg"></i>
                        With Charts
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mt-4 mx-4 text-sm text-gray-500">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">Sectors:</span>
                        {product.sectors.map((item, index) => (
                          <span
                            key={index}
                            className="text-blue-700 border border-blue-700 rounded px-2 py-0.5"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">Published by:</span>{" "}
                        <span className="mx-2 font-bold text-gray-700">
                          {product.organization.name}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between w-full mt-4 mx-4">
                      <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-4">
                        <span className="font-semibold">Tags:</span>
                        {product.tags.map((item, idx) => (
                          <span
                            key={idx}
                            className="bg-tags border border-tags text-black rounded px-2 py-0.5 shadow"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2 text-sm text-gray-500 mt-4 items-center">
                        <span className="font-semibold">Formats:</span>
                        {product.formats.map((item, idx) => (
                          <span key={idx} className="text-lg">
                            {item === "PDF" && (
                              <i className="bi bi-file-earmark-pdf-fill text-red-600"></i>
                            )}
                            {item === "CSV" && (
                              <i className="bi bi-file-earmark-spreadsheet-fill text-green-600"></i>
                            )}
                            {item === "XLSX" && (
                              <i className="bi bi-file-earmark-excel-fill text-green-800"></i>
                            )}
                            {item === "JSON" && (
                              <i className="bi bi-file-earmark-code-fill text-yellow-700"></i>
                            )}
                            {item === "XLS" && (
                              <i className="bi bi-file-earmark-excel-fill text-green-700"></i>
                            )}
                            {item === "ZIP" && (
                              <i className="bi bi-file-earmark-zip-fill text-gray-700"></i>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </InfiniteScroll>
        </div>
      </section>
    </main>
  );
}
