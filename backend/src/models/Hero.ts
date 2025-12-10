import mongoose, { Document, Schema } from "mongoose";

export interface IHero extends Document {
  nom: string;
  alias?: string;
  univers: "Marvel" | "DC" | "Autre";
  pouvoirs: string[];
  description?: string;
  image?: string;
  origine?: string;
  premiereApparition?: string;
  createdAt?: Date;
}

const heroSchema = new Schema<IHero>(
  {
    nom: { type: String, required: true },
    alias: { type: String },
    univers: {
      type: String,
      enum: ["Marvel", "DC", "Autre"],
      required: true
    },
    pouvoirs: { type: [String], default: [] },
    description: { type: String },
    image: { type: String },
    origine: { type: String },
    premiereApparition: { type: String }
  },
  { timestamps: true }
);

export const Hero = mongoose.model<IHero>("Hero", heroSchema);
