import React, { useEffect, useState } from "react";
import HeroSection from "../sections/HeroSection";

import ServicesSection from "../sections/ServicesSection";
import CoorporationPartners from "../sections/CoorporationPartners";
import WelcomeScreen from "./WelcomeScreen";
import { useSelector } from "react-redux";
import PopularVirtualTours from "../components/PopularVirtualTours";

const Property = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const user = useSelector((state) => state.Singleuser);

  useEffect(() => {
    if (user.data !== null) {
      const firstLogin = localStorage.getItem("firstLogin");

      if (!firstLogin) {
        setIsFirstLogin(true); // Show welcome screen
        localStorage.setItem("firstLogin", "true"); // Mark as not first login anymore
      }
    }
  }, []);
  return (
    <>
      {isFirstLogin && <WelcomeScreen username={user.data.username} />}
      <PopularVirtualTours />
      <CoorporationPartners />
      <ServicesSection />
    </>
  );
};

export default Property;
