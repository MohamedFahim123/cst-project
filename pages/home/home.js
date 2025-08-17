import { fetchData } from "../../actions/fetchData.js";

export const getAllProducts = async () => {
  const products = await fetchData("/json/products.json");
  return products;
};

export const getShopFilters = async () => {
  const filters = await fetchData("/json/shopFilters.json");
  return filters;
};

export const getAllUsers = async () => {
  const users = await fetchData("/json/allusers.json");
  return users;
};
