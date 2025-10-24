import React, { useEffect, useState } from "react";
import { Briefcase, Calendar, Building2, GraduationCap, Edit2, Trash2 } from "lucide-react";

const OffreEmploi = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    niveau: "",
    nom_entreprise: "",
    date_debut: "",
    date_limite: "",
  });

  const token = typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/offres/");
        const data = await res.json();
        setOffres(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await fetch(`http://localhost:5000/api/offres/update/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        setEditingId(null);
      } else {
        await fetch("http://localhost:5000/api/offres/add", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      }

      const res = await fetch("http://localhost:5000/api/offres/");
      const data = await res.json();
      setOffres(data);
      setFormData({
        titre: "",
        description: "",
        niveau: "",
        nom_entreprise: "",
        date_debut: "",
        date_limite: "",
      });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'opération !");
    }
  };

  const handleEdit = (offre) => {
    setEditingId(offre._id);
    setFormData({
      titre: offre.titre,
      description: offre.description,
      niveau: offre.niveau,
      nom_entreprise: offre.nom_entreprise,
      date_debut: offre.date_debut.split("T")[0],
      date_limite: offre.date_limite.split("T")[0],
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
    try {
      await fetch(`http://localhost:5000/api/offres/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setOffres(offres.filter((o) => o._id !== id));
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression !");
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Chargement...</p>;

  return (
    <div className="space-y-6 p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
              <Briefcase size={40} className="text-blue-700" />
            </div>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {editingId ? "Modifier l'offre" : "Ajouter une offre"}
              </h2>
              <p className="text-gray-600">Gérez vos offres d'emploi</p>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Titre de l'offre</label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  placeholder="Titre de l'offre"
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Niveau</label>
                <input
                  type="text"
                  name="niveau"
                  value={formData.niveau}
                  onChange={handleChange}
                  placeholder="Bac+5, Senior..."
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Nom de l'entreprise</label>
                <input
                  type="text"
                  name="nom_entreprise"
                  value={formData.nom_entreprise}
                  onChange={handleChange}
                  placeholder="Nom de l'entreprise"
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Date de début</label>
                <input
                  type="date"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleChange}
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-2">Date limite</label>
                <input
                  type="date"
                  name="date_limite"
                  value={formData.date_limite}
                  onChange={handleChange}
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-500 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description de l'offre"
                  rows="4"
                  className="border border-gray-200 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-xl hover:shadow-lg transition font-medium"
            >
              {editingId ? "Enregistrer les modifications" : "Ajouter l'offre"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Liste des offres</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offres.map((offre) => (
            <div
              key={offre._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              <div className="h-24 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 relative">
                <div className="absolute -bottom-8 left-6">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-white">
                    <Briefcase size={24} className="text-blue-700" />
                  </div>
                </div>
              </div>

              <div className="pt-12 px-6 pb-6">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-800">{offre.titre}</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(offre)}
                      className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 text-green-600 rounded-lg hover:shadow transition"
                      title="Modifier"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(offre._id)}
                      className="p-2 bg-gradient-to-br from-red-50 to-rose-50 text-red-600 rounded-lg hover:shadow transition"
                      title="Supprimer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 leading-relaxed">{offre.description}</p>

                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <GraduationCap size={16} className="text-blue-700" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Niveau</p>
                      <p className="font-semibold text-gray-800 text-sm">{offre.niveau}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Building2 size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Entreprise</p>
                      <p className="font-semibold text-gray-800 text-sm">{offre.nom_entreprise}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Calendar size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Période</p>
                      <p className="font-semibold text-gray-800 text-sm">
                        {new Date(offre.date_debut).toLocaleDateString()} - {new Date(offre.date_limite).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffreEmploi;