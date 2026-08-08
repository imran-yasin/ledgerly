import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function OrderDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-12">
      <Skeleton className="h-4 w-28" />

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-36 sm:w-52" />
          <Skeleton className="mt-2 h-4 w-24 sm:w-36" />
        </div>
        <Skeleton className="h-5 w-24 rounded-full sm:w-28" />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-10">
        <div className="space-y-8">
          <Card>
            <CardHeader><Skeleton className="h-5 w-28" /></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6"><Skeleton className="h-4 w-20" /></TableHead>
                    <TableHead className="w-[80px] text-right"><Skeleton className="ml-auto h-4 w-8" /></TableHead>
                    <TableHead className="w-[120px] text-right"><Skeleton className="ml-auto h-4 w-16" /></TableHead>
                    <TableHead className="w-[120px] pr-6 text-right"><Skeleton className="ml-auto h-4 w-16" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2].map((i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-6"><Skeleton className="h-4 w-36 sm:w-44" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-6 sm:w-8" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableCell>
                      <TableCell className="pr-6 text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><Skeleton className="h-5 w-36" /></CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="pl-6"><Skeleton className="h-4 w-20 sm:w-24" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="ml-auto h-4 w-12 sm:w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28 sm:w-36" /></TableCell>
                    <TableCell className="w-[60px] pr-6" />
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-8">
          <Card>
            <CardHeader className="pb-4"><Skeleton className="h-4 w-20" /></CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-28 sm:w-36" />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Skeleton className="h-[72px] rounded-xl" />
                <Skeleton className="h-[72px] rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
