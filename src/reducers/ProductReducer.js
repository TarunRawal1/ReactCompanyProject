export const ProductReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_PRODUCTS":
      return {
        ...state,
        products: payload.append
          ? [...state.products, ...payload.products]
          : payload.products,
      };
    case "setDownloads":
      return {
        ...state,
        downloads: payload.downloads,
        formats: false,
        latestUpdated: false,
      };
    case "setFormats":
      return {
        ...state,
        formats: payload.formats,
        downloads: false,
        latestUpdated: false,
      };
    case "setLatestUpdated":
      return {
        ...state,
        latestUpdated: payload.latestUpdated,
        downloads: false,
        formats: false,
      };
    case "RESET":
      return {
        ...state,
        selectedFilters: {
          Sectors: [],
          "Time Periods": [],
          Formats: [],
          Tags: [],
          Licenses: [],
          Geographies: [],
        },
        formats: false,
        downloads: false,
        latestUpdated: false,
      };

    case "SET_SELECTED_FILTERS":
      return {
        ...state,
        selectedFilters: {
          ...state.selectedFilters,
          [payload.filterGroup]: payload.values,
        },
      };
    default:
      return state;
  }
};
