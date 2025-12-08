import { useEffect, useState } from "react";
import Header from "../../components/Header";
import StatsCard from "../../components/StatsCard";
import TripCard from "../../components/TripCard";
import {dashboardStats, allTrips } from "../../constants";
import { getMyDetails } from "../../services/auth";

const { totalUsers, usersJoined, totalTrips, tripsCreated, userGrowth } =
  dashboardStats;

const Dashboard = () => {

   const [user, setUser] = useState<any>(null);


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

    getUserDetails();

    return () => {
      isMounted = false;
    };
  }, []);


  return (
    <main className="flex flex-col gap-10 w-full pb-20 max-w-7xl mx-auto px-4 lg:px-8">
      <Header
        title={`Welcome, ${user?.name ?? "Guest"} 👋`}
        description="Track activity, trends and popular destinations"
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
            {allTrips
              .slice(0, 4)
              .map(
                ({ id, name, imageUrls, itinerary, tags, estimatedPrice }) => (
                  <TripCard
                    id={id.toString()}
                    name={name}
                    imageUrl={imageUrls[0]}
                    location={itinerary?.[0]?.location ?? ""}
                    tags={tags}
                    price={estimatedPrice}
                  />
                )
              )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
