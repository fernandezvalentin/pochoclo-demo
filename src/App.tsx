import { useState, type ReactNode } from 'react';
import Navbar, { type View } from './components/Navbar';
import Hero from './components/Hero';
import Row from './components/Row';
import MovieModal from './components/MovieModal';
import ProfileSelect from './components/ProfileSelect';
import Footer from './components/Footer';
import SearchResults from './components/SearchResults';
import MyList from './components/MyList';
import { useMyList } from './hooks/useMyList';
import { requests } from './services/api';
import { loadProfile, saveProfile, type Profile } from './data/profiles';
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

  const changeProfile = (next: Profile | null) => {
    saveProfile(next);
    setProfile(next);
    window.scrollTo({ top: 0 });
  };

  if (!profile) {
    return <ProfileSelect onSelect={changeProfile} />;
  }

  // key={profile.id}: al cambiar de perfil se reinicia todo el estado (vista, búsqueda, Mi lista).
  return (
    <Browse
      key={profile.id}
      profile={profile}
      onProfileChange={changeProfile}
      onSwitchProfile={() => changeProfile(null)}
    />
  );
}

interface BrowseProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
  onSwitchProfile: () => void;
}

function Browse({ profile, onProfileChange, onSwitchProfile }: BrowseProps) {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [view, setView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const myList = useMyList(profile.id);

  const handleViewChange = (newView: View) => {
    setSearchQuery('');
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    window.scrollTo({ top: 0 });
  };

  const searching = searchQuery.trim() !== '';

  let content: ReactNode;
  if (searching) {
    content = <SearchResults query={searchQuery} kids={profile.kids} onMovieClick={setSelectedMovie} />;
  } else if (view === 'mylist') {
    content = <MyList movies={myList.list} onMovieClick={setSelectedMovie} />;
  } else {
    const rows = (profile.kids ? KIDS_ROWS : ROWS)[view];
    const heroUrl = (profile.kids ? KIDS_HERO_URL : HERO_URL)[view];
    content = (
      <>
        <Hero fetchUrl={heroUrl} onMoreInfo={setSelectedMovie} key={view} />
        <main className="app__rows">
          {rows.map((row) => (
            <Row
              key={`${view}-${row.title}`}
              title={row.title}
              fetchUrl={row.fetchUrl}
              isLargeRow={row.isLargeRow}
              isTop10={row.isTop10}
              onMovieClick={setSelectedMovie}
            />
          ))}
        </main>
      </>
    );
  }

  return (
    <div className="app">
      <Navbar
        activeView={searching ? null : view}
        onViewChange={handleViewChange}
        profile={profile}
        onProfileChange={onProfileChange}
        onSwitchProfile={onSwitchProfile}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onOpenTitle={setSelectedMovie}
      />

      {content}

      <Footer />

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          inList={myList.isInList(selectedMovie.id)}
          onToggleList={myList.toggle}
        />
      )}
    </div>
  );
}

export default App;
