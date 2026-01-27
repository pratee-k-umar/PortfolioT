import Portfolio from "@/models/portfolio";
import { connectToDB } from "@/utils/database";

export const GET = async (req, { params }) => {
    try {
        await connectToDB();
        const { id } = await params;
        const portfolio = await Portfolio.findOne({ creator: id });
        if (!portfolio)
            return new Response(JSON.stringify([]), { status: 200 });
        const holdings = portfolio.holdings || [];
        return new Response(JSON.stringify(holdings), { status: 200 });
    } catch (error) {
        console.error("Wishlist GET error:", error);
        // Return empty array even on error to prevent frontend crashes
        return new Response(JSON.stringify([]), {
            status: 500,
        });
    }
};

export const PATCH = async (req, { params }) => {
    const { quantity, amount, stockId } = await req.json();
    try {
        await connectToDB();
        const { id } = await params;
        const portfolio = await Portfolio.findOne({ creator: id });
        if (!portfolio)
            return new Response(
                JSON.stringify({ message: "Portfolio not found" }),
                { status: 404 },
            );
        const holdingId = portfolio.holdings.findIndex(
            (holding) => holding._id.toString() === stockId,
        );
        if (holdingId === -1)
            return new Response(
                JSON.stringify({ message: "Holding not found" }),
                { status: 404 },
            );
        portfolio.holdings[holdingId].quantity = quantity;
        portfolio.holdings[holdingId].amount = amount;
        await portfolio.save();
        return new Response(
            JSON.stringify({ message: "Portfolio updated successfully" }),
            { status: 200 },
        );
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
};
