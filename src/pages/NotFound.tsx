import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className=' text-gray-400 p-4 text-center mt-10 mx-auto'>
      <h4 className=' text-2xl mb-4'>404 - Page Not Found</h4>
      <p className=' mb-4'>The page you are looking for does not exist.</p>
      <Link className="hover:text-black underline" to="/">Make a Login first</Link>
    </div>
  )
}

export default NotFound