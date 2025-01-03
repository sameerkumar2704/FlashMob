import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getDetails } from "@/util/fetchHandlers.jsx";

// why using middleware in redux
export const getAllProducts = createAsyncThunk(
  "global/allproducts",
  async (limit) => {
    const url = limit
      ? `http://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8081/product/all?limit=${limit}`
      : "http://ec2-16-171-29-86.eu-north-1.compute.amazonaws.com:8081/product/all";
    const res = await getDetails(url, {});
    return res;
  }
);
const intialState = {
  isDataLoading: false,
  showDialogBox: true,
  verfiying: true,
  currentUser: undefined,
  navigationDrawerState: "close",
  productsOnSale: [],
  productList: [],
  newProductOnSite: [],
  cartList: [],
  toastMessage: undefined,
  page: "registration",
};

// it consits of action fuction to set values
// Also reducers
const globalSlice = createSlice({
  name: "GlobalSlice",
  initialState: intialState,
  reducers: {
    loadingState: (state, action) => {
      state.isDataLoading = action.payload;
    },
    setStateOfDialogBox: (state, action) => {
      state.showDialogBox = action.payload;
    },
    changeVerificationState: (state, action) => {
      state.verfiying = action.payload;
    },
    currentUserInstance: (state, action) => {
      state.currentUser = action.payload;
    },
    navigationDrawerStateUpdate: (state, action) => {
      state.navigationDrawerState = action.payload;
    },
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload;
    },
    setDialogPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isDataLoading = true;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isDataLoading = false;
        state.productList = action.payload;
      })
      .addCase(getAllProducts.rejected, (state) => {
        state.isDataLoading = false;
      });
  },
});
export const {
  loadingState,
  setStateOfDialogBox,
  changeVerificationState,
  currentUserInstance,
  navigationDrawerStateUpdate,
  setToastMessage,
  setDialogPage,
} = globalSlice.actions;
export default globalSlice.reducer;
