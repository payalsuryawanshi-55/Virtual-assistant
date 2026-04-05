// import React, { useContext, useRef, useState, useEffect } from "react";
// import Card from "../components/Card";
// import image1 from "../assets/image1.png";
// import image2 from "../assets/image2.jpg";
// import image4 from "../assets/image4.png";
// import image5 from "../assets/image5.png";
// import image6 from "../assets/image6.jpeg";
// import image7 from "../assets/image7.jpeg";
// import image8 from "../assets/image8.jpeg";
// import { RiImageAddLine } from "react-icons/ri";
// import { userDataContext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";
// import { MdKeyboardBackspace } from "react-icons/md";

// const images = [image1, image2, image4, image5, image6, image7, image8];

// const Customize = () => {
//   const {
//     setBackendImage,
//     frontendImage,
//     setFrontendImage,
//     selectedImage,
//     setSelectedImage,
//     userData,
//     serverUrl
//   } = useContext(userDataContext);
  
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();
//   const inputImage = useRef();

//   // Check if user already has assistants
//   const hasAssistants = userData?.arrayOfAssistants && userData.arrayOfAssistants.length > 0;

//   useEffect(() => {
//     console.log("Customize component mounted");
//     console.log("userData:", userData);
//     console.log("hasAssistants:", hasAssistants);
//   }, [userData, hasAssistants]);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setBackendImage(file);
//       const imageUrl = URL.createObjectURL(file);
//       setFrontendImage(imageUrl);
//       setSelectedImage(imageUrl);
//     }
//   };

//   const handleNext = () => {
//     if (!selectedImage && !frontendImage) {
//       alert("Please select an image first!");
//       return;
//     }
//     console.log("Moving to customize2");
//     navigate('/customize2');
//   };

//   const handleBack = () => {
//     if (!hasAssistants) {
//       alert("Please create your first assistant first!");
//       return;
//     }
//     navigate('/');
//   };

//   return (
//     <div className="h-screen w-full bg-gradient-to-t from-black to-[#020253] flex flex-col items-center overflow-hidden">
//       {/* Back Arrow - Only show if assistant exists */}
//       {hasAssistants && (
//         <MdKeyboardBackspace 
//           className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]' 
//           onClick={handleBack}
//         />
//       )}
      
//       {/* Heading */}
//       <div className="pt-8 md:pt-10 text-center px-4 flex-shrink-0">
//         <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
//           Select your <span className="text-blue-400">Assistant Image</span>
//         </h1>
//         <p className="text-gray-400 mt-2 text-sm sm:text-base">
//           Choose or upload an image for your AI assistant
//         </p>
//       </div>

//       <div className="w-full flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto scrollbar-hide">
       
//         <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
//           {images.slice(0, 5).map((img, i) => (
//             <Card key={i} image={img} index={i} />
//           ))}
//         </div>
//         <div className="flex flex-wrap justify-center gap-4 mt-4">
//           <Card image={images[5]} index={5} />
//           <Card image={images[6]} index={6} />

//           <div
//             className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px]
//               bg-[#020220] border-2 border-dashed border-[#0000ff62]
//               rounded-2xl flex items-center justify-center cursor-pointer
//               hover:shadow-2xl hover:shadow-blue-950 hover:border-white
//               hover:border-3 transition-all duration-300 
//               ${selectedImage === frontendImage && frontendImage ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}`}
//             onClick={() => inputImage.current.click()}
//           >
//             {frontendImage ? (
//               <img 
//                 src={frontendImage} 
//                 className="w-full h-full object-cover rounded-2xl" 
//                 alt="uploaded" 
//               />
//             ) : (
//               <RiImageAddLine className="text-white w-[25px] h-[25px] lg:w-[35px] lg:h-[35px]" />
//             )}
//           </div>
//           <input 
//             type="file" 
//             accept="image/*" 
//             ref={inputImage} 
//             onChange={handleImageUpload} 
//             hidden 
//           />
//         </div>

//         <div className="flex justify-center mt-8 w-full flex-shrink-0">
//           {(selectedImage || frontendImage) && (
//             <button 
//               className="px-10 py-2.5 lg:px-14 lg:py-3 
//                 bg-gradient-to-r from-blue-500 to-purple-600
//                 text-white font-bold
//                 hover:from-blue-600 hover:to-purple-700
//                 rounded-full 
//                 shadow-xl hover:shadow-2xl 
//                 transition-all duration-300 transform hover:scale-105 
//                 text-base lg:text-lg cursor-pointer"
//               onClick={handleNext}
//               disabled={isLoading}
//             >
//               Next →
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Customize;



import React, { useContext, useRef, useState, useEffect } from "react";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import image8 from "../assets/image8.jpeg";
import { RiImageAddLine } from "react-icons/ri";  // ✅ Removed RiUpload2
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

const images = [image1, image2, image4, image5, image6, image7, image8];

const Customize = () => {
  const {
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    userData,
  } = useContext(userDataContext);
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const inputImage = useRef();

  const hasAssistants = userData?.arrayOfAssistants && userData.arrayOfAssistants.length > 0;

  useEffect(() => {
    console.log("Customize component mounted");
    console.log("userData:", userData);
    console.log("hasAssistants:", hasAssistants);
  }, [userData, hasAssistants]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError("Please select an image file (jpg, png, etc.)");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }
    
    setError("");
    setIsUploading(true);
    
    try {
      setBackendImage(file);
      const imageUrl = URL.createObjectURL(file);
      setFrontendImage(imageUrl);
      setSelectedImage(imageUrl);
      console.log("Image uploaded successfully:", file.name);
    } catch (err) {
      setError("Error loading image. Please try again.");
      console.log("Error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNext = () => {
    if (!selectedImage && !frontendImage) {
      setError("Please select or upload an image first!");
      return;
    }
    setError("");
    console.log("Moving to customize2");
    navigate('/customize2');
  };

  const handleBack = () => {
    if (!hasAssistants) {
      alert("Please create your first assistant first!");
      return;
    }
    navigate('/');
  };

  return (
    <div className="h-screen w-full bg-gradient-to-t from-black to-[#020253] flex flex-col items-center overflow-hidden">
      {hasAssistants && (
        <MdKeyboardBackspace 
          className='absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px] hover:text-blue-400 transition z-10' 
          onClick={handleBack}
        />
      )}
      
      <div className="pt-8 md:pt-10 text-center px-4 flex-shrink-0">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold">
          Select your <span className="text-blue-400">Assistant Image</span>
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Choose or upload an image for your AI assistant
        </p>
      </div>

      <div className="w-full flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto scrollbar-hide">
       
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
          {images.slice(0, 5).map((img, i) => (
            <Card key={i} image={img} index={i} />
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Card image={images[5]} index={5} />
          <Card image={images[6]} index={6} />

          {/* Upload Card */}
          <div
            className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px]
              bg-[#020220] border-2 border-dashed border-[#0000ff62]
              rounded-2xl flex items-center justify-center cursor-pointer
              hover:shadow-2xl hover:shadow-blue-950 hover:border-white
              hover:border-3 transition-all duration-300 
              ${selectedImage === frontendImage && frontendImage ? "border-4 border-white shadow-2xl shadow-blue-950" : ""}
              ${isUploading ? "opacity-50 cursor-wait" : ""}`}
            onClick={() => !isUploading && inputImage.current.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white text-xs mt-2">Uploading...</span>
              </div>
            ) : frontendImage ? (
              <img 
                src={frontendImage} 
                className="w-full h-full object-cover rounded-2xl" 
                alt="uploaded" 
              />
            ) : (
              <RiImageAddLine className="text-white w-[25px] h-[25px] lg:w-[35px] lg:h-[35px]" />
            )}
          </div>
          <input 
            type="file" 
            accept="image/*" 
            ref={inputImage} 
            onChange={handleImageUpload} 
            hidden 
          />
        </div>

        {error && (
          <div className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            ⚠️ {error}
          </div>
        )}

        <div className="flex justify-center mt-8 w-full flex-shrink-0">
          {(selectedImage || frontendImage) && (
            <button 
              className="px-10 py-2.5 lg:px-14 lg:py-3 
                bg-gradient-to-r from-blue-500 to-purple-600
                text-white font-bold
                hover:from-blue-600 hover:to-purple-700
                rounded-full 
                shadow-xl hover:shadow-2xl 
                transition-all duration-300 transform hover:scale-105 
                text-base lg:text-lg cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleNext}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Next →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customize;