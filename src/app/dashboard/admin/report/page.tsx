import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReportPerShift from "./_components/ReportPerShift";
import ClientLayout from "@/components/ClientLayout";
import ReportSales from "./_components/ReportSales";
import ReportSalesPerItem from "./_components/ReportSalesPerItem";

const ReportPage = () => {
  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-4 p-4 border rounded-lg shadow-sm bg-white">
          <div className="w-full text-start">
            <section className="border-b">
              <h1 className="text-xl font-bold text-gray-800">Report</h1>
              <h2 className="text-base text-gray-600">Content - Report</h2>
            </section>
          </div>

          <Tabs defaultValue="sales" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="items">By Item</TabsTrigger>
              <TabsTrigger value="shift">By Shift</TabsTrigger>
            </TabsList>

            <TabsContent value="sales">
              <div className="max-w-4xl mx-auto">
                <ReportSales />
              </div>
            </TabsContent>

            <TabsContent value="items">
              <div className="max-w-4xl mx-auto">
                <ReportSalesPerItem />
              </div>
            </TabsContent>

            <TabsContent value="shift">
              <div className="max-w-4xl mx-auto">
                <ReportPerShift />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ReportPage;
