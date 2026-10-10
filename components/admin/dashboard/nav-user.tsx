import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    email: string;
    role: string;
  };
}) {
  const initials = user.email.slice(0, 2).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-1 py-1.5">
          <Avatar className="size-8 rounded-lg">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt="@shadcn"
              className="grayscale"
            />
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-normal">{user.email}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.role}
            </span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
