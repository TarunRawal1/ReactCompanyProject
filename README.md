### **Functionalities Implemented**

#### **Home Page**

- **Dynamic Dataset Listing** with infinite scroll using `react-infinite-scroll-component`.
- **Search & Filtering**:

  - **Live Search**: Users can type into the search bar to filter datasets by title.
  - Search input is **conditionally rendered** — visible as soon as use starts typing.
  - Search state is **URL-aware**, enabling deep linking with query parameters via `useSearchParams`.

- **Filter System**:

  - Multi-select filters for **Sectors**, **Formats**, **Tags**, and **Geographies**.
  - Filters update the dataset listing in real-time.
  - “Reset” button clears all active filters.

- **View Toggle**:

  - Toggle between **Card View** and **List View** using a button.
  - View mode dynamically adjusts layout using Tailwind utility classes.

- **Sort Dropdown**:

  - Options include **Downloads**, **Formats**, and **Latest Updated**.

- **Visual Tagging**:

  - Datasets are labeled with associated **tags**, **sectors**, and **formats** using colored badges and icons.

- **Published Info & Icons**:

  - Dataset entries show **last updated date**, **download count**, and file format icons (PDF, CSV, XLSX, etc.).

- **No Results Handling**:

  - If search yields no matching datasets, a message is shown after a delay.

---

#### **Filter Component**

- Dropdown for each category: **Sectors**, **Tags**, **Formats**, and **Geographies**.
- Custom checkboxes for selecting multiple filter options.
- Integrated with global `ProductContext` state.
- Smooth show/hide toggle via three-dot icon.

---

#### **Header Component**

- **Responsive Navigation Bar** with logo, main links (All Data, Sectors, Use Cases, etc.), and mobile support.
- **Search Triggered UI**:

  - Clicking the search icon in the header toggles the **search bar** on the homepage.
  - Along with the search bar, it also reveals:

    - **Card/List View toggle button**
    - **Sort dropdown**
    - **All active filter sections (Sectors, Formats, Tags, Geographies)**

- **Mobile Menu**:

  - Hamburger icon opens collapsible menu with all primary links and login/signup button.
