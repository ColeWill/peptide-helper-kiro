import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ExplorePage from "./pages/Explore/ExplorePage";
import DetailPage from "./pages/Detail/DetailPage";
import AgentInsightsPage from "./pages/AgentInsights/AgentInsightsPage";
import CompletedSpecsPage from "./pages/CompletedSpecs/CompletedSpecsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<ExplorePage />} />
        <Route path="/peptide/:id" element={<DetailPage />} />
        <Route path="/agent-insights" element={<AgentInsightsPage />} />
        <Route path="/completed-specs" element={<CompletedSpecsPage />} />
      </Route>
    </Routes>
  );
}
