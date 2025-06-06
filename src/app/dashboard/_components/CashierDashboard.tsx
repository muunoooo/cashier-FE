"use client";

import { ArrowRightCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export const CashierDashboard = () => {
  const features = [
    {
      title: "Transaction",
      link: "/dashboard/cashier/transaction",
      description: "Start a new transaction for your customer on Mister Bear",
    },
    {
      title: "Transaction History",
      link: "/dashboard/cashier/transaction-history",
      description: "Review past transactions you've completed on Mister Bear",
    },
  ];
  return (
    <div className="mt-4 flex flex-col text-start justify-between items-start p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-lg font-bold text-gray-900">Quick Access</h2>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            link={feature.link}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

const FeatureCard = ({
  title,
  link,
  description,
}: {
  title: string;
  link: string;
  description: string;
}) => {
  const router = useRouter();

  return (
    <div
      className="p-6 bg-white text-black rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-red-500 flex flex-col justify-between"
      onClick={() => router.push(link)}
    >
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
      </div>

      <div className="flex justify-end mt-4">
        <ArrowRightCircle className="w-6 h-6 text-red-500 hover:text-red-600 transition-all" />
      </div>
    </div>
  );
};
