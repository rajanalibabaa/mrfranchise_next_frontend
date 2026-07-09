import { useState, useEffect, useMemo } from "react";

const API = "http://localhost:5000/api/v1/instantapply/all?page=1&limit=100";

export default function useLeadFilters() {
  const [leads, setLeads] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    industry: "",
    category: "",
    investment: "",
    state: "",
    district: "",
    businessType: "",
    sort: "",
    date: "",
    dateFrom: "",
    dateTo: "",
  });

  const fetchLeads = () => {
    setLoading(true);
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        const result = data.data || data;
        setLeads(result);
        setFiltered(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    let data = [...leads];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (x) =>
          x.investorName?.toLowerCase().includes(q) ||
          x.investorEmail?.toLowerCase().includes(q) ||
          x.investorPhone?.includes(q) ||
          x.industry?.toLowerCase().includes(q) ||
          x.state?.toLowerCase().includes(q) ||
          x.district?.toLowerCase().includes(q) ||
          x.category?.toLowerCase().includes(q) ||
          x.investorEnquiryModel?.toLowerCase().includes(q)
      );
    }

    if (filters.industry)
      data = data.filter((x) => x.industry === filters.industry);
    if (filters.category)
      data = data.filter((x) => x.category === filters.category);
    if (filters.investment)
      data = data.filter((x) => x.investmentRange === filters.investment);
    if (filters.state)
      data = data.filter((x) => x.state === filters.state);
    if (filters.district)
      data = data.filter((x) => x.district === filters.district);
    if (filters.businessType)
      data = data.filter(
        (x) => x.investorEnquiryModel === filters.businessType
      );

    if (filters.date) {
      const now = new Date();
      const days =
        filters.date === "3"
          ? 3
          : filters.date === "7"
          ? 7
          : filters.date === "30"
          ? 30
          : 90;
      data = data.filter((item) => {
        const created = new Date(item.createdAt);
        const diff = (now - created) / (1000 * 60 * 60 * 24);
        return diff <= days;
      });
    }

    if (filters.dateFrom) {
      const from = new Date(filters.dateFrom);
      data = data.filter((item) => new Date(item.createdAt) >= from);
    }
    if (filters.dateTo) {
      const to = new Date(filters.dateTo);
      to.setHours(23, 59, 59, 999);
      data = data.filter((item) => new Date(item.createdAt) <= to);
    }

    if (filters.sort === "asc") {
      data.sort((a, b) =>
        (a.investorName || "").localeCompare(b.investorName || "")
      );
    } else if (filters.sort === "desc") {
      data.sort((a, b) =>
        (b.investorName || "").localeCompare(a.investorName || "")
      );
    } else if (filters.sort === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filters.sort === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFiltered(data);
  }, [filters, leads, searchQuery]);

  const activeFilterCount = useMemo(() => {
    return (
      Object.values(filters).filter((v) => v !== "").length +
      (searchQuery.trim() ? 1 : 0)
    );
  }, [filters, searchQuery]);

  const clearAllFilters = () => {
    setFilters({
      industry: "",
      category: "",
      investment: "",
      state: "",
      district: "",
      businessType: "",
      sort: "",
      date: "",
      dateFrom: "",
      dateTo: "",
    });
    setSearchQuery("");
  };

  return {
    leads,
    filtered,
    loading,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    activeFilterCount,
    clearAllFilters,
  };
}