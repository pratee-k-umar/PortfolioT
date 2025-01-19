import { connectToDB } from "@/utils/database";
import Portfolio from "@/models/portfolio";

export const GET = async (req, { params }) => {
  try {
    await connectToDB()
    const { id } = await params
    const portfolio = await Portfolio.findOne({ creator: id })
    const holdings = portfolio.holdings
    return new Response(JSON.stringify(holdings), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

export const PATCH = async (req, { params }) => {
  const { quantity, amount, stockId } = await req.json()
  try {
    await connectToDB()
    const { id } = await params
    const portfolio = await Portfolio.findOne({ creator: id })
    const holdingId = portfolio.holdings.findIndex((holding) => holding._id.toString() === stockId)
    portfolio.holdings[holdingId].quantity = quantity
    portfolio.holdings[holdingId].amount = amount
    await portfolio.save()
    return new Response(JSON.stringify({ message: 'Portfolio updated successfully' }), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}