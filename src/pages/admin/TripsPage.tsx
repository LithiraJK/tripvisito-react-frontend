import Header from "../../components/Header"

const TripsPage = () => {

  return (
    <main className="w-full min-h-screen  flex flex-col gap-10 max-w-7xl mx-auto px-4 lg:px-8">
      <Header title="Trips" description="Manage all trips here" ctaText="Create a Trip" ctaURL="/trip/create" />
      Ai Trips Page Content
    </main>
  )
}

export default TripsPage