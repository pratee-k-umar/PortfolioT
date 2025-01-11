import { Schema, model, models } from "mongoose";

const PortfolioSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  stocksymbol: {
    type: stringify,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
}, {
  timestamps: true
})

const Portfolio = models.Portfolio || model("Portfolio", PortfolioSchema)

export default Portfolio