import Header from "../../components/Header"
import { FiTrash2, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { users } from "../../constants";

    // id: 1,
    // name: "John Doe",
    // email: "john.doe@example.com",
    // imageUrl: "/assets/images/david.webp",
    // dateJoined: formatDate("2025-01-01"),
    // itineraryCreated: 10,
    // status: "user",

const AllUsers = () => {
  return (
    <main className="w-full min-h-screen  flex flex-col gap-10 max-w-7xl mx-auto px-4 lg:px-8">
      <Header title="All Users" description="Manage all users here" />
      <section className="">
        {/* --- Table Section --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date Joined</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Itinerary Created</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                <td className="py-4 px-4 flex items-center gap-3">
                  <img src={user.imageUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600">{user.email}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{user.dateJoined}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{user.itineraryCreated}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.status === "Admin" ? "bg-gray-100 text-gray-600" : "bg-green-50 text-green-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-right">
                  <button className="text-gray-400 hover:text-red-500 transition-colors">
                    {/* CHANGE 3: Trash Icon */}
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Pagination Section --- */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-200">
          {/* CHANGE 4: Chevron Left */}
          <FiChevronLeft size={16} />
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-sm rounded">1</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-sm rounded">2</button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-sm rounded">3</button>
          <span className="text-gray-400 px-1">...</span>
          <button className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-sm rounded">6</button>
        </div>

        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-200">
          Next
          {/* CHANGE 5: Chevron Right */}
          <FiChevronRight size={16} />
        </button>
      </div>




      </section>
    </main>
  )
}

export default AllUsers