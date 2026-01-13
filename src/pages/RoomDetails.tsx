import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { RoomType } from '../types/Room'
import Navbar from '../components/Navbar'

export default function RoomDetails() {
  const { id } = useParams()
  const [room, setRoom] = useState<RoomType | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    fetchRoom()
  }, [id])

  const fetchRoom = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single()

      if (error  ) throw error
      setRoom(data)
    } catch (error) {
      alert('Error loading room: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading room details...</p>
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">Room not found</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Go back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to listings
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="relative">
            {room.images && room.images.length > 0 ? (
              <>
                <img
                  src={room.images[currentImage]}
                  alt={room.title}
                  className="w-full h-96 object-cover"
                />
                {room.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage((currentImage - 1 + room.images.length) % room.images.length)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImage((currentImage + 1) % room.images.length)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full"
                    >
                      →
                    </button>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {room.images.map((_: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            currentImage === index ? 'bg-white w-6' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
                <div className="w-full h-96 bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-6xl">🏠</span>
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {room.title}
                </h1>
                <p className="text-gray-600 text-lg flex items-center">
                  <span className="mr-2">📍</span>
                  {room.location}, {room.city}
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-4xl font-bold text-blue-600">
                  ₹{room.rent_price.toLocaleString()}
                </p>
                <p className="text-gray-600">/month</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Property Type</p>
                <p className="text-lg font-semibold text-gray-900">
                  {room.property_type}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Tenant Preference</p>
                <p className="text-lg font-semibold text-gray-900">
                  {room.tenant_preference}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Contact</p>
                <p className="font-semibold text-gray-900 text-sm md:text-base">
                  {room.contact_number}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Posted</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(room.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {room.description && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">📝 Description</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {room.description}
                </p>
              </div>
            )}

            <div className="border-t pt-6">
              <h2 className="text-2xl font-semibold mb-4">📞 Contact Owner</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`tel:${room.contact_number}`}
                  className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg text-center"
                >
                  📞 Call {room.contact_number}
                </a>
                <a
                  href={`https://wa.me/${room.contact_number.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium text-lg text-center"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}