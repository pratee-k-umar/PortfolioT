import { connectToDB } from "@/utils/database";
import Portfolio from "@/models/portfolio";

export const GET = async ({ params }) => {
  try {
    await connectToDB()
    const portfolio = await Portfolio.findOne({ creator: params.id })
    let totalValue = 0;
    portfolio.holdings.forEach((holding) => {
      totalValue += holding.amount * holding.quantity
    })
    return new Response(JSON.stringify(totalValue), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}