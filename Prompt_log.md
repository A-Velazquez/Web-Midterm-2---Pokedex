### 1. High-Level Goal

_What feature, component, or bug were you trying to solve this week?_

- Understand how to use PokéAPI to build a Pokédex and structure the Node/Express backend proxy
- Decide where to start (`server.js` vs. `app.js`) and audit existing backend routes
- Fix catalog display issues (missing Pokémon IDs and broken artwork/sprite images)
- Implement full data mapping and endpoints with line-by-line understanding
- Implement dynamic, type-specific CSS color styling and UI/UX visual enhancements across the modal and catalog

---

### 2. The Interaction Log

_Document the primary prompts you used to generate the base code._

| AI Tool Used | Exact Initial Prompt | What the AI Generated (Summary/Snippet) |
| :--- | :--- | :--- |
| Claude.ai | "How do I need to use that api? DO NOT APPLY CHANGES" | Read starter files, explained PokéAPI endpoints, and demonstrated expected data structure for the frontend. |
| Claude.ai | "Should I start with app.js or server.js?" | Recommended starting with `server.js` to establish data flow; warned against hardcoding 151 entries. |
| Claude.ai | "How is it looking what I have?" | Audited `server.js` code; identified duplicate routes, invalid search paths, missing image properties, and raw unformatted API outputs. |
| Claude.ai | "How can I do the 3 fix?" | Showed how to extract IDs from PokéAPI resource URLs and construct direct sprite URLs (`/sprites/pokemon/{id}.png`). |
| Claude.ai | "Should I make a new folder for scripts and there make the function to get sprites?" | Clarified that sprites are public URL assets processed directly in memory; provided an updated, consolidated `server.js`. |
| Gemini | "I want to generate specific colors for each pokemon regarding their type in the css, can you give me that code? Make sure the types are their respective colors, that they are marked as important and include the text. Make sure that for types like steel, ice and electric the text is black instead of white for the contrast." | Generated an 18-class CSS palette (`.type-fire`, `.type-water`, etc.) using official hex colors, `!important` flags, and accessible text colors (`#212529` vs `#FFFFFF`). |

---

### 3. The Human Audit & Modifications

_What did the AI get wrong or omit? What manual changes did you make to integrate this code into your existing application structure?_

- **Backend Adjustments:** The AI initially generated duplicate route logic for searching vs. fetching IDs, which we refactored into a single dynamic endpoint. It also left raw height/weight measurements unformatted and omitted the required `"type": "module"` setting in `package.json`.
- **Frontend & CSS Modifications:** While the AI provided basic type classes, we manually expanded `public/css/styles.css` to refine the layout. We added image sizing rules (`.characters-detail-img`) to prevent overflow, smooth scale/hover transitions (`.sprite-wrapper:hover`), pill-shaped border-radius rules (`50rem`) for modal badges, and custom WebKit scrollbars for the move container. In `public/js/app.js`, we updated `populateModal` to dynamically append `type-${type.toLowerCase()}` to badge elements. We briefly tested a dark gradient container (`.sprite-wrapper`) behind sprites, but ultimately removed it to keep the modal presentation clean and unified.

---

### 4. Integration & Learnings

_How does this code integrate with the rest of your system? What is the core mechanism you learned?_

- **Architecture:** The Express backend acts as a middleware proxy between PokéAPI and the client. It standardizes raw external responses into lightweight client objects (`toSummary` for catalog cards, `toDetail` for modal views) and caches results in memory to minimize external network requests.
- **Dynamic UI Coupling:** The client JS (`app.js`) reads type strings directly from the backend JSON payload, converts them to lowercase, and maps them directly to corresponding CSS classes (`type-${type}`) in `styles.css`. This enables instant visual feedback without hardcoding styles per Pokémon.

---

### 5. Oral Defense Self-Check

- [x] We can explain every single line of this code.
- [x] We understand how the asynchronous operations/CSS classes used here affect other components.
- [x] We know exactly which file and line numbers this code is located in our repository.
