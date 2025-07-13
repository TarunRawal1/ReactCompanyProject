import { useReducer, useContext, createContext } from "react";
import { ProductReducer } from "../reducers/ProductReducer";
const initalState = {
  products: [],
  formats: false,
  latestUpdated: false,
  downloads: false,
  selectedFilters: {
    Sectors: [],
    "Time Periods": [],
    Formats: [],
    Tags: [],
    Geographies: [],
  },
};

const ProductContext = createContext(initalState);

export const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ProductReducer, initalState);

  const latestUpdateschecker = (products) =>
    state.latestUpdated
      ? products.filter(
          (product) =>
            product.modified &&
            new Date(product.modified) >= new Date("2025-07-02T00:00:00Z")
        )
      : products;

  const formatchecker = (products) =>
    state.formats
      ? products.filter(
          (product) =>
            Array.isArray(product.formats) && product.formats.includes("PDF")
        )
      : products;
  const downloadsChecker = (products) =>
    state.downloads
      ? products.filter((product) => product.download_count > 0)
      : products;

  function setProducts(product, append = false) {
    dispatch({
      type: "SET_PRODUCTS",
      payload: { products: product, append },
    });
  }
  const applySelectedFilters = (products) => {
    let filtered = products;

    Object.entries(state.selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        filtered = filtered.filter((product) => {
          const lowerKey = key.toLowerCase();
          if (key === "Geographies") {
            return product.metadata?.some((meta) => {
              if (meta.metadata_item?.label === "Geography") {
                const locations = meta.value.split(",").map((v) => v.trim());
                return locations.some((loc) => values.includes(loc));
              }
              return false;
            });
          }

          if (Array.isArray(product[lowerKey])) {
            return product[lowerKey].some((item) => values.includes(item));
          }
          if (typeof product[lowerKey] === "string") {
            return values.includes(product[lowerKey]);
          }

          return true; // fallback
        });
      }
    });

    return filtered;
  };

  const finalProduct = applySelectedFilters(
    formatchecker(downloadsChecker(latestUpdateschecker(state.products)))
  );

  let value = {
    products: finalProduct,
    formats: state.formats,
    latestUpdated: state.latestUpdated,
    downloads: state.downloads,
    selectedFilters: {
      Sectors: [],
      "Time Periods": [],
      Formats: [],
      Tags: [],
      Geographies: [],
    },
    setProducts,
    dispatch,
    state,
  };
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export const useProductContext = () => {
  return useContext(ProductContext);
};
