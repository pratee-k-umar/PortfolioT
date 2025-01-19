import Portfolio from "@/models/portfolio";
import { connectToDB } from "@/utils/database";

export const POST = async (req) => {
  const { credentials } = await req.json()
  try {
    await connectToDB()
    let portfolio = await Portfolio.findOne({ user: credentials.id })
    if(!portfolio) portfolio = new Portfolio({ user: credentials.id, holdings: [] })
    portfolio.holdings.push({
      symbol: credentials.selectedStock.symbol,
      companyName: credentials.selectedStock.companyName,
      price: credentials.selectedStockPrice.c,
      quantity: credentials.quantity,
      amount: credentials.amount,
      purchaseDate: new Date()
    })
    await portfolio.save()
    return new Response(JSON.stringify(portfolio), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({error: error.message}), { status: 500 })
  }
}