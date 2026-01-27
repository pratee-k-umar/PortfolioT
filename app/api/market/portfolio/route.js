import Portfolio from "@/models/portfolio";
import { connectToDB } from "@/utils/database";

export const POST = async (req) => {
    const credentials = await req.json();
    console.log("API received credentials:", credentials);
    console.log("Stock:", credentials.stock);
    console.log("Quote:", credentials.quote);
    try {
        await connectToDB();

        // normalize incoming shapes: some clients send { selectedStock, selectedStockPrice }
        // while others send { stock, quote }
        const stock = credentials.selectedStock || credentials.stock || {};
        const quote = credentials.selectedStockPrice || credentials.quote || {};

        // Accept multiple possible id keys from client
        const creatorId =
            credentials.id ||
            credentials.creator ||
            credentials.user ||
            credentials.userId;
        if (!creatorId) {
            return new Response(
                JSON.stringify({
                    error: "Missing user id (creator) in request",
                }),
                { status: 400 },
            );
        }

        let portfolio = await Portfolio.findOne({ creator: creatorId });
        if (!portfolio)
            portfolio = new Portfolio({ creator: creatorId, holdings: [] });

        // Validate required holding fields
        const symbol = (stock.symbol || "").toString();
        const companyName = (
            stock.companyName ||
            stock.name ||
            stock.description ||
            ""
        ).toString();
        const price = Number(quote.c ?? quote.price ?? 0);
        const quantity = Number(credentials.quantity ?? credentials.qty ?? 0);
        const amount = Number(
            credentials.amount ?? credentials.total ?? price * quantity,
        );

        console.log("Validation values:", {
            symbol,
            companyName,
            price,
            quantity,
            amount,
        });

        if (
            !symbol ||
            !companyName ||
            !Number.isFinite(price) ||
            price <= 0 ||
            !Number.isFinite(quantity) ||
            quantity <= 0 ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            console.log("Validation failed for:", {
                symbol: !!symbol,
                companyName: !!companyName,
                price: price > 0,
                quantity: quantity > 0,
                amount: amount > 0,
            });
            return new Response(
                JSON.stringify({
                    error: "Invalid or missing holding data (symbol, companyName, price, quantity, amount required)",
                }),
                { status: 400 },
            );
        }

        portfolio.holdings.push({
            symbol,
            companyName,
            price,
            quantity,
            amount,
            purchaseDate: new Date(),
        });

        await portfolio.save();
        return new Response(JSON.stringify(portfolio), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
        });
    }
};
