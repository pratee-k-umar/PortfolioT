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

export const PATCH = async () => {
  // TODO: implement edit endpoint
}

export const DELETE = async () => {
  // TODO: implement delete endpoint
}