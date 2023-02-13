export type createCompanyConfig = {
  name: string;
  address: string;
  year_founded: number;
};

export type updateCompanyConfig = createCompanyConfig & {
  id: string;
};
