import mongoose from "mongoose";

const entrepriseSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom de l'entreprise est obligatoire"],
      unique: true,
      trim: true,
      minlength: [2, "Le nom doit contenir au moins 2 caractères"],
      maxlength: [100, "Le nom ne peut pas dépasser 100 caractères"],
    },
    adresse: {
      type: String,
      required: false,
      trim: true,
      maxlength: [200, "L'adresse ne peut pas dépasser 200 caractères"],
    },
    secteur: {
      type: String,
      required: false,
      trim: true,
      maxlength: [50, "Le secteur ne peut pas dépasser 50 caractères"],
    },
    site_web: {
      type: String,
      required: false,
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true; // Champ optionnel
          return /^https?:\/\/.+/.test(v);
        },
        message: "Format d'URL invalide (doit commencer par http:// ou https://)"
      }
    },
    description: {
      type: String,
      required: false,
      trim: true,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
    },
    logo: {
      type: String,
      required: false,
      trim: true,
      default: null
    },
    date_creation: {
      type: Date,
      default: Date.now,
    },
  },
  { 
    timestamps: true,
    versionKey: false // Désactiver le champ __v
  }
);

// Index pour améliorer les performances de recherche
entrepriseSchema.index({ nom: 1 });
entrepriseSchema.index({ secteur: 1 });

const Entreprise = mongoose.model("Entreprise", entrepriseSchema);
export default Entreprise;