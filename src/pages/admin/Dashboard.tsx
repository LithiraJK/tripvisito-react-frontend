  import { useEffect, useState } from "react";
  import Header from "../../components/Header";
  import StatsCard from "../../components/StatsCard";
  import TripCard from "../../components/TripCard";
  import { fetchLatestUsers, getMyDetails } from "../../services/auth";
  import { FaPlus } from "react-icons/fa6";
  import { getAllTrips } from "../../services/trip";
  import { TripTrendsChart } from "../../components/TripTrendsChart";
  import { UserGrowthChart } from "../../components/UserGrowthChart";
  import {
    fetchDashboardStats,
    fetchUserGrowthPerDay,
  } from "../../services/overview";
  import Chip from "../../components/Chip";
  import { fetchLatestPayments } from "../../services/payment";
  import { cn } from "../../lib/utils";

  const Dashboard = () => {
    const [user, setUser] = useState<any>(null);
    const [allTrips, setAllTrips] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [growthData, setGrowthData] = useState({ labels: [], values: [] });
    const [latestUsers, setLatestUsers] = useState<any[]>([]);
    const [latestBookings, setLatestBookings] = useState<any[]>([]);

    useEffect(() => {
      let isMounted = true;

      const getUserDetails = async () => {
        try {
          const response = await getMyDetails();
          console.log(response);
          if (isMounted) {
            setUser(response.data);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      const fetchAllTrips = async () => {
        try {
          const response = await getAllTrips(1, 4);
          console.log("All Trips Data:", response);
          setAllTrips(response.data.trips || []);
        } catch (error) {
          console.error("Error loading popular trips:", error);
        }
      };

      const fetchStats = async () => {
        try {
          const response = await fetchDashboardStats();
          setStats(response.data);
          console.log("Dashboard Stats:", response);
        } catch (error) {
          console.error("Error fetching dashboard stats:", error);
        }
      };

      const loadLatestUsers = async () => {
        try {
          const response = await fetchLatestUsers();
          setLatestUsers(response.data);
        } catch (error) {
          console.error("Error loading latest users:", error);
        }
      };

      const fetchBookings = async () => {
          try {
              const response = await fetchLatestPayments(); 
              console.log("Latest Bookings Response:", response);
              setLatestBookings(response.data || []);
          } catch (error) {
              console.error("Error loading latest bookings:", error);
          }
      };

      const fetchGrowth = async () => {
        try {
          const response = await fetchUserGrowthPerDay();
          const rawData = response.data;

          const labels = rawData.map((item: any) => {
            const date = new Date(item._id);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          });

          const values = rawData.map((item: any) => item.count);

          setGrowthData({ labels, values });
        } catch (error) {
          console.error("Error formatting chart data:", error);
        }
      };

      getUserDetails();
      fetchAllTrips();
      fetchStats();
      fetchGrowth();
      loadLatestUsers();
      fetchBookings();

      return () => {
        isMounted = false;
      };
    }, []);

    return (
      <main className="flex flex-col gap-10 w-full pb-20 max-w-7xl mx-auto px-4 lg:px-8">
        <Header
          title={`Welcome, ${user?.name ?? "Guest"} 👋`}
          description="Track activity, trends and popular destinations"
          ctaText="Create a trip"
          ctaURL="/admin/trip/create"
          icon={<FaPlus />}
        />

        <section className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Users Card */}
            <StatsCard
              headerTitle="Total Users"
              total={stats?.users?.total || 0}
              currentMonthCount={stats?.users?.currentMonth || 0}
              lastMonthCount={stats?.users?.lastMonth || 0}
              chartData={stats?.users?.trend || []}
            />

            {/* Total Trips Card */}
            <StatsCard
              headerTitle="Total Trips"
              total={stats?.trips?.total || 0}
              currentMonthCount={stats?.trips?.currentMonth || 0}
              lastMonthCount={stats?.trips?.lastMonth || 0}
              chartData={stats?.trips?.trend || []}
            />

            {/* Active Users Card */}
            <StatsCard
              headerTitle="Active Users"
              total={stats?.active?.total || 0}
              currentMonthCount={stats?.active?.currentMonth || 0}
              lastMonthCount={stats?.active?.lastMonth || 0}
              chartData={stats?.active?.trend || []}
            />
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-9 mt-2.5">
            <h1 className="text-xl font-semibold text-black">Trips</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
              {allTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  name={trip.tripDetails?.name || ""}
                  location={trip.tripDetails?.location?.city || ""}
                  imageUrl={trip.imageUrls?.[0] || ""}
                  tags={[
                    trip.tripDetails?.budget,
                    trip.tripDetails?.travelStyle,
                    trip.tripDetails?.interests,
                  ].filter(Boolean)}
                  price={trip.tripDetails?.estimatedPrice || ""}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* User Growth Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[350px]">
            <h3 className="text-lg font-bold mb-4">User Growth</h3>
            <div className="h-[250px]">
              <UserGrowthChart
                labels={growthData.labels}
                values={growthData.values}
              />
            </div>
          </div>

          {/* Trip Trends Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[350px]">
            <h3 className="text-lg font-bold mb-4">Trip Trends</h3>
            <div className="h-[250px]">
              <TripTrendsChart />
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6">Latest user signups</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 text-sm border-b border-gray-100">
                    <th className="pb-4 font-normal">User</th>
                    <th className="pb-4 font-normal">Joined Date</th>
                    <th className="pb-4 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b border-gray-50 last:border-none"
                    >
                      <td className="py-4 flex items-center gap-3">
                        <img
                          src={user.profileimg}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-bold text-black">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-right">
                        <Chip label={user.isBlock ? "Blocked" : "Active" } variant={user.isBlock ? "danger" : "success"} />
                    
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
    <h3 className="text-lg font-bold mb-6">Latest trip bookings</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-gray-50">
            <th className="pb-4 font-medium">Trip & User</th>
            <th className="pb-4 font-medium">Amount</th>
            <th className="pb-4 font-medium text-right">Status</th>
          </tr>
        </thead>
        <tbody>
    {latestBookings.map((payment) => {
      let tripInfo = { name: "Unnamed Trip" };
      
      try {
        if (payment.tripId?.tripDetails) {
          tripInfo = typeof payment.tripId.tripDetails === 'string' 
            ? JSON.parse(payment.tripId.tripDetails) 
            : payment.tripId.tripDetails;
        }
      } catch (error) {
        console.error('Error parsing trip details:', error);
      }

      return (
        <tr key={payment._id} className="border-b border-gray-50 last:border-none">
          <td className="py-4">
            <div className="flex items-center gap-3">
              <img 
                src={payment.userId?.profileimg || '/placeholder-avatar.png'} 
                alt={payment.userId?.name || 'User'} 
                className="size-8 rounded-full object-cover" 
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-black truncate max-w-[180px]">
                  {tripInfo.name || "Unnamed Trip"}
                </span>
                <span className="text-[11px] text-gray-400">
                  {payment.userId?.email || 'N/A'}
                </span>
              </div>
            </div>
          </td>
          <td className="py-4 text-sm font-semibold text-gray-700">
            ${payment.amount?.toFixed(2) || '0.00'}
          </td>
          <td className="py-4 text-right">
            <span className={cn(
              "px-3 py-1 text-[10px] font-bold rounded-full",
              payment.status === "CONFIRMED" ? "bg-green-50 text-green-600" :
              payment.status === "PENDING" ? "bg-yellow-50 text-yellow-600" : 
              "bg-red-50 text-red-600"
            )}>
              {payment.status}
            </span>
          </td>
        </tr>
      );
    })}
  </tbody>
      </table>
    </div>
  </div>
        </section>
      </main>
    );
  };

  export default Dashboard;
