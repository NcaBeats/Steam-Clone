export type Region = {
  id: number;
  nombre: string;
};

export type Comuna = {
  id: number;
  nombre: string;
  regionId: number;
};
