import { useParams } from "react-router";
import { BrowsePageContent } from "../components/BrowsePageContent";

export default function CountryPage() {
  const { countryId } = useParams<{ countryId: string }>();
  const countryIdNum = countryId ? Number(countryId) : undefined;

  return <BrowsePageContent type="all" initialCountryId={countryIdNum} />;
}
