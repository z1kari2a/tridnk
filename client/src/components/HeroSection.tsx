import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { Card } from "./ui/card";

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="mb-8">
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row items-center">
          <div className="p-6 md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {t("hero.title")}
            </h2>
            <p className="text-gray-600 mb-4">
              {t("hero.description")}
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <Button
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                {t("hero.comparePrices")}
              </Button>
              <Button
                variant="outline"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition"
              >
                {t("hero.latestNews")}
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 p-6 bg-primary-50">
            <div className="h-[250px] rounded-lg bg-gradient-to-r from-primary-100 to-primary-50 flex items-center justify-center">
              <svg
                className="h-32 w-32 text-primary-600 opacity-75"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};

export default HeroSection;
