import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Card({ image }) {

  const {
    setBackendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage
  } = useContext(userDataContext);

  const handleClick = async () => {
    console.log("Card clicked, image:", image);
    setSelectedImage(image);
    setFrontendImage(image);
    
    // Convert image to file for upload
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const file = new File([blob], "assistant.jpg", { type: "image/jpeg" });
      setBackendImage(file);
      console.log("Image converted to file:", file);
    } catch (err) {
      console.log("Error converting image:", err);
    }
  };

  return (
    <div
      className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] 
      bg-[#020220] border-2 border-[#0000ff66] rounded-2xl overflow-hidden 
      hover:shadow-2xl hover:shadow-blue-950 cursor-pointer 
      hover:border-4 hover:border-white
      ${selectedImage === image ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
      onClick={handleClick}
    >
      <img src={image} className="w-full h-full object-cover" alt="assistant" />
    </div>
  );
}

export default Card;