import { useEffect, useState } from "react";
import Header from "../../components/Header";
import StatsCard from "../../components/StatsCard";
import TripCard from "../../components/TripCard";
import { dashboardStats } from "../../constants";
import { getMyDetails } from "../../services/auth";
import { FaPlus } from "react-icons/fa6";
import { getAllTrips } from "../../services/trip";
import { TripTrendsChart } from "../../components/TripTrendsChart";
import { UserGrowthChart } from "../../components/UserGrowthChart";

const { totalUsers, usersJoined, totalTrips, tripsCreated, userGrowth } =
  dashboardStats;

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [allTrips, setAllTrips] = useState<any[]>([]);

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

    getUserDetails();
    fetchAllTrips();
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
          <StatsCard
            headerTitle="Total Users"
            total={totalUsers}
            currentMonthCount={usersJoined.currentMonth}
            lastMonthCount={usersJoined.lastMonth}
            chartData={[20, 30, 40, 28, 40, 50, 60, 75]}
          />

          <StatsCard
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
            chartData={[75, 60, 42, 50, 28, 20, 15]}
          />

          <StatsCard
            headerTitle="Active Users"
            total={userGrowth.total}
            currentMonthCount={userGrowth.currentMonth}
            lastMonthCount={userGrowth.lastMonth}
            chartData={[20, 45, 28, 50, 42, 60, 75]}
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
            <UserGrowthChart />
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
      {/*
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
         
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Latest user signups</h3>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Latest trip bookings</h3>
        </div>
      </section>
    */}
    </main>
  );
};

export default Dashboard;
