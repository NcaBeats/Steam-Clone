"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAlert, Input, Select, Textarea } from "@/components/ui";
import { updateGameAction } from "@/actions/admin";
import type { Category, Game, GameState } from "@/types";

type Props = Readonly<{
  game: Game;
  categories: Category[];
}>;

export function GameEditForm({ game, categories }: Props) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [saving, setSaving] = useState(false);

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

  // Clamped numeric discount for calculation/submission
  const discountValue = Math.max(
    0,
    Math.min(100, Number(discountPercent) || 0),
  );

  // Compute price from originalPrice and discountValue
  const price = (() => {
    if (originalPrice <= 0) return 0;
    const finalPrice = originalPrice * (1 - discountValue / 100);
    return Math.round(finalPrice * 100) / 100;
  })();

  // Initialize all categories by name once
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setSelectedCategories((prev) =>
      prev.length > 0 ? prev : game.categories.map((c) => c.name),
    );
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      showAlert({
        variant: "destructive",
        title: "Sin categorías",
        description: "Selecciona al menos una categoría",
      });
      return;
    }
    setSaving(true);
    try {
      const result = await updateGameAction(game.id, {
        name,
        originalPrice,
        discountPercent: discountValue,
        description,
        state,
        launchDate,
        categoryNames: selectedCategories,
      });
      if (!result.ok) {
        showAlert({
          variant: "destructive",
          title: "Error al guardar",
          description: result.error ?? "No se pudo actualizar el producto",
        });
        setSaving(false);
        return;
      }
      showAlert({
        variant: "default",
        title: "Producto actualizado",
        description: `${name} se actualizó correctamente`,
      });
      router.push("/admin/games");
      router.refresh();
    } catch (e) {
      showAlert({
        variant: "destructive",
        title: "Error",
        description: e instanceof Error ? e.message : "Error desconocido",
      });
      setSaving(false);
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
            Nombre
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
            Precio original (USD)
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
            Descuento (0-100%)
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
            Estado
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
            Fecha de lanzamiento
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
          <label className={labelCls}>Precio calculado (USD)</label>
          <div className="rounded-lg bg-[#1A1A1A] px-3 py-3 text-sm font-semibold text-[#A1CD44]">
            ${price.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className={labelCls}>
          Descripción
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
        <span className={labelCls}>Categorías</span>
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

      <div className="flex items-center gap-2 mt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#007AFF] hover:bg-[#1ea4ff] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
