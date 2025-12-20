import { useEffect, useState } from "react";
import Header from "../../components/Header";
import StatsCard from "../../components/StatsCard";
import TripCard from "../../components/TripCard";
import {dashboardStats } from "../../constants";
import { getMyDetails } from "../../services/auth";
import { FaPlus } from "react-icons/fa6";
import { getAllTrips } from "../../services/trip";



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
        console.log(response)
        if (isMounted) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }

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
          />

          <StatsCard
            headerTitle="Total Trips"
            total={totalTrips}
            currentMonthCount={tripsCreated.currentMonth}
            lastMonthCount={tripsCreated.lastMonth}
          />

          <StatsCard
            headerTitle="Active Users"
            total={userGrowth.total}
            currentMonthCount={userGrowth.currentMonth}
            lastMonthCount={userGrowth.lastMonth}
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
    </main>
  );
};

export default Dashboard;
