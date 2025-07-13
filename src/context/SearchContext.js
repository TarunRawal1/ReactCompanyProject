import { useContext, createContext, useReducer } from "react";
const initalState = {
  searchStatsus: false,
};

const searchContext = createContext(initalState);

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, initalState);
  const setSearchStatus = (status) => {
    dispatch({
      type: "SET_SEARCH_STATUS",
      payload: { status },
    });
  };
  let value = {
    searchStatus: state.searchStatus,
    setSearchStatus,
    state,
  };

  return (
    <searchContext.Provider value={value}>{children}</searchContext.Provider>
  );
};
export const useSearchContext = () => {
  return useContext(searchContext);
};
const SearchReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_SEARCH_STATUS":
      return {
        ...state,
        searchStatus: payload.status,
      };
    default:
      return state;
  }
};
