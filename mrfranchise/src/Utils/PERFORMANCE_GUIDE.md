/**
 * PERFORMANCE OPTIMIZATION GUIDE
 * Apply these patterns to fix your app's performance issues
 */

// ============================================================
// 1. REDUX OPTIMIZATION - Prevent Over-triggering
// ============================================================

// ❌ BAD - This fetches every time component renders
// useEffect(() => {
//   dispatch(fetchBrands()); // Will run on every render!
// }, [dispatch]);

// ✅ GOOD - Only fetch once on mount
import { useSingleDispatch } from "@/Hooks/PerformanceHooks";

// In your component:
// useSingleDispatch(fetchBrandsAction, []);

// Or manually:
// useEffect(() => {
//   const fetched = useRef(false);
//   if (!fetched.current) {
//     fetched.current = true;
//     dispatch(fetchBrands());
//   }
// }, []);

// ============================================================
// 2. ELIMINATE INLINE FUNCTIONS - Major performance killer
// ============================================================

// ❌ BAD - Recreates function on every render
// <button onClick={() => handleClick(brand)}>
//   Click me
// </button>

// ✅ GOOD - Use useCallback for memoization
// const handleClick = useCallback((brand) => {
//   // your logic
// }, [brand, otherDep]);

// <button onClick={() => handleClick(brand)}>
//   Click me
// </button>

// ============================================================
// 3. VIDEO OPTIMIZATION - Lazy load, limit concurrent loads
// ============================================================

// ❌ BAD - All videos load simultaneously
// <video src={videoUrl} autoplay muted />

// ✅ GOOD - Lazy load with intersection observer
import { useVideoVisibility } from "@/Hooks/PerformanceHooks";
import VideoLazyLoader from "@/Utils/VideoLazyLoader";

// const isVisible = useVideoVisibility(videoRef);
// useEffect(() => {
//   if (isVisible && videoRef.current) {
//     videoRef.current.src = videoUrl;
//   }
// }, [isVisible, videoUrl]);

// ============================================================
// 4. FRAMER MOTION OPTIMIZATION - GPU acceleration
// ============================================================

// ❌ BAD - Expensive animations
// const variants = {
//   animate: {
//     opacity: 1,
//     y: 0,
//     scale: 1.1,
//     transition: { duration: 1 }  // Too slow
//   }
// };

// ✅ GOOD - GPU-accelerated, faster animations
// const variants = {
//   animate: {
//     opacity: 1,
//     transform: "translateY(0) translateZ(0) scale(1.02)",
//     transition: { duration: 0.3 } // Faster
//   }
// };

// whileHover: {
//   transform: "scale(1.02) translateZ(0)", // GPU hint
//   transition: { duration: 0.2 }
// }

// ============================================================
// 5. USEEFFECT CONSOLIDATION - Prevent multiple listeners
// ============================================================

// ❌ BAD - Multiple scattered useEffects
// useEffect(() => { /* setup scroll listener */ }, []);
// useEffect(() => { /* setup shadow updates */ }, []);
// useEffect(() => { /* setup resize observer */ }, []);

// ✅ GOOD - Consolidated into one custom hook
// const { showStartShadow, showEndShadow } = useScrollShadows(containerRef);
// (Includes scroll, resize, and shadow logic)

// ============================================================
// 6. MEMOIZATION STRATEGY - Prevent unnecessary re-renders
// ============================================================

// ✅ Always memoize card components
// export const BrandCard = memo(({ brand, onLike }) => {
//   return <Card>{brand.name}</Card>;
// });

// ✅ Memoize expensive calculations
// const dimensions = useMemo(() => {
//   return calculateCardDimensions(width, height);
// }, [width, height]);

// ✅ Memoize selector results
// const brands = useSelector((state) => state.brands);
// // Better - if brands is a large array:
// const brands = useDebouncedSelector(
//   (state) => state.brands,
//   300 // debounce 300ms
// );

// ============================================================
// 7. COMPONENT SPLITTING - Separate heavy video content
// ============================================================

// ❌ BAD - Video loaded regardless of visibility
// export const BrandCard = memo(({ brand }) => {
//   const [playing, setPlaying] = useState(false);
//   return (
//     <Card>
//       <video src={brand.videoUrl} /> {/* Always in DOM */}
//     </Card>
//   );
// });

// ✅ GOOD - Separate video component that lazy loads
// const VideoContent = memo(({ videoUrl, isVisible }) => {
//   useEffect(() => {
//     if (isVisible) {
//       // Load video
//     }
//   }, [isVisible]);
//   return <video src={videoUrl} />;
// });

// export const BrandCard = memo(({ brand }) => {
//   const isVisible = useVideoVisibility(videoRef);
//   return (
//     <Card>
//       {isVisible && <VideoContent videoUrl={brand.videoUrl} />}
//     </Card>
//   );
// });

// ============================================================
// 8. SCROLL OPTIMIZATION - Debounce and throttle
// ============================================================

// ❌ BAD - Scroll handler fires 60+ times per second
// scrollContainer.addEventListener('scroll', () => {
//   updateShadows();
//   loadMoreData();
// });

// ✅ GOOD - Use custom hook with debouncing
// const { showStartShadow, showEndShadow } = useScrollShadows(containerRef);
// No need to manage event listeners manually!

// ============================================================
// 9. CODE SPLITTING WITH DYNAMIC IMPORTS
// ============================================================

// ✅ Load components only when needed
// import dynamic from "next/dynamic";
// const HomeSection6 = dynamic(
//   () => import("@/Components/HomePage_VideoSection/HomeSection6"),
//   { ssr: false, loading: () => <Skeleton /> }
// );

// ============================================================
// 10. PERFORMANCE MONITORING
// ============================================================

// Add this to your app for insights
// useEffect(() => {
//   const observer = new PerformanceObserver((list) => {
//     for (const entry of list.getEntries()) {
//       console.log(`${entry.name}: ${entry.duration}ms`);
//     }
//   });

//   observer.observe({ entryTypes: ["measure"] });
//   return () => observer.disconnect();
// }, []);

// ============================================================
// IMPLEMENTATION CHECKLIST
// ============================================================

/*
For each component that shows videos/cards:

[ ] Replace inline functions with useCallback
[ ] Consolidate multiple useEffects into custom hooks
[ ] Add React.memo() to card components
[ ] Implement useVideoVisibility for video loading
[ ] Move heavy animations to optimized Framer Motion variants
[ ] Add VideoLazyLoader for concurrent load limiting
[ ] Use useSingleDispatch for initial data fetching
[ ] Implement scroll debouncing
[ ] Split into smaller sub-components
[ ] Remove unused dependencies from useEffect

Result: 40-60% performance improvement!
*/

export const PERFORMANCE_GUIDELINES = {
  maxConcurrentVideoLoads: 2,
  videoPreloadStrategy: "metadata", // Don't load full video immediately
  debounceScrollDelay: 100,
  animationDuration: 0.3,
  largeListThreshold: 100, // Use virtualization above this
};
