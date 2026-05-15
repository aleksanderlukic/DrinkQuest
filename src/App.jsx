import { useApp } from "./store/AppContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import OnboardingModal from "./components/common/OnboardingModal";
import AppRouter from "./routes/AppRouter";

export default function App() {
  const { isDark } = useApp();

  return (
    <div className={isDark ? "dark" : ""}>
      <div
        className={`min-h-screen ${isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`}
      >
        <Navbar />
        <main>
          <AppRouter />
        </main>
        <Footer />
        <OnboardingModal />
      </div>
    </div>
  );
}
