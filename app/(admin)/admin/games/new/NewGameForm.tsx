"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Input,
  Select,
  Textarea,
  FileDropzone,
  SpecsEditor,
  useAlert,
} from "@/components/ui";
import {
  createGameWithUrlsAction,
  presignGameImageAction,
  presignGameVideoAction,
} from "@/actions/admin";
import { uploadGameMedia } from "@/lib/game-upload";
import { GameMetadataSchema } from "@/schemas/admin/game.schema";
import type { Category } from "@/types";

type Props = Readonly<{
  categories: Category[];
  redirectTo?: string;
}>;

export function NewGameForm({
  categories,
  redirectTo = "/admin/games",
}: Props) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [minimumSpecs, setMinimumSpecs] = useState("");
  const [recommendedSpecs, setRecommendedSpecs] = useState("");

  const busy = pending || uploading !== null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("minimumSpecs", minimumSpecs);
    formData.set("recommendedSpecs", recommendedSpecs);

    const parsed = GameMetadataSchema.safeParse({
      name: formData.get("name"),
      originalPrice: formData.get("originalPrice"),
      discountPercent: formData.get("discountPercent") || 0,
      description: formData.get("description"),
      state: formData.get("state"),
      launchDate: formData.get("launchDate"),
      categoryNames: formData.getAll("categories").map(String),
      minimumSpecs,
      recommendedSpecs,
    });
    if (!parsed.success) {
      showAlert({
        variant: "destructive",
        title: "Could not create the product",
        description: parsed.error.issues[0]?.message ?? "Invalid data",
      });
      return;
    }

    // El nombre determina la key en R2 ({slug}/{kind}/...), asi que se
    // valida antes de pedir ninguna firma.
    const name = parsed.data.name;

    try {
      setUploading("Uploading files...");
      const media = await uploadGameMedia({
        name,
        image,
        banner,
        video,
        gallery,
        presignVideo: presignGameVideoAction,
        presignImage: presignGameImageAction,
        onProgress: setUploading,
      });

      setUploading("Saving the product...");
      startTransition(async () => {
        const result = await createGameWithUrlsAction(parsed.data, media);
        if (!result.ok) {
          showAlert({
            variant: "destructive",
            title: "Could not create the product",
            description: result.error ?? "Try again",
          });
          return;
        }
        showAlert({
          variant: "default",
          title: "Product created",
          description: "The game was created successfully",
        });
        router.push(redirectTo);
        router.refresh();
      });
    } catch (err) {
      setUploading(null);
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
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className={labelCls}>
          Name
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          minLength={1}
          maxLength={50}
          placeholder="Game title"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="originalPrice" className={labelCls}>
            Price (USD)
          </label>
          <Input
            id="originalPrice"
            name="originalPrice"
            type="number"
            step="0.01"
            min="0"
            required
            placeholder="29.99"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="discountPercent" className={labelCls}>
            Discount (%)
          </label>
          <Input
            id="discountPercent"
            name="discountPercent"
            type="number"
            min="0"
            max="100"
            placeholder="0"
          />
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
          rows={4}
          placeholder="Game description..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="state" className={labelCls}>
            State
          </label>
          <Select id="state" name="state" defaultValue="AVAILABLE">
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="COMING_SOON">COMING_SOON</option>
            <option value="DISCONTINUED">DISCONTINUED</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="launchDate" className={labelCls}>
            Launch date
          </label>
          <Input id="launchDate" name="launchDate" type="date" required />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className={labelCls}>Categories</span>
        <div className="grid grid-cols-3 gap-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-md p-3 max-h-40 overflow-y-auto">
          {categories.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 text-sm text-[#FAFAFA] cursor-pointer"
            >
              <input
                type="checkbox"
                name="categories"
                value={c.name}
                className="accent-[#007AFF]"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

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

      <div className="flex flex-col gap-4 border-t border-[#2A2A2A] pt-4">
        <FileDropzone
          kind="image"
          value={image}
          onChange={(v) => setImage(Array.isArray(v) ? (v[0] ?? null) : v)}
          required
        />
        <FileDropzone
          kind="banner"
          value={banner}
          onChange={(v) => setBanner(Array.isArray(v) ? (v[0] ?? null) : v)}
        />
        <FileDropzone
          kind="video"
          value={video}
          onChange={(v) => setVideo(Array.isArray(v) ? (v[0] ?? null) : v)}
        />
        <FileDropzone
          kind="gallery"
          value={gallery}
          onChange={(v) => setGallery(Array.isArray(v) ? v : v ? [v] : [])}
          maxFiles={10}
        />
      </div>

      {!image && (
        <p className="text-xs text-[#FF6B6B]">
          A main image is required to create the product.
        </p>
      )}

      {uploading && <p className="text-xs text-[#8A8A8A]">{uploading}</p>}

      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={busy || !image}
          className="bg-[#007AFF] hover:bg-[#1ea4ff] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
        >
          {busy ? (uploading ?? "Creating...") : "Create product"}
        </button>
        <Link
          href={redirectTo}
          className="text-[#8A8A8A] hover:text-white text-sm px-4 py-2.5"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
