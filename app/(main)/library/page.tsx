import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LibraryCard } from "@/components/games";
import { getGames, getMyLibrary } from "@/lib/api/games";

const Library = async () => {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("token")?.value;

  if (!isLoggedIn) {
    redirect("/log-in");
  }

  const [library, allGames] = await Promise.all([getMyLibrary(), getGames()]);

  const ownedGames = library
    .map((entry) => allGames.find((g) => g.id === entry.gameId))
    .filter((g): g is NonNullable<typeof g> => g !== undefined);

  return (
    <div className="flex flex-col p-2 gap-6 w-full max-w-7xl mx-auto min-h-screen">
      <h1 className="text-2xl font-bold text-[#FAFAFA] ml-1">Your Library</h1>
      {ownedGames.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <p className="text-[#8A8A8A] text-lg">Your library is empty</p>
          <Link
            href="/"
            className="text-[#007AFF] hover:underline text-sm font-medium"
          >
            Browse the store
          </Link>
        </div>
      ) : (
        <p className="text-sm text-[#8A8A8A] ml-1">
          {ownedGames.length} game{ownedGames.length !== 1 ? "s" : ""}
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {ownedGames.map((game) => (
          <LibraryCard
            key={game.id}
            id={game.id}
            name={game.name}
            imageUrl={game.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;
