// const base_url = "https://finnhub.io/api/v1";
// const api_key = process.env.FINNHUB_API_KEY;

// export async function GET() {
//   try {
//     const res = await fetch(`${base_url}/stock/symbol?token=${api_key}`);
//     if (!res.ok) throw new Error("Failed to fetch stocks");
//     return new Response(JSON.stringify(res), { status: 200 })
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error: "Failed to fetch stocks" }), { status: 500 });
//   }
// }
