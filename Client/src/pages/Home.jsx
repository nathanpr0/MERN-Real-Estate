// IMPORT PAGES
import Recommendation from "../components/Recommendation.jsx";

export default function Home() {
  const FETCH_LISTING_MAIN = String(import.meta.env.VITE_MAIN_PAGE_LISTING);

  return (
    <>
      <Recommendation fetchListing={FETCH_LISTING_MAIN} />;
    </>
  );
}
