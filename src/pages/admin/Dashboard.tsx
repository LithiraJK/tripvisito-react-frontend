import Header from "../../components/Header"

const Dashboard = () => {

  const user = {
    name: "Lithira"
  };

  return (
    <main>
      <Header title={`Welcome, ${user?.name ?? 'Guest'} 👋`} description="Track activity, trends and popular destinations" />
      Dashboard Page Content
    </main>
  )
}

export default Dashboard