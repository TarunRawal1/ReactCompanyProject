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
            className="border-2 rounded p-2 w-full md:w-2/3 mb-4 md:mb-0 focus:outline-none focus:border-blue-500"
          />
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setDropdown(!dropdown)}
              className="w-full md:w-auto border-2 p-3 rounded-full hover:bg-gray-800 hover:text-white"
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
        <div className="w-full lg:w-4/5 flex-wrap min-h-screen rounded mt-1 shadow-xl">
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
                  {!showNoResults
                    ? !searchedProducts.length === 0 && (
                        <>You have reached to the end of the Page!!</>
                      )
                    : ""}
                </b>
              </p>
            }
          >
            {showNoResults
              ? searchedProducts.length === 0 && (
                  <div className="text-center my-6 text-gray-600 font-semibold text-lg">
                    Sorry! No results found for your search.
                  </div>
                )
              : ""}

            {searchedProducts.map((product, index) => (
              <div
                key={index}
                className="p-6 mb-4 bg-white border-2 shadow-lg border-gray-200 rounded shadow"
              >
                <h2 className="text-lg font-semibold text-blue-800">
                  {product.title}
                </h2>
                <p className="text-gray-600">{product.description}</p>
                <div className="flex justify-start gap-8 items-center mt-2">
                  <p className="text-sm text-gray-500">
                    <i class="bi bi-calendar4 font-bold text-orange-900 text-xl mr-1"></i>{" "}
                    Last Updated:{" "}
                    {new Date(product.modified).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    <i class="bi bi-download text-orange-900 font-bold text-xl mr-1"></i>{" "}
                    Downloads:{" "}
                    <span className="text-black">
                      {product.download_count}+
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    <i class="bi bi-globe text-xl text-orange-900 font-bold"></i>{" "}
                    Geography
                  </p>
                  <p className="text-sm text-gray-500">
                    <i class="bi bi-bar-chart text-xl text-orange-900 font-bold"></i>{" "}
                    With Charts
                  </p>
                </div>
                <div className="flex flex-col md:flex-row justify-between w-full mt-4 mx-4">
                  <p className="text-sm text-gray-500">
                    Sectors:{"  "}
                    {product.sectors.map((item, index) => (
                      <span
                        key={index}
                        className="text-blue-700 font-semibold mr-2 border-2 border-blue-700 rounded px-1"
                      >
                        {item}
                      </span>
                    ))}
                  </p>
                  <p className="text-sm text-gray-500">
                    Published by:{" "}
                    <span className="mx-2 font-bold text-gray-700">
                      {product.organization.name}
                    </span>
                  </p>
                </div>
                <div className="flex flex-col md:flex-row justify-between w-full mt-4 mx-4">
                  <p className="text-sm text-gray-500">
                    Tags:
                    {product.tags.map((item) => (
                      <span
                        key={item}
                        className=" font-semibold mr-1 border-2 border-tags shadow-md rounded p-1 mx-2 bg-tags text-black"
                      >
                        {item}
                      </span>
                    ))}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    Formats:{" "}
                    {product.formats.map((item, idx) => (
                      <span
                        key={idx}
                        className="flex items-center ml-2 text-lg items-center justify-center"
                      >
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
                  </p>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </section>
    </main>
  );
}
