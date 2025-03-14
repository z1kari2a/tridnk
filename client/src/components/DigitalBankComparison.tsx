import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { Landmark, CreditCard, Building, CircleDollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { DigitalBank } from "@shared/schema";

const DigitalBankComparison = () => {
  const { t } = useTranslation();
  
  const { data: banks, isLoading, isError } = useQuery<DigitalBank[]>({
    queryKey: ["/api/digital-banks"],
  });

  const getBankLogo = (bankName: string) => {
    switch (bankName.toLowerCase()) {
      case "wise":
        return <CircleDollarSign className="h-8 w-8 text-primary-600" />;
      case "paysera":
        return <CreditCard className="h-8 w-8 text-green-600" />;
      case "revolut":
        return <Building className="h-8 w-8 text-blue-600" />;
      default:
        return <Landmark className="h-8 w-8 text-gray-600" />;
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Landmark className="text-primary-600 mr-2 h-5 w-5" />
        {t("digitalBanks.title")}
      </h2>
      
      <Card className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">{t("digitalBanks.service")}</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-700">{t("digitalBanks.transferFees")}</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-700">{t("digitalBanks.exchangeRate")}</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-700">{t("digitalBanks.transferSpeed")}</th>
                <th className="py-3 px-4 font-semibold text-sm text-gray-700">{t("digitalBanks.supportedCountries")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Skeleton className="h-8 w-8 mr-3 rounded" />
                        <div>
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-3 w-24 mt-1" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4"><Skeleton className="h-5 w-16" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-5 w-20" /></td>
                    <td className="py-3 px-4"><Skeleton className="h-5 w-16" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-red-500">
                    {t("errors.fetchingBanks")}
                  </td>
                </tr>
              ) : (
                banks?.map((bank) => (
                  <tr key={bank.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {getBankLogo(bank.name)}
                        </div>
                        <div>
                          <p className="font-medium">{bank.name}</p>
                          <p className="text-xs text-gray-500">{bank.website}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-green-600">{bank.transferFees}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{bank.exchangeRate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{bank.transferSpeed}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{bank.supportedCountries}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};

export default DigitalBankComparison;
