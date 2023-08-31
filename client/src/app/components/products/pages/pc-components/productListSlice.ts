import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProducts,
  fetchProductsByFilters,
  fetchBrands,
  fetchCategories,
} from "@/app/components/products/pages/pc-components/productListAPI";

interface Filter {
  [key: string]: string[];
}

interface Sort {
  [key: string]: string;
}

interface Pagination {
  [key: string]: number;
}

interface ProductState {
  products: any[];
  status: "idle" | "loading";
  totalItems: number;
  brands?: any[];
  categories?: any[];
}

const initialState: ProductState = {
  products: [],
  status: "idle",
  totalItems: 0,
  brands: [],
  categories: [],
};

export const fetchAllProductsAsync = createAsyncThunk(
  "product/fetchAllProducts",
  async () => {
    const response = await fetchAllProducts();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);
export const fetchProductsByFiltersAsync = createAsyncThunk(
  "product/fetchProductsByFilters",
  async ({
    filter,
    sort,
    pagination,
  }: {
    filter: Filter;
    sort: Sort;
    pagination: Pagination;
  }) => {
    const response = await fetchProductsByFilters(filter, sort, pagination);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);

export const fetchBrandsAsync = createAsyncThunk(
  "product/fetchBrands",
  async () => {
    const response = await fetchBrands();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);
export const fetchCategoriesAsync = createAsyncThunk(
  "product/fetchCategories",
  async () => {
    const response = await fetchCategories();
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  },
);

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    increment: (state) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload;
      })
      .addCase(fetchProductsByFiltersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByFiltersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.products = action.payload.products;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchBrandsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBrandsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.brands = action.payload;
      })
      .addCase(fetchCategoriesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoriesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.categories = action.payload;
      });
  },
});

export const { increment } = productSlice.actions;

export const selectAllProducts = (state: any) => state.product.products;
export const selectTotalItems = (state: any) => state.product.totalItems;

export const selectBrands = (state: any) => state.product.brands;

export const selectCategories = (state: any) => state.product.categories;

export default productSlice.reducer;
