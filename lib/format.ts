export const formatPrice = (
  price: number,
  { zeroAsFree = true }: { zeroAsFree?: boolean } = {},
) => {
  if (price === 0 && zeroAsFree) return "Free";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};
