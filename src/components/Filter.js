import { useState } from "react";
import { useProductContext } from "../context/ProductContext";
const filterOptions = {
  Sectors: [
    "Public Finance",
    "Law And Justice",
    "Climate Action",
    "Urban Development",
    "Gender",
    "Coastal",
    "Child Rights",
  ],
  Formats: ["CSV", "PDF", "XLSX", "JSON", "XLS", "ZIP"],
  Tags: [
    "Budget",
    "Law",
    "Justice",
    "Courts",
    "Disaster",
    "Public Health",
    "Reports",
    "Timeseries",
    "Gender",
    "Khoj",
  ],
  Geographies: [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Asia-Pacific",
    "Assam",
    "Bangkok",
    "Delhi",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "India",
    "Indonesia",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Philippines",
    "Sikkim",
    "Tamil Nadu",
  ],
};

export default function Filter({ filter }) {
  const [hidden, setHidden] = useState(true);
  const options = filterOptions[filter] || [];
  const { dispatch, state } = useProductContext();
  const handleCheckboxChange = (option) => {
    const prev = state.selectedFilters[filter] || [];
    let updated;
    if (prev.includes(option)) {
      updated = prev.filter((item) => item !== option);
    } else {
      updated = [...prev, option];
    }
    dispatch({
      type: "SET_SELECTED_FILTERS",
      payload: { filterGroup: filter, values: updated },
    });
  };
  return (
    <div className="flex flex-col items-center w-4/5 ml-7 mb-3">
      <div className="flex justify-between items-center w-full bg-sector p-2 border-gray-500 border-2 rounded">
        <div>
          {filter} ({filterOptions[filter].length})
        </div>
        <i
          onClick={() => setHidden(!hidden)}
          className="bi bi-three-dots hover:cursor-pointer"
        ></i>
      </div>
      <div>
        {!hidden && (
          <ul>
            {options.map((option, idx) => (
              <li
                key={idx}
                className="flex w-40 p-1 items-center mr-16 text-gray-500 text-sm mt-2"
              >
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={state.selectedFilters[filter]?.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
                <p>{option}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
