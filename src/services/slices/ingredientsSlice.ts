import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';
import { getIngredientsApi } from '@api';

export type TIngredientsState = {
  ingredients: TIngredient[];
  error: string | null;
  loading: boolean;
};

export const initialState: TIngredientsState = {
  ingredients: [],
  error: null,
  loading: false
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchBurgerIngredients',
  getIngredientsApi
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const setLoading = (state: TIngredientsState) => {
      state.loading = true;
      state.error = null;
    };

    const setData = (
      state: TIngredientsState,
      { payload }: PayloadAction<TIngredient[]>
    ) => {
      state.loading = false;
      state.ingredients = payload;
    };

    const setError = (
      state: TIngredientsState,
      { error }: { error?: { message?: string } }
    ) => {
      state.loading = false;
      state.error = error?.message || 'Ошибка загрузки';
    };

    builder
      .addCase(fetchIngredients.pending, setLoading)
      .addCase(fetchIngredients.fulfilled, setData)
      .addCase(fetchIngredients.rejected, setError);
  }
});

export default ingredientsSlice.reducer;
