import Link from "next/link";
import { requireAdmin } from "@/actions/admin/guard";
import { NewUserForm } from "./NewUserForm";

const NewUserPage = async () => {
  await requireAdmin();

  return (
    <div className="flex flex-col gap-6 max-w-xl">
      <header className="flex flex-col gap-1">
        <Link
          href="/admin/users"
          className="text-sm text-[#8A8A8A] hover:text-white self-start"
        >
          ← Back to users
        </Link>
        <h1 className="text-2xl font-bold text-[#FAFAFA]">New user</h1>
        <p className="text-sm text-[#8A8A8A]">
          Create a new user account. They will receive a default profile and
          wallet.
        </p>
      </header>

      <NewUserForm />
    </div>
  );
};

export default NewUserPage;
