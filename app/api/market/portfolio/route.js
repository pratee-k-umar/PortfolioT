import Portfolio from "@/models/portfolio";
import { connectToDB } from "@/utils/database";

export const POST = async (req) => {
  const { user, stock, description, price, quantity, amount } = await req.json();
  try {
    await connectToDB();
    let portfolio = await Portfolio.findOne({ user: user });
    if (!portfolio) portfolio = new Portfolio({ user: user, holdings: [] });
    portfolio.holdings.push({
      symbol: stock,
      companyName: description,
      price: price,
      quantity: quantity,
      amount: amount,
      purchaseDate: new Date(),
    });
    await portfolio.save();
    return new Response(JSON.stringify(portfolio), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}