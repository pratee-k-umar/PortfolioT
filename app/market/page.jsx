"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Market() {
  const { data: session } = useSession()
  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const base_url = "https://finnhub.io/api/v1";
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const exchanges = ["US", "NSE", "LSE"];
        const res = exchanges.map((exchange) =>
          fetch(`${base_url}/stock/symbol?exchange=${exchange}&token=${process.env.FINNHUB_API_KEY}`)
        );
        const data = await res.json();
        setStocks(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStocks();
  }, []);
  // useEffect(() => {
  //   const lowercasedSearch = search.toLowerCase()
  //   const filtered = stocks.filter(stock => {
  //     stock.description.toLowerCase().includes(lowercasedSearch) || stock.symbol.toLowerCase().includes(lowercasedSearch)
  //   })
  //   setFilteredStocks(filtered)
  // }, [search, stocks])
  console.log(stocks);
  // if(!session) redirect("/auth/signup")
  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-12 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-5">
            <h1 className="text-5xl font-bold tracking-tight">
              Markets, everywhere
            </h1>
            <svg
              className="w-6 h-6 transform transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="container mt-5">
        <div className="transform transition-all duration-300">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search markets..."
              className="w-full px-4 py-3 pl-12 bg-white rounded-xl border border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}
