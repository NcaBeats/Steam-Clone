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
          className="text-sm text-muted-foreground hover:text-foreground self-start"
        >
          ← Back to users
        </Link>
        <h1 className="text-2xl font-bold text-foreground">New user</h1>
        <p className="text-sm text-muted-foreground">
          Create a new user account. They will receive a default profile and
          wallet.
        </p>
      </header>

      <NewUserForm />
    </div>
  );
};

export default NewUserPage;
