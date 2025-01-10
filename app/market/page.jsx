"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { TrendingUp, TrendingDown, Plus } from "lucide-react";
import debounce from "lodash/debounce";

export default function Market() {
  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const base_url = "https://finnhub.io/api/v1";
  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  const debouncedSearch = debounce((term) => {
    fetchStocks(term);
  }, 300);
  const fetchStocks = async (term) => {
    if (!term) return;
    try {
      const res = await fetch(
        `${base_url}/search?q=${term}&exchange=US&token=${apiKey}`
      );
      const data = await res.json();
      setStocks(data.result || []);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchStockData = async (symbol) => {
    try {
      const res = await fetch(
        `${base_url}/quote?symbol=${symbol}&token=${apiKey}`
      );
      const data = await res.json();
      setStockPrices((prevPrices) => ({
        ...prevPrices,
        [symbol]: data,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (stocks.length > 0) {
      const symbols = stocks.map((stock) => stock.symbol);
      symbols.forEach((symbol) => fetchStockData(symbol));
    }
  }, [stocks]);
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };
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
      <div className="container mt-5 mx-auto">
        <div className="transform transition-all duration-300">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search markets..."
              className="w-full px-4 py-3 pl-12 bg-white rounded-xl border border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all outline-none text-gray-800 placeholder-gray-400 shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-3xl p-4">
        {stocks.length > 0 ? (
          <div className="overflow-hidden rounded-xl bg-white shadow-lg flex flex-col h-[450px]">
            <div className="overflow-x-auto">
              <div className="overflow-y-auto h-full">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 z-10 bg-white">
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Symbol
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                        Price
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                        Change
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 w-20">
                        Wishlist
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stocks.map((stock) => {
                      const stockData = stockPrices[stock.symbol];
                      const priceChange = stockData
                        ? stockData.c - stockData.pc
                        : 0;
                      const percentChange =
                        stockData && stockData.pc
                          ? ((priceChange / stockData.pc) * 100).toFixed(2)
                          : 0;
                      const isPositive = priceChange >= 0;
                      return (
                        <tr
                          key={stock.symbol}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {stock.symbol}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {stock.description}
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                            {stockData && stockData.c !== undefined
                              ? `$${stockData.c.toFixed(2)}`
                              : "—"}
                          </td>
                          <td className="px-6 py-4">
                            <div
                              className={`flex items-center justify-end text-sm font-medium ${
                                isPositive ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {isPositive ? (
                                <TrendingUp className="mr-1 h-4 w-4" />
                              ) : (
                                <TrendingDown className="mr-1 h-4 w-4" />
                              )}
                              {isPositive ? "+" : ""}
                              {percentChange}%
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-150">
                              <Plus className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-white p-12 text-center text-gray-400 shadow-lg">
            Search the market
          </div>
        )}
      </div>
    </div>
  );
}
