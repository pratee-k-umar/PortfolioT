import { connectToDB } from "@/utils/database";
import Portfolio from "@/models/portfolio";

export const PATCH = async (req, { params }) => {
  const { stockId } = await req.json()
  try {
    await connectToDB()
    const { id } = await params
    const portfolio = await Portfolio.findOne({ creator: id })
    portfolio.holdings = portfolio.holdings.filter(
      (holding) => holding._id.toString() !== stockId
    )
    await portfolio.save()
    if (portfolio.holdings.length === 0) {
      await Portfolio.deleteOne({ creator: id })
      return new Response(JSON.stringify({ message: "Success" }), { status: 200 })
    }
    return new Response(JSON.stringify({ message: "Success" }), { status: 200 })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}