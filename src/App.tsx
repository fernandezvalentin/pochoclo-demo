import { useCallback, useEffect, useRef, useState } from 'react';
import { Route, Routes, useLocation, useNavigate, useSearchParams } from 'react-router';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Row from './components/Row';
import TitleModal from './components/TitleModal';
import ProfileSelect from './components/ProfileSelect';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import MyList from './components/MyList';
import NotFound from './components/NotFound';
import { useMyList } from './hooks/useMyList';
import { requests } from './services/api';
import { loadProfile, saveProfile, type Profile } from './data/profiles';
import {
  SEARCH_PATH, TITLE_PARAM, VIEW_PATHS, parseTitleParam, titleParamFor, viewFromPath, type View,
} from './routes';
import type { Movie } from './types/movie';
import './App.css';

interface RowConfig {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
  isTop10?: boolean;
}

type RowView = Exclude<View, 'mylist'>;

const ROWS: Record<RowView, RowConfig[]> = {
  home: [
    { title: 'Series originales', fetchUrl: requests.fetchOriginals, isLargeRow: true },
    { title: 'Top 10 de hoy', fetchUrl: requests.fetchTop10Today, isTop10: true },
    { title: 'Tendencias', fetchUrl: requests.fetchTrending },
    { title: 'Los más valorados', fetchUrl: requests.fetchTopRatedMovies },
    { title: 'Acción', fetchUrl: requests.fetchActionMovies },
    { title: 'Comedias', fetchUrl: requests.fetchComedyMovies },
    { title: 'Terror', fetchUrl: requests.fetchHorrorMovies },
    { title: 'Romance', fetchUrl: requests.fetchRomanceMovies },
    { title: 'Documentales', fetchUrl: requests.fetchDocumentaries },
  ],
  new: [
    { title: 'Top 10 de hoy', fetchUrl: requests.fetchTop10Today, isTop10: true },
    { title: 'Nuevo en Pochoclo', fetchUrl: requests.fetchNowPlaying },
    { title: 'Próximos estrenos', fetchUrl: requests.fetchUpcoming },
    { title: 'Series en emisión', fetchUrl: requests.fetchOnTheAir },
    { title: 'Tendencias de la semana', fetchUrl: requests.fetchTrending },
  ],
  series: [
    { title: 'Series originales', fetchUrl: requests.fetchOriginals, isLargeRow: true },
    { title: 'Series populares', fetchUrl: requests.fetchSeriesTrending },
    { title: 'Series mejor valoradas', fetchUrl: requests.fetchTopRatedSeries },
  ],
  movies: [
    { title: 'Películas populares', fetchUrl: requests.fetchMoviesTrending, isLargeRow: true },
    { title: 'Los más valorados', fetchUrl: requests.fetchTopRatedMovies },
    { title: 'Acción', fetchUrl: requests.fetchActionMovies },
    { title: 'Comedias', fetchUrl: requests.fetchComedyMovies },
    { title: 'Terror', fetchUrl: requests.fetchHorrorMovies },
    { title: 'Romance', fetchUrl: requests.fetchRomanceMovies },
    { title: 'Documentales', fetchUrl: requests.fetchDocumentaries },
  ],
};

const KIDS_ROWS: Record<RowView, RowConfig[]> = {
  home: [
    { title: 'Películas animadas', fetchUrl: requests.fetchKidsMovies, isLargeRow: true },
    { title: 'Series infantiles', fetchUrl: requests.fetchKidsSeries },
    { title: 'Para ver en familia', fetchUrl: requests.fetchFamilyMovies },
    { title: 'Series animadas', fetchUrl: requests.fetchAnimatedSeries },
  ],
  series: [
    { title: 'Series infantiles', fetchUrl: requests.fetchKidsSeries, isLargeRow: true },
    { title: 'Series animadas', fetchUrl: requests.fetchAnimatedSeries },
  ],
  movies: [
    { title: 'Películas animadas', fetchUrl: requests.fetchKidsMovies, isLargeRow: true },
    { title: 'Para ver en familia', fetchUrl: requests.fetchFamilyMovies },
  ],
  new: [
    { title: 'Top 10 para chicos', fetchUrl: requests.fetchKidsMovies, isTop10: true },
    { title: 'Novedades animadas', fetchUrl: requests.fetchNewKids },
    { title: 'Series infantiles', fetchUrl: requests.fetchKidsSeries },
  ],
};

const HERO_URL: Record<RowView, string> = {
  home: requests.fetchTrending,
  new: requests.fetchNowPlaying,
  series: requests.fetchOriginals,
  movies: requests.fetchMoviesTrending,
};

const KIDS_HERO_URL: Record<RowView, string> = {
  home: requests.fetchKidsMovies,
  new: requests.fetchNewKids,
  series: requests.fetchKidsSeries,
  movies: requests.fetchKidsMovies,
};

function App() {
  const [profile, setProfile] = useState<Profile | null>(loadProfile);
  const navigate = useNavigate();

  const changeProfile = (next: Profile | null) => {
    saveProfile(next);
    setProfile(next);
    navigate('/');
    window.scrollTo({ top: 0 });
  };

  if (!profile) {
    return <ProfileSelect onSelect={changeProfile} />;
  }

  // key={profile.id}: al cambiar de perfil se reinicia todo el estado (búsqueda, Mi lista, notificaciones).
  return (
    <Browse
      key={profile.id}
      profile={profile}
      onProfileChange={changeProfile}
      onSwitchProfile={() => changeProfile(null)}
    />
  );
}

interface CatalogProps {
  view: RowView;
  kids?: boolean;
  onMovieClick: (movie: Movie) => void;
}

// Hero + filas de una sección (Inicio, Series, Películas, Novedades).
function Catalog({ view, kids, onMovieClick }: CatalogProps) {
  const rows = (kids ? KIDS_ROWS : ROWS)[view];
  const heroUrl = (kids ? KIDS_HERO_URL : HERO_URL)[view];
  return (
    <>
      <Hero fetchUrl={heroUrl} onMoreInfo={onMovieClick} key={view} />
      <main className="app__rows">
        {rows.map((row) => (
          <Row
            key={`${view}-${row.title}`}
            title={row.title}
            fetchUrl={row.fetchUrl}
            isLargeRow={row.isLargeRow}
            isTop10={row.isTop10}
            onMovieClick={onMovieClick}
          />
        ))}
      </main>
    </>
  );
}

interface BrowseProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
  onSwitchProfile: () => void;
}

interface LocationState {
  movie?: Movie;
  fromApp?: boolean;
}

function Browse({ profile, onProfileChange, onSwitchProfile }: BrowseProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const myList = useMyList(profile.id);
  const state = (location.state ?? {}) as LocationState;

  // Página a la que volver al cerrar la búsqueda.
  const returnTo = useRef('/');
  const onSearchPage = location.pathname === SEARCH_PATH;
  const searchQuery = onSearchPage ? searchParams.get('q') ?? '' : '';

  // Al cambiar de sección, volver arriba (abrir un título no cambia el pathname).
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const handleSearchChange = (query: string) => {
    if (query.trim() === '') {
      navigate(returnTo.current);
    } else if (onSearchPage) {
      setSearchParams({ q: query }, { replace: true });
    } else {
      returnTo.current = location.pathname;
      navigate(`${SEARCH_PATH}?q=${encodeURIComponent(query)}`);
    }
  };

  // El título abierto vive en la URL (?titulo=movie-603): se puede compartir y "atrás" lo cierra.
  const openTitle = (movie: Movie) => {
    const params = new URLSearchParams(searchParams);
    params.set(TITLE_PARAM, titleParamFor(movie));
    navigate({ search: params.toString() }, { state: { movie, fromApp: true } satisfies LocationState });
  };

  const closeTitle = useCallback(() => {
    if (state.fromApp) {
      navigate(-1);
    } else {
      const params = new URLSearchParams(searchParams);
      params.delete(TITLE_PARAM);
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [state.fromApp, searchParams, navigate]);

  const openedTitle = parseTitleParam(searchParams.get(TITLE_PARAM));
  const catalog = (view: RowView) => <Catalog view={view} kids={profile.kids} onMovieClick={openTitle} />;

  return (
    <div className="app">
      <Navbar
        activeView={viewFromPath(location.pathname)}
        onViewChange={(view: View) => navigate(VIEW_PATHS[view])}
        profile={profile}
        onProfileChange={onProfileChange}
        onSwitchProfile={onSwitchProfile}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onOpenTitle={openTitle}
      />

      <Routes>
        <Route path={VIEW_PATHS.home} element={catalog('home')} />
        <Route path={VIEW_PATHS.series} element={catalog('series')} />
        <Route path={VIEW_PATHS.movies} element={catalog('movies')} />
        <Route path={VIEW_PATHS.new} element={catalog('new')} />
        <Route path={VIEW_PATHS.mylist} element={<MyList movies={myList.list} onMovieClick={openTitle} />} />
        <Route
          path={SEARCH_PATH}
          element={<SearchResults query={searchQuery} kids={profile.kids} onMovieClick={openTitle} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />

      {openedTitle && (
        <TitleModal
          key={`${openedTitle.type}-${openedTitle.id}`}
          type={openedTitle.type}
          id={openedTitle.id}
          initialMovie={state.movie}
          onClose={closeTitle}
          inList={myList.isInList}
          onToggleList={myList.toggle}
        />
      )}
    </div>
  );
}

export default App;
