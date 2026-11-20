# 🍿 Pochoclo - Streaming UI Demo

**Pochoclo** is a Netflix-style streaming interface built with **React**, **TypeScript**, and **Vite**. It features a fluid UI, real-time data from the **TMDB API**, and its own brand on top of a classic streaming-platform layout.

**🔗 Live demo:** _agregá acá el link de Vercel_

> Proyecto de portfolio con fines educativos. No es un servicio real ni está afiliado a ninguna plataforma de streaming. Datos e imágenes de [TMDB](https://www.themoviedb.org/).

## 🚀 Key Features

- **Profile Selector**: "¿Quién está viendo ahora?" screen with custom SVG avatars, a loading transition and the selected profile remembered in `localStorage`.
- **Kids Profile**: Switches the catalog to animation, family and kids content only.
- **Profile Menu**: Navbar dropdown to switch profiles or go back to the selector.
- **Search**: Expandable search box in the navbar with debounced TMDB multi-search, empty and error states (kids profile only gets kids titles).
- **My List**: Add or remove titles from the detail modal; saved per profile in `localStorage`.
- **New & Popular**: Top 10 of the day with large rank numbers, new releases, upcoming premieres and series on the air.
- **Notifications**: Bell with an unread counter showing new arrivals and upcoming premieres; opening a notification shows the title.
- **Mobile Navigation**: "Explorar" dropdown replaces the nav links on small screens.
- **Loading Skeletons**: Shimmer placeholders while each row loads; empty rows are hidden.
- **Dynamic Hero Section**: Showcases a random trending movie or series with an immersive background and descriptions.
- **Smart Navigation**: Categorized views for **Home**, **Series**, and **Movies** that dynamically filter content.
- **Content Carousels**: Multiple horizontal rows for genres like Trending, Top Rated, Action, Horror, and many more.
- **Interactive Modals**: Detailed overlays with genres, TMDB score, release year and backdrops. Close with `Esc` or by clicking outside.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile viewing.
- **Defensive API Layer**: Robust error handling and data validation to ensure a smooth user experience even with API fluctuations.

## 🛠️ Built With

- **React 19** - UI Library
- **TypeScript** - For type-safe development
- **Vite** - Lightning-fast build tool
- **Axios** - For API requests
- **Lucide React** - Premium iconography
- **CSS3 (Vanilla)** - Custom modern styling with glassmorphism and animations

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/netflix-clone.git
cd netflix-clone
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add your TMDB API credentials:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/original/
```

> [!IMPORTANT]
> You can get a free API key at [themoviedb.org](https://www.themoviedb.org/documentation/api).

### 4. Run the development server
```bash
npm run dev
```

## 📂 Project Structure

- `src/components/`: UI components (ProfileSelect, Navbar, SearchBox, Notifications, Hero, Row, TitleGrid, SearchResults, MyList, MovieModal, Footer, Avatar, Logo).
- `src/hooks/`: `useMyList` (per-profile list) and `useDebounce`.
- `src/services/api.ts`: Axios instance, TMDB endpoints and the `imageUrl()` helper (responsive image sizes).
- `src/data/`: Profiles and TMDB genre names.
- `src/types/`: TypeScript definitions for movies.

## 🤝 Contributing

Feel free to fork this project and submit PRs for any improvements or new features!

---
*Created with ❤️ by Antigravity.*
