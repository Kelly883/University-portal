import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;

  switch (role) {
    case "SUPERADMIN":
      redirect("/superadmin");
    case "ADMIN":
      redirect("/admin");
    case "FACULTY":
      redirect("/faculty");
    case "STUDENT":
      redirect("/student");
    default:
      return (
        <div className="p-6">
          <h1 className="text-xl font-bold">Access Denied</h1>
          <p>Your role ({role}) does not have a configured dashboard.</p>
        </div>
      );
  }
}
