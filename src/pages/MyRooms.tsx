
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthContext } from '../context/auth'
import  type { RoomType } from '../types/Room'
import Navbar from '../components/Navbar'

 const MyRooms = () => {
  const { user } = useAuthContext()
  const [rooms, setRooms] = useState<RoomType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMyRooms()
  }, [])

  const fetchMyRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRooms(data || [])
    } catch (error) {
      alert('Error loading rooms: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  const deleteRoom = async (roomId: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId)

      if (error) throw error

      setRooms(rooms.filter(room => room.id !== roomId))
      alert('✅ Room deleted successfully')
    } catch (error) {
      alert('❌ Error deleting room: ' + (error instanceof Error ? error.message : String(error)))
    }
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Rooms</h1>
            <p className="text-gray-600">Manage your room listings</p>
          </div>
          <Link
            to="/add-room"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add New Room
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading your rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <p className="text-gray-600 text-lg mb-4">You haven't added any rooms yet</p>
            <Link
              to="/add-room"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Room
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map(room => (
              <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48">
                  {room.images && room.images.length > 0 ? (
                    <img
                      src={room.images[0]}
                      alt={room.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">🏠</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {room.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3">
                    📍 {room.location}, {room.city}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{room.rent_price.toLocaleString()}/mo
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {room.property_type}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/room/${room.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => deleteRoom(room.id)}
                      className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


export default MyRooms;
