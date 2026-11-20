import { useState } from 'react';
import Navbar, { type View } from './components/Navbar';
import Hero from './components/Hero';
import Row from './components/Row';
import MovieModal from './components/MovieModal';
import ProfileSelect from './components/ProfileSelect';
import Footer from './components/Footer';
import { requests } from './services/api';
import { loadProfile, saveProfile, type Profile } from './data/profiles';
import type { Movie } from './types/movie';
import './App.css';

interface RowConfig {
  title: string;
  fetchUrl: string;
  isLargeRow?: boolean;
}

const ROWS: Record<View, RowConfig[]> = {
  home: [
    { title: 'Originales de Netflix', fetchUrl: requests.fetchNetflixOriginals, isLargeRow: true },
    { title: 'Tendencias', fetchUrl: requests.fetchTrending },
    { title: 'Los más valorados', fetchUrl: requests.fetchTopRatedMovies },
    { title: 'Acción', fetchUrl: requests.fetchActionMovies },
    { title: 'Comedias', fetchUrl: requests.fetchComedyMovies },
    { title: 'Terror', fetchUrl: requests.fetchHorrorMovies },
    { title: 'Romance', fetchUrl: requests.fetchRomanceMovies },
    { title: 'Documentales', fetchUrl: requests.fetchDocumentaries },
  ],
  series: [
    { title: 'Originales de Netflix', fetchUrl: requests.fetchNetflixOriginals, isLargeRow: true },
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

const KIDS_ROWS: Record<View, RowConfig[]> = {
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
};

const HERO_URL: Record<View, string> = {
  home: requests.fetchTrending,
  series: requests.fetchNetflixOriginals,
  movies: requests.fetchMoviesTrending,
};

const KIDS_HERO_URL: Record<View, string> = {
  home: requests.fetchKidsMovies,
  series: requests.fetchKidsSeries,
  movies: requests.fetchKidsMovies,
};

function App() {
  const [profile, setProfile] = useState<Profile | null>(loadProfile);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [view, setView] = useState<View>('home');

  const changeProfile = (next: Profile | null) => {
    saveProfile(next);
    setProfile(next);
    setView('home');
    setSelectedMovie(null);
    window.scrollTo({ top: 0 });
  };

  const handleViewChange = (newView: View) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!profile) {
    return <ProfileSelect onSelect={changeProfile} />;
  }

  const rows = (profile.kids ? KIDS_ROWS : ROWS)[view];
  const heroUrl = (profile.kids ? KIDS_HERO_URL : HERO_URL)[view];

  return (
    <div className="app" key={profile.id}>
      <Navbar
        activeView={view}
        onViewChange={handleViewChange}
        profile={profile}
        onProfileChange={changeProfile}
        onSwitchProfile={() => changeProfile(null)}
      />
      <Hero fetchUrl={heroUrl} onMoreInfo={setSelectedMovie} key={`${profile.id}-${view}`} />

      <main className="app__rows">
        {rows.map((row) => (
          <Row
            key={`${view}-${row.title}`}
            title={row.title}
            fetchUrl={row.fetchUrl}
            isLargeRow={row.isLargeRow}
            onMovieClick={setSelectedMovie}
          />
        ))}
      </main>

      <Footer />

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </div>
  );
}

export default App;
