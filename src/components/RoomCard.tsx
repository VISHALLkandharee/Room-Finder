import { Link } from "react-router-dom"
import type { RoomType } from "../types/Room";

interface RoomCardProps {
  room: RoomType;
}

const RoomCard = ({room} : RoomCardProps) => {
  return (
   <Link to={`/room/${room.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
        <div className="relative h-48">
          {room.images && room.images.length > 0 ? (
            <img
              src={room.images[0]}
              alt={room.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <span className="text-gray-400 text-4xl">🏠</span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold">
            {room.property_type}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">
            {room.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-3 flex items-center">
            <span className="mr-1">📍</span>
            {room.location}, {room.city}
          </p>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-2xl font-bold text-blue-600">
              ₹{room.rent_price.toLocaleString()}
              <span className="text-sm text-gray-500 font-normal">/month</span>
            </span>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
              {room.tenant_preference}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default RoomCard
