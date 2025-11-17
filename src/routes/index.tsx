import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "../pages/LandingPage";
import { Suspense } from "react";

const Router = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
