import { createSlice } from "@reduxjs/toolkit";

const brandSlice = createSlice({
    name: "allbrands",
    initialState: {
        data: [],
        loading: false,
        error: null,
        toggleLikedata : null
    },
    reducers: {
        fetchAllBrands(state, action) {
            state.data = action.payload;  
            state.loading = true;
        },
        toggleBrandLike(state, action) {
            const singleData = action.payload;
            state.toggleLikedata = singleData
            state.data = state.data.map(brand => {
                if (brand.uuid === singleData.brandId) {
                    return {
                        ...brand,
                        isLiked: !brand.isLiked,
                    };
                }
                return brand;
            });
        },
        toggleShortlist(state, action) {
            const singleData = action.payload;
            state.toggleLikedata = singleData
            state.data = state.data.map(brand => {
                if (brand.uuid === singleData.brandId) {
                    return {
                        ...brand,
                        isShortListed: !brand.isShortListed,
                    };
                }
                return brand;
            });
        }
    }
});

export const { 
    fetchAllBrands,
    toggleBrandLike,
    toggleShortlist
} = brandSlice.actions;

export default brandSlice.reducer;