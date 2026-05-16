import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import GamesPage from "../pages/GamesPage";
import TruthOrDarePage from "../pages/TruthOrDarePage";
import NeverHaveIEverPage from "../pages/NeverHaveIEverPage";
import MostLikelyToPage from "../pages/MostLikelyToPage";
import PointingGamePage from "../pages/PointingGamePage";
import SpinTheBottlePage from "../pages/SpinTheBottlePage";
import TruthOrDrinkPage from "../pages/TruthOrDrinkPage";
import CouplesPage from "../pages/CouplesPage";
import PartyPredictionsPage from "../pages/PartyPredictionsPage";
import TwoTruthsPage from "../pages/TwoTruthsPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import CustomPage from "../pages/CustomPage";
import GeneratorPage from "../pages/GeneratorPage";
import FavoritesPage from "../pages/FavoritesPage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/games/truth-or-dare" element={<TruthOrDarePage />} />
      <Route path="/games/never-have-i-ever" element={<NeverHaveIEverPage />} />
      <Route path="/games/most-likely-to" element={<MostLikelyToPage />} />
      <Route path="/games/pointing-game" element={<PointingGamePage />} />
      <Route path="/games/spin-the-bottle" element={<SpinTheBottlePage />} />
      <Route path="/games/truth-or-drink" element={<TruthOrDrinkPage />} />
      <Route path="/games/couples" element={<CouplesPage />} />
      <Route
        path="/games/party-predictions"
        element={<PartyPredictionsPage />}
      />
      <Route path="/games/two-truths" element={<TwoTruthsPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/custom" element={<CustomPage />} />
      <Route path="/generator" element={<GeneratorPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
