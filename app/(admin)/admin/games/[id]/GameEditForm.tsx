"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui";
import { useAlert } from "@/components/feedback";
import { FileDropzone, SpecsEditor, Select } from "@/components/inputs";
import {
  presignGameImageAction,
  presignGameVideoAction,
  updateGameWithUrlsAction,
} from "@/actions/admin";
import { uploadGameMedia } from "@/lib/game-upload";
import { resolveVideoUrl } from "@/lib/media";
import { GameMetadataSchema } from "@/schemas/admin/game.schema";
import type { Category, Game, GameState } from "@/types";

type Props = Readonly<{
  game: Game;
  categories: Category[];
  redirectTo?: string;
}>;

export function GameEditForm({
  game,
  categories,
  redirectTo = "/admin/games",
}: Props) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const [name, setName] = useState(game.name);
  const [originalPrice, setOriginalPrice] = useState(game.originalPrice);
  const [discountPercent, setDiscountPercent] = useState(
    String(game.discountPercent),
  );
  const [description, setDescription] = useState(game.description);
  const [state, setState] = useState<GameState>(game.state);
  const [launchDate, setLaunchDate] = useState(game.launchDate.slice(0, 10));
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    game.categories.map((c) => c.name),
  );

  const [image, setImage] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);

  // Clamped numeric discount for calculation/submission
  const discountValue = Math.max(
    0,
    Math.min(100, Number(discountPercent) || 0),
  );

  // Compute price from originalPrice and discountValue
  const price =
    originalPrice > 0
      ? Math.round(originalPrice * (1 - discountValue / 100) * 100) / 100
      : 0;

  // Specs states
  const [minimumSpecs, setMinimumSpecs] = useState(game.minimumSpecs ?? "");
  const [recommendedSpecs, setRecommendedSpecs] = useState(
    game.recommendedSpecs ?? "",
  );

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const parsed = GameMetadataSchema.safeParse({
      name,
      originalPrice,
      discountPercent: discountValue,
      description,
      state,
      launchDate,
      categoryNames: selectedCategories,
      minimumSpecs,
      recommendedSpecs,
    });
    if (!parsed.success) {
      showAlert({
        variant: "destructive",
        title: "Save error",
        description: parsed.error.issues[0]?.message ?? "Invalid data",
      });
      return;
    }

    try {
      setUploading("Uploading files...");
      // Solo viajan los campos con archivo nuevo; el resto conserva lo que ya
      // habia en el backend.
      const media = await uploadGameMedia({
        name: parsed.data.name,
        image,
        banner,
        video,
        gallery,
        presignVideo: presignGameVideoAction,
        presignImage: presignGameImageAction,
        onProgress: setUploading,
      });

      setUploading("Saving changes...");
      const result = await updateGameWithUrlsAction(
        game.id,
        parsed.data,
        media,
      );
      if (!result.ok) {
        showAlert({
          variant: "destructive",
          title: "Save error",
          description: result.error ?? "Could not update the product",
        });
        setUploading(null);
        setSaving(false);
        return;
      }
      showAlert({
        variant: "default",
        title: "Product updated",
        description: `${name} updated successfully`,
      });
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setUploading(null);
      setSaving(false);
      showAlert({
        variant: "destructive",
        title: "Upload failed",
        description:
          err instanceof Error ? err.message : "Could not upload the files",
      });
    }
  };

  const labelCls = "text-xs text-[#8A8A8A] font-medium";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-6 flex flex-col gap-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="name" className={labelCls}>
            Name
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="originalPrice" className={labelCls}>
            Original price (USD)
          </label>
          <Input
            id="originalPrice"
            name="originalPrice"
            type="number"
            step="0.01"
            min="0"
            required
            value={originalPrice}
            onChange={(e) => setOriginalPrice(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="discountPercent" className={labelCls}>
            Discount (0-100%)
          </label>
          <Input
            id="discountPercent"
            name="discountPercent"
            type="number"
            min="0"
            max="100"
            placeholder="0"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="state" className={labelCls}>
            State
          </label>
          <Select
            id="state"
            name="state"
            value={state}
            onChange={(e) => setState(e.target.value as GameState)}
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="COMING_SOON">COMING_SOON</option>
            <option value="DISCONTINUED">DISCONTINUED</option>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="launchDate" className={labelCls}>
            Launch date
          </label>
          <Input
            id="launchDate"
            name="launchDate"
            type="date"
            required
            value={launchDate}
            onChange={(e) => setLaunchDate(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelCls}>Calculated price (USD)</label>
          <div className="rounded-lg bg-[#1A1A1A] px-3 py-3 text-sm font-semibold text-[#A1CD44]">
            ${price.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className={labelCls}>
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className={labelCls}>Categories</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md p-3 max-h-60 overflow-y-auto">
          {categories.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 text-sm text-[#FAFAFA] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(c.name)}
                onChange={() => toggleCategory(c.name)}
                className="accent-[#007AFF]"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#2A2A2A] pt-4">
        <p className="text-xs text-[#5A5A5A]">
          Upload files to replace the current asset. Leave fields empty to keep
          what already exists. The gallery is replaced completely if you choose
          new images.
        </p>
        <FileDropzone
          kind="image"
          value={image}
          onChange={(v) => setImage(Array.isArray(v) ? (v[0] ?? null) : v)}
          existingUrl={game.imageUrl}
        />
        <FileDropzone
          kind="banner"
          value={banner}
          onChange={(v) => setBanner(Array.isArray(v) ? (v[0] ?? null) : v)}
          existingUrl={game.bannerUrl}
        />
        <FileDropzone
          kind="video"
          value={video}
          onChange={(v) => setVideo(Array.isArray(v) ? (v[0] ?? null) : v)}
          existingUrl={game.videoUrl}
          existingPreview={resolveVideoUrl(game.videoUrl)}
        />
        <FileDropzone
          kind="gallery"
          value={gallery}
          onChange={(v) => setGallery(Array.isArray(v) ? v : v ? [v] : [])}
          maxFiles={10}
          existingUrl={game.galleryUrls[0] ?? null}
        />
      </div>

      {/* System Requirements */}
      <div className="flex flex-col gap-4 border-t border-[#2A2A2A] pt-4">
        <p className="text-xs text-[#5A5A5A]">
          System Requirements (leave blank to hide this section on the game
          page)
        </p>
        <div className="flex flex-col gap-1">
          <span className={labelCls}>Minimum Specifications</span>
          <SpecsEditor value={minimumSpecs} onChange={setMinimumSpecs} />
        </div>
        <div className="flex flex-col gap-1">
          <span className={labelCls}>Recommended Specifications</span>
          <SpecsEditor
            value={recommendedSpecs}
            onChange={setRecommendedSpecs}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={saving || uploading !== null}
          className="bg-[#007AFF] hover:bg-[#1ea4ff] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
        >
          {uploading ?? (saving ? "Saving..." : "Save changes")}
        </button>
      </div>
    </form>
  );
}
