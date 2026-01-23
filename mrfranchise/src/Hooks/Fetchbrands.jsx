// "use client"

// import {  useMutation, useQueryClient } from "@tanstack/react-query";
//   import {  recordBrandView, toggleBrandLike } from "../Api/Brands";




// export const useToggleLike = () => {
//   const queryClient = useQueryClient();
  
//   return useMutation({
//     mutationFn: toggleBrandLike,
//     onMutate: async ({ brandId, isLiked }) => {
//       // Cancel any outgoing refetches
//       await queryClient.cancelQueries(["brands"]);
      
//       // Get current data snapshot
//       const previousBrands = queryClient.getQueryData(["brands"]);
      
//       // Optimistically update the UI
//       queryClient.setQueryData(["brands"], (old) => 
//         old?.map(brand => 
//           brand.uuid === brandId 
//             ? { ...brand, isLiked: !isLiked } 
//             : brand
//         )
//       );
      
//       return { previousBrands };
//     },
//     onError: (error, variables, context) => {
//       console.error("Like toggle failed:", error);
//       // Rollback optimistic update
//       if (context?.previousBrands) {
//         queryClient.setQueryData(["brands"], context.previousBrands);
//       }
//     },
//     onSettled: () => {
//       // Ensure data is in sync with server
//       queryClient.invalidateQueries(["brands"]);
//     }
//   });
// };
//   export const useRecordView = () => {
//     return useMutation({
//       mutationFn: recordBrandView,
//     });
//   };


'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordBrandView, toggleBrandLike } from '@/Api/Brands';

/**
 * Toggle Brand Like (Optimistic + Multi-cache safe)
 */
export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleBrandLike,

    async onMutate({ brandId, isLiked }) {
      await queryClient.cancelQueries({ queryKey: ['brands'] });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ['brands'],
      });

      previousQueries.forEach(([queryKey, data]) => {
        if (!Array.isArray(data)) return;

        queryClient.setQueryData(queryKey, old =>
          old.map(brand =>
            brand.uuid === brandId
              ? { ...brand, isLiked: !isLiked }
              : brand
          )
        );
      });

      return { previousQueries };
    },

    onError(_err, _vars, context) {
      context?.previousQueries?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },

    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ['brands'],
        refetchType: 'active',
      });
    },
  });
};

/**
 * Record Brand View (fire-and-forget)
 */
export const useRecordView = () =>
  useMutation({
    mutationFn: recordBrandView,
  });
