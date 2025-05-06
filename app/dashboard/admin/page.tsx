import { redirect } from "next/navigation";

export default function AdminRootPage() {
    return redirect("/dashboard/admin/users");
}
