import React, { useEffect, useState } from "react";
import HeroSection from "../sections/HeroSection";
import tourImg from "../images/tourImg.jpg";
import QualitySection from "../sections/QualitySection";
import OurGoal from "../sections/OurGoal";
import { BasicTable } from "../imports";

import ProductCategories from "../sections/ProductCategories";
import ServicesSection from "../sections/ServicesSection";
import CoorporationPartners from "../sections/CoorporationPartners";
import WelcomeScreen from "./WelcomeScreen";
import { useSelector } from "react-redux";
import Certified from "../sections/Certified";
import PopularVirtualTours from "../components/PopularVirtualTours";
import BecomeAgent from "../components/BecomeAgent";

const Home = () => {
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
      <HeroSection />
      <QualitySection />
      <OurGoal />
      <PopularVirtualTours />
      <BecomeAgent />

      {/* <BasicTable /> */}
      {/* <Certified /> */}
      <CoorporationPartners />
      <ServicesSection />
    </>
  );
};

export default Home;
