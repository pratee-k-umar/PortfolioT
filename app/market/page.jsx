"use client";

import { useState, useEffect, useRef } from "react";
import { TrendingUp, TrendingDown, Plus, Search, X } from "lucide-react";
import debounce from "lodash/debounce";
import { useSession } from "next-auth/react";

export default function Market() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [stocks, setStocks] = useState([]);
  const [stockPrices, setStockPrices] = useState({});
  const [wishlistPopup, setWishlistPopup] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedStockPrice, setSelectedStockPrice] = useState([]);
  const stockForm = useRef(null);
  const [error, setError] = useState("");
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const base_url = "https://finnhub.io/api/v1";
  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
  const stockCache = {};
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
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const fetchStockData = async (symbol) => {
    if (stockCache[symbol]) {
      setStockPrices((prevPrices) => ({
        ...prevPrices,
        [symbol]: stockCache[symbol],
      }));
      return;
    }
    try {
      const res = await fetch(
        `${base_url}/quote?symbol=${symbol}&token=${apiKey}`
      );
      if (res.status === 429) {
        await delay(1000);
        return fetchStockData(symbol);
      }
      const data = await res.json();
      stockCache[symbol] = data;
      setStockPrices((prevPrices) => ({
        ...prevPrices,
        [symbol]: data,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchAllStockPrices = async () => {
    const symbols = stocks.map((stock) => stock.symbol);
    for (const symbol of symbols) {
      await delay(500);
      fetchStockData(symbol);
    }
  };
  useEffect(() => {
    if (stocks.length > 0) fetchAllStockPrices();
  }, [stocks]);
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  };
  const closeModal = () => {
    setWishlistPopup(false);
    setSelectedStock(null);
    setError("");
    stockForm.current.reset();
  };
  const handleModal = (stock, quote) => {
    setSelectedStock(stock);
    setSelectedStockPrice(quote);
    setWishlistPopup(true);
  };
  const validator = () => {
    const { quantity, amount } = stockForm.current;
    if (!quantity.value || !amount.value) {
      setError("Please fill all fields");
      return false;
    }
    return true;
  };
  const wishlistSubmit = (e) => {
    e.preventDefault();
    if (stockForm.current) {
      const formData = new FormData(stockForm.current);
      handleWishList(formData);
    }
  };
  const handleWishList = async (formData) => {
    setWishlistLoading(true);
    setError("");
    const credentials = Object.fromEntries(formData);
    if (!validator(credentials)) {
      setWishlistLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/market/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: session?.user?.id,
          stock: selectedStock.symbol,
          description: selectedStock.description,
          price: selectedStockPrice.c,
          quantity: credentials.quantity,
          amount: credentials.amount,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }
      setWishlistLoading(false);
      closeModal();
      alert("Added to wishlist...");
    } catch (error) {
      console.log(error);
      setError("Error Occurred..!");
    } finally {
      setWishlistLoading(false);
    }
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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
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
                            <button
                              onClick={() => handleModal(stock, stockData)}
                              className="p-1.5 hover:bg-gray-300 rounded-full transition-colors duration-150"
                            >
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
      {wishlistPopup && selectedStock && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            ></div>
            <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-4">
                  Add to Wishlist
                </h3>
                <div className="mt-4 space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-start gap-8">
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedStock.symbol}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedStock.description}
                        </p>
                        <div className="mt-2 inline-flex items-center rounded-full text-sm font-medium text-blue-700">
                          {selectedStockPrice.c !== undefined
                            ? `$${selectedStockPrice.c.toFixed(2)}`
                            : "—"}
                        </div>
                      </div>
                      <form ref={stockForm} className="flex-1 space-y-4">
                        <div className="space-y-3">
                          <div>
                            <input
                              type="number"
                              id="quantity"
                              name="quantity"
                              min="1"
                              placeholder="Quantity"
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-colors"
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              id="amount"
                              name="amount"
                              placeholder="Amount"
                              className="w-full px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-colors"
                            />
                          </div>
                          {error && (
                            <p className="mt-1 text-xs text-red-600">{error}</p>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      wishlistLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={wishlistSubmit}
                  >
                    {wishlistLoading ? "Adding..." : "Add"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
