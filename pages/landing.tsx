import Genres from "@/components/pages/landing/genres";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen space-y-8 py-6 md:py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header Section */}
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader className="space-y-2 pb-2">
            <CardTitle className="text-4xl md:text-5xl font-bold">
              پشمک مووی
            </CardTitle>
            <CardDescription className="text-lg">
              جستجو و تماشای بهترین فیلم‌ها و سریال‌ها
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Genres Section */}
        <Card>
          <CardContent className="pt-6">
            <Genres />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Landing;
