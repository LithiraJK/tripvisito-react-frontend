import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const RegisterPage = () => {
  return (
    <main className='w-full h-screen flex justify-center items-center min-h-screen  bg-[url("src/assets/images/auth-img.webp")] bg-cover bg-no-repeat'>
      <section className="size-full bg-[rgba(255,255,255,0.3)] glassmorphism flex justify-center items-center px-4 overflow-y-auto">
        <div className="w-full max-w-6xl px-4 sm:px-8 md:px-12 py-4 bg-[rgba(255,255,255,0.4)] backdrop-blur-lg rounded-3xl my-8 space-y-6 grid grid-cols-1 md:grid-cols-2 items-center justify-center">
          <header className="md:block">
            <Link
              to="/"
              className="nav-link flex flex-row items-center space-x-2 mb-6"
            >
              <img
                src="/src/assets/icons/logo.svg"
                alt="logo"
                className="size-9"
              />
              <h1 className="text-2xl font-bold">Tripvisito</h1>
            </Link>
            <article className="bg-transparent mb-6">
              <h2 className="font-semibold">Start Your Travel Journey</h2>
              <p className="text-gray-500">
                Log in to manage your trips and explore new destinations.
              </p>
            </article>
          </header>
          <div className="w-full">
            <div className=" py-6 flex flex-col justify-center">
              <div className="relative py-3 w-sm max-w-xl mx-auto drop-shadow-xl">
                <div className="absolute inset-0 bg-linear-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 rounded-3xl"></div>
                <div className="relative px-6 py-8 sm:p-10 bg-white shadow-lg rounded-3xl">
                  <div className="w-full mx-auto">
                    <div className="mb-6">
                      <h1 className="text-2xl sm:text-3xl font-semibold mb-1">
                        Sign Up
                      </h1>
                      <p className="text-gray-500 text-sm">
                        Create your account to start your travel journey!
                      </p>
                    </div>
                    <div>
                      <div className="space-y-4">
                        <div className="relative">
                          <label
                            htmlFor="name"
                            className="text-sm font-medium text-gray-700 block mb-1"
                          >
                            Name
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            className="text-sm py-2 px-4 border rounded-lg w-full"
                            placeholder="Name"
                          />
                        </div>
                        <div className="relative">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700 block mb-1"
                          >
                            Email Address
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="text"
                            className="text-sm py-2 px-4 border rounded-lg w-full"
                            placeholder="Email address"
                          />
                        </div>
                        <div className="relative">
                          <label
                            htmlFor="password"
                            className="text-sm font-medium text-gray-700 block mb-1"
                          >
                            Password
                          </label>
                          <input
                            id="password"
                            type="password"
                            className="text-sm py-2 px-4 border rounded-lg w-full"
                            placeholder="Password"
                          />
                        </div>
                        <div className="relative pt-2">
                          <button className="w-full bg-linear-to-r from-cyan-400 to-sky-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-linear-to-r hover:from-sky-500 hover:to-cyan-400 transition-all hover:cursor-pointer">
                            Create An Account
                          </button>
                        </div>
                        <p className="text-center text-gray-500 py-2"> or </p>
                        <div className="relative">
                          <button className="w-full border border-gray-300 rounded-xl py-2 flex items-center justify-center hover:bg-gray-50 transition-all hover:cursor-pointer">
                            <FcGoogle className="mr-2 text-xl" />
                            Continue with Google
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex justify-center mt-6">
                    <p className="text-sm text-center">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-blue-500 hover:underline hover:cursor-pointer"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;
