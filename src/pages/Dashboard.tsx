import { useState, useEffect } from "react";
import type { RoomType } from "../types/Room";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import RoomCard from "../components/RoomCard";
import SearchFilters from "../components/SearchFilter";


const Dashboard = () => {
  const [rooms, setRooms] = useState<RoomType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "",
    tenantPreference: "",
  });

  const fetchRooms = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("rooms")
        .select("*")
        .order("created_at", { ascending: false });

      // Apply filters
      if (filters.location) {
        query = query.ilike("location", `%${filters.location}%`);
      }
      if (filters.minPrice) {
        query = query.gte("rent_price", parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte("rent_price", parseInt(filters.maxPrice));
      }
      if (filters.propertyType) {
        query = query.eq("property_type", filters.propertyType);
      }
      if (filters.tenantPreference) {
        query = query.eq("tenant_preference", filters.tenantPreference);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRooms(data || []);
    } catch (error: any) {
      console.error("Error fetching rooms:", error);
      alert("Error loading rooms: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [filters]);

return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Find Your Perfect Room
          </h1>
          <p className="text-gray-600 text-lg">
            Search a best room for your comfort Room at YOUr prefered location..
          </p>
        </div>

        <SearchFilters filters={filters} setFilters={setFilters} />

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading rooms...</p>
          </div>
        ) : rooms?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg mb-2">😕 No rooms found</p>
            <p className="text-gray-500">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              Found <span className="font-semibold text-blue-600">{rooms?.length}</span> rooms
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms?.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
};

export default Dashboard;
