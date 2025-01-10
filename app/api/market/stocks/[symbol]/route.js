const base_url = "https://finnhub.io/api/v1";
const api_key = process.env.FINNHUB_API_KEY;

export const GET = async (req) => {
  try {
    const url = new URL(req.url);
    const symbol = url.searchParams.get("symbol");
    if (!symbol) {
      return new Response(
        JSON.stringify({ error: "Symbol is required" }),
        { status: 400 }
      );
    }
    const res = await fetch(`${base_url}/quote?symbol=${symbol}&token=${api_key}`);
    if (!res.ok) console.log("Failed to fetch stock data");
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: 200 });
  }
  catch (error) {
    console.log("Error fetching stock data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch stock data. Please try again later." }),
      { status: 500 }
    );
  }
};
