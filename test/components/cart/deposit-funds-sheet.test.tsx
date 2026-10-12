import { describe, test, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { DepositFundsSheet } from "@/components/cart/DepositFundsSheet";
import { depositToWalletAction } from "@/actions/wallet";
import { WALLET_UPDATE_EVENT } from "@/components/layout/WalletBalance";

vi.mock("@/actions/wallet", () => ({
  depositToWalletAction: vi.fn(),
}));

const { showAlert } = vi.hoisted(() => ({ showAlert: vi.fn() }));

vi.mock("@/components/feedback", () => ({
  useAlert: () => ({ showAlert, alerts: [], dismissAlert: vi.fn() }),
}));

const mockedDeposit = vi.mocked(depositToWalletAction);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

async function openSheet() {
  const user = userEvent.setup();
  render(<DepositFundsSheet currentBalance={5} />);
  await user.click(screen.getByRole("button", { name: /add funds/i }));
  return user;
}

describe("DepositFundsSheet eventos", () => {
  test("click en Add funds abre el sheet con el balance actual", async () => {
    await openSheet();
    expect(await screen.findByLabelText("Amount (USD)")).toBeInTheDocument();
    expect(screen.getByText(/current balance/i)).toBeInTheDocument();
  });

  test("monto inválido muestra error y no llama a la action", async () => {
    const user = await openSheet();
    const amount = await screen.findByLabelText("Amount (USD)");
    await user.clear(amount);
    await user.type(amount, "-5");
    fireEvent.click(screen.getByRole("button", { name: "Confirm deposit" }));
    await vi.waitFor(() =>
      expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Invalid amount" }),
      ),
    );
    expect(mockedDeposit).not.toHaveBeenCalled();
  });

  test("monto válido deposita, notifica y llama onSuccess", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const dispatchSpy = vi.spyOn(window, "dispatchEvent");
    mockedDeposit.mockResolvedValue({ id: 1, balance: 15 } as never);
    render(<DepositFundsSheet currentBalance={5} onSuccess={onSuccess} />);
    await user.click(screen.getByRole("button", { name: /add funds/i }));
    const amount = await screen.findByLabelText("Amount (USD)");
    await user.clear(amount);
    await user.type(amount, "10");
    fireEvent.click(screen.getByRole("button", { name: "Confirm deposit" }));
    await vi.waitFor(() => {
      expect(showAlert).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Funds added" }),
      );
      expect(mockedDeposit).toHaveBeenCalledWith(10);
      expect(onSuccess).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: WALLET_UPDATE_EVENT }),
      );
    });
    dispatchSpy.mockRestore();
  });
});
