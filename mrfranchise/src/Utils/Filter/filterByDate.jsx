export const dateFilterOptions = [
  { value: 'all', label: 'All Time' },
  { value: '7', label: 'Last 7 Days' },
  { value: '30', label: 'Last 30 Days' },
  { value: '90', label: 'Last 90 Days' },
  { value: '180', label: 'Last 180 Days' }
];

export const filterByDate = (items, dateFilter) => {
  if (dateFilter === 'all' || !items) return items;
  
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(dateFilter));
  
  return items.filter(item => {
    const itemDate = new Date(item.createdAt || item.apply?.createdAt || item.like?.createdAt);
    return itemDate >= daysAgo;
  });
};