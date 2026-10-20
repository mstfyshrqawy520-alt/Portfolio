import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getDrivePortfolioData } from "@/lib/drive";
import AdminLoginClient from "@/components/admin/AdminLoginClient";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    return <AdminLoginClient />;
  }

  const data = await getDrivePortfolioData();

  return <AdminDashboardClient initialData={data} />;
}
