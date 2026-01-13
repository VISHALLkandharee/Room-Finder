import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuthContext } from "../context/auth";
import Navbar from "../components/Navbar";

const AddRoom = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    city: "",
    rentPrice: "",
    propertyType: "1BHK",
    tenantPreference: "Bachelor",
    contactNumber: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (!user?.id) {
      alert("❌ You must be logged in to upload images");
      return;
    }

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Max size is 5MB`);
          continue;
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `i2zy3h_0/${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        console.log("📤 Uploading:", fileName);

        const { error } = await supabase.storage
          .from("Room Images")
          .upload(fileName, file);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("Room Images").getPublicUrl(fileName);

        console.log("🔗 Public URL:", publicUrl);
        uploadedUrls.push(publicUrl);
      }

      setImages((prevImages) => [...prevImages, ...uploadedUrls]);
      alert(`✅ ${uploadedUrls.length} images uploaded successfully!`);
    } catch (error) {
      alert(
        "❌ Error uploading images: " +
          (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (images?.length === 0) {
      alert("⚠️ Please upload at least one image");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("rooms")
        .insert([
          {
            owner_id: user?.id,
            title: formData.title,
            description: formData.description,
            location: formData.location,
            city: formData.city,
            rent_price: parseInt(formData.rentPrice),
            property_type: formData.propertyType,
            tenant_preference: formData.tenantPreference,
            contact_number: formData.contactNumber,
            images: images,
          },
        ])
        .select();

      if (error) throw error;

      alert("✅ Room added successfully!");
      navigate("/my-rooms");
    } catch (error) {
      alert(
        " Error: " + (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setLoading(false);
    }
  };

  if (!profile?.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <h1 className="text-2xl font-bold mb-2">❌ Access Denied</h1>
            <p className="mb-4">Only admin users can add rooms.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">🏠 Add New Room</h1>
        <p className="text-gray-600 mb-6">
          Fill in the details to list your room
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Spacious 2BHK in Downtown"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your room, amenities, nearby facilities..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📍 Location/Area *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., Koramangala"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🏙️ City *
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="e.g., Bangalore"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                💰 Rent Price (₹/night) *
              </label>
              <input
                type="number"
                required
                value={formData.rentPrice}
                onChange={(e) =>
                  setFormData({ ...formData, rentPrice: e.target.value })
                }
                placeholder="10000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                📞 Contact Number *
              </label>
              <input
                type="tel"
                required
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
                placeholder="+91 9876543210"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                🏢 Property Type *
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) =>
                  setFormData({ ...formData, propertyType: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="1Bed">1 Bed</option>
                <option value="2Bed">2 Bed</option>
                <option value="3Bed">3 Bed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                👥 Tenant Preference *
              </label>
              <select
                value={formData.tenantPreference}
                onChange={(e) =>
                  setFormData({ ...formData, tenantPreference: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Bachelor">Bachelor</option>
                <option value="Family">Family</option>
                <option value="Girls">Girls</option>
                <option value="Working">Working Professionals</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📸 Upload Images * (Max 5MB each)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            {uploading && (
              <p className="mt-2 text-sm text-blue-600">
                ⏳ Uploading images...
              </p>
            )}

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Room ${index + 1}`}
                      className="w-full h-28 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-sm text-gray-500">
              {images?.length ?? 0} image(s) uploaded
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full cursor-pointer bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium text-lg"
          >
            {loading ? "⏳ Adding Room..." : "✨ Add Room"}
          </button>
        </form>
      </div>
    </div>
  );
}


export default AddRoom;