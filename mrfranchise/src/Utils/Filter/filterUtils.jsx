import { filterByDate } from "./filterByDate";

export const filterByInvestmentRange = (items, range) => {
  if (range === 'all' || !items) return items;
  return items.filter(item => item.investmentRange === range);
};

export const searchFilter = (items, term, fields = []) => {
  if (!term || !items) return items;
  
  const termLower = term.toLowerCase();
  return items.filter(item => 
    fields.some(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      return String(value || '').toLowerCase().includes(termLower);
    })
  );
};

export const applyFilters = (items, filters) => {
  const { date, searchTerm, searchFields, investmentRange } = filters;
  let result = [...items];
  
  if (date) result = filterByDate(result, date);
  if (searchTerm) result = searchFilter(result, searchTerm, searchFields);
  if (investmentRange) result = filterByInvestmentRange(result, investmentRange);
  
  return result;
};