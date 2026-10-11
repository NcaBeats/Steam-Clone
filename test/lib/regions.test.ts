import { describe, test, expect, vi, afterEach } from "vitest";
import { getComunasClient, getRegionsClient } from "@/lib/api/regions";

afterEach(() => {
  vi.unstubAllGlobals();
});

const mockFetch = (data: unknown, ok = true, status = 200) =>
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(""),
    }),
  );

describe("regions client", () => {
  test("getRegionsClient devuelve el catálogo tal cual (texto bonito)", async () => {
    mockFetch([
      { id: 1, nombre: "Arica y Parinacota" },
      { id: 7, nombre: "Metropolitana de Santiago" },
    ]);
    const regions = await getRegionsClient();
    expect(regions).toHaveLength(2);
    expect(regions[1]?.nombre).toBe("Metropolitana de Santiago");
  });

  test("getComunasClient pide las comunas de la región", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ id: 1, nombre: "Santiago", regionId: 7 }]),
      text: () => Promise.resolve(""),
    });
    vi.stubGlobal("fetch", fetchMock);
    const comunas = await getComunasClient(7);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/regions/7/comunas"),
    );
    expect(comunas[0]).toEqual({ id: 1, nombre: "Santiago", regionId: 7 });
  });

  test("respuesta no-array lanza ApiError", async () => {
    mockFetch({ content: [] });
    await expect(getRegionsClient()).rejects.toThrow();
  });
});
