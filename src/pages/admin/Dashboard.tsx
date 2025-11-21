import Header from "../../components/Header";
import StatsCard from "../../components/StatsCard";
import TripCard from "../../components/TripCard";

const Dashboard = () => {
  const user = { name: "Lithira" };

  const dashboardStats = {
    totalUsers: 1500,
    totalTrips: 300,
    usersJoined: { currentMonth: 218, lastMonth: 180 },
    tripsCreated: { total: 62, currentMonth: 150, lastMonth: 210 },
    userGrowth: { total: 60, currentMonth: 25, lastMonth: 20 },
  };

  const { totalUsers, usersJoined, totalTrips, tripsCreated, userGrowth } =
    dashboardStats;

  return (
    <main className="dashboard wrapper">
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

      <TripCard />
    </main>
  );
};

export default Dashboard;
