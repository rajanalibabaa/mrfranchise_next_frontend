// src/utils/createLazyWithPreload.js
import React from "react";

export function createLazyWithPreload(loader) {
  const LazyComp = React.lazy(loader);
  LazyComp.preload = loader;
  return LazyComp;
}
