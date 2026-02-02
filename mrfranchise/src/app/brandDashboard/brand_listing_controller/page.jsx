import { Suspense } from "react";
import BrandListingEdit from "./BrandListingControllerClient";

export default function BrandListingController() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BrandListingEdit/>
        </Suspense>
    );
}