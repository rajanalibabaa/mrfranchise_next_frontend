"use client";
import React from "react";
import { List } from "@mui/material";
import SuggestionSection from "./SuggestionSection";

const SuggestionList = ({ suggestions, handleSelectedSuggestionData }) => {
  if (!suggestions) return null;

  return (
    <List disablePadding>
      <SuggestionSection
        title="Tags"
        items={suggestions.tags}
        labelKey="tag"
        handleSelectedSuggestionData={handleSelectedSuggestionData}
      />

      <SuggestionSection
        title="Categories"
        items={suggestions.categories}
        labelKey="category"
        handleSelectedSuggestionData={handleSelectedSuggestionData}
      />
      <SuggestionSection
        title="Brands"
        items={suggestions.brands}
        labelKey="brandName"
        handleSelectedSuggestionData={handleSelectedSuggestionData}
      />

      <SuggestionSection
        title="Companies"
        items={suggestions.companies}
        labelKey="companyName"
        handleSelectedSuggestionData={handleSelectedSuggestionData}
      />

      <SuggestionSection
        title="Industries"
        items={suggestions.industries}
        labelKey="industry"
        handleSelectedSuggestionData={handleSelectedSuggestionData}
      />
    </List>
  );
};

export default SuggestionList;
