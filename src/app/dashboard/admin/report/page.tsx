import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ReportPerShift from "./_components/ReportPerShift";
import ClientLayout from "@/components/ClientLayout";
import ReportSales from "./_components/ReportSales";

const ReportPage = () => {
  return (
    <ClientLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-2 text-start justify-between items-center p-4 border rounded-lg shadow-sm bg-white">
          <div className="w-full text-start">
            <section className="border-b">
              <h1 className="text-xl font-bold text-gray-800">Product List</h1>
              <h2 className="text-base text-gray-600">
                Content - Product List
              </h2>
            </section>
          </div>
          <Tabs defaultValue="sales" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sales">Penjualan</TabsTrigger>
              <TabsTrigger value="items">Per Item</TabsTrigger>
              <TabsTrigger value="shift">Per Shift</TabsTrigger>
              <TabsTrigger value="cashier">Per Kasir</TabsTrigger>
            </TabsList>

            <TabsContent value="sales">
              <ReportSales />
            </TabsContent>

            <TabsContent value="items">
              {/* Komponen untuk Per Item */}
            </TabsContent>

            <TabsContent value="shift">
              <ReportPerShift /> {/* Komponen Per Shift */}
            </TabsContent>

            <TabsContent value="cashier">
              {/* Komponen untuk Per Kasir */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ReportPage;
