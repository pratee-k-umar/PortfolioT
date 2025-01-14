import { Schema, model, models } from "mongoose";

const PortfolioSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  holdings: [
    {
      symbol: {
        type: String,
        required: true
      },
      companyName: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      purchaseDate: {
        type: Date,
        required: true
      },
    }
  ]
}, {
  timestamps: true
})

const Portfolio = models.Portfolio || model("Portfolio", PortfolioSchema)

export default Portfolio