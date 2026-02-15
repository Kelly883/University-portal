import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import prisma from "@/lib/prisma";

export default async function StudentPaymentsPage() {
  const session = await auth();
  
  const payments = await prisma.payment.findMany({
    where: { studentId: session?.user?.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-accent dark:text-university-gold">Financials</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-500">$1,250.00</p>
            <button className="mt-4 bg-accent text-university-gold px-4 py-2 rounded uppercase font-bold text-sm hover:bg-black transition-colors">
              Make Payment
            </button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      payment.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                      payment.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {payment.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-slate-500">
                    No payment history found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
