import mongoose from "mongoose";

const candidatureSchema = new mongoose.Schema({
  id_offre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offre",
    required: true,
  },
  id_candidat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Candidat",
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  date_postulation: {
    type: Date,
    default: Date.now,
  },
  etat: {
    type: String,
    enum: ["en attente", "accepte", "refuse", "entretien"],
    default: "en attente",
  },
});

const Candidature = mongoose.model("Candidature", candidatureSchema);
export default Candidature;
