import Header from "../../components/Header";
import {
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import Chip from "../../components/Chip";
import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/auth";
import { formatDate } from "../../lib/utils";

const AllUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllUsers(page, 10);
        const allUsers = response.data?.users || [];
        const filteredUsers = allUsers.filter((user: any) => !user.roles.includes("SUPERADMIN"));
        setUsers(filteredUsers);
        setTotalPages(response.data?.totalPages || 1);
      } catch (error) {
        setError("Failed to fetch users");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
              page === i
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Show first page
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageClick(1)}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
            page === 1
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          1
        </button>
      );

      // Show ellipsis or pages around current page
      if (page > 3) {
        buttons.push(
          <span key="ellipsis1" className="text-gray-400 px-1">
            ...
          </span>
        );
      }

      // Show pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageClick(i)}
            className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
              page === i
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {i}
          </button>
        );
      }

      // Show ellipsis before last page
      if (page < totalPages - 2) {
        buttons.push(
          <span key="ellipsis2" className="text-gray-400 px-1">
            ...
          </span>
        );
      }

      // Show last page
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageClick(totalPages)}
          className={`w-8 h-8 flex items-center justify-center text-sm rounded ${
            page === totalPages
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };


  const getRoleLabel = (roles: string[]) => {
    if (roles.includes("ADMIN")) return "Admin";
    return "User";
  };

  const getRoleVariant = (roles: string[]) => {
    if (roles.includes("ADMIN")) return "success";
    return "default";
  };

  return (
    <main className="w-full min-h-screen flex flex-col gap-10 max-w-7xl mx-auto px-4 lg:px-8">
      <Header title="All Users" description="Manage all users here" />
      <section>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Date Joined
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="py-4 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-blue-50 transition-colors group"
                    >
                      <td className="py-4 px-4 flex items-center gap-3">
                        <img
                          src={user.profileimg || "/assets/images/default-avatar.png"}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {user.name}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(user.joinedAt)}
                      </td>
                      <td className="py-4 px-4">
                        <Chip
                          className="py-0.5"
                          label={getRoleLabel(user.roles)}
                          variant={getRoleVariant(user.roles)}
                        />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Section */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`flex items-center gap-1 text-sm px-4 py-2 rounded-lg bg-white border-0 drop-shadow-xl ${
                  page === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700 hover:scale-105"
                }`}
              >
                <FiChevronLeft size={16} />
                Previous
              </button>

              <div className="flex items-center gap-1">
                {renderPaginationButtons()}
              </div>

              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`flex items-center gap-1 text-sm px-4 py-2 rounded-lg bg-white border-0 drop-shadow-xl ${
                  page === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:text-gray-700 hover:scale-105"
                }`}
              >
                Next
                <FiChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default AllUsers;
