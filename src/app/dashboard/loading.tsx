import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DashboardLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-12">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-24 sm:w-32" />
          <Skeleton className="mt-2 h-4 w-16 sm:w-20" />
        </div>
        <Skeleton className="h-9 w-24 sm:w-28" />
      </div>

      <div className="mt-6 sm:mt-8 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-5 w-16 rounded-full sm:w-20" />
        ))}
      </div>

      <Card className="mt-8">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[170px] pl-6"><Skeleton className="h-4 w-16 sm:w-24" /></TableHead>
                <TableHead className="w-[180px]"><Skeleton className="h-4 w-20 sm:w-32" /></TableHead>
                <TableHead className="w-[130px]"><Skeleton className="h-4 w-14 sm:w-20" /></TableHead>
                <TableHead className="w-[110px] text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableHead>
                <TableHead className="w-[110px] text-right"><Skeleton className="ml-auto h-4 w-10 sm:w-16" /></TableHead>
                <TableHead className="w-[110px] text-right"><Skeleton className="ml-auto h-4 w-10 sm:w-16" /></TableHead>
                <TableHead className="w-[120px] text-right"><Skeleton className="ml-auto h-4 w-14 sm:w-20" /></TableHead>
                <TableHead className="w-[80px] pr-6" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3, 4].map((i) => (
                <TableRow key={i}>
                  <TableCell className="pl-6"><Skeleton className="h-4 w-28 sm:w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32 sm:w-44" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 rounded-full sm:w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-16 sm:w-20" /></TableCell>
                  <TableCell className="pr-6" />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
