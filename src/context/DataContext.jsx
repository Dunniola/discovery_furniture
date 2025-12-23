// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { useAuthContext } from "./AuthContext";
// import { toast } from "react-toastify";

// const DataContext = createContext();

// export default DataContext;

// export const DataProvider = ({ children }) => {
//   //states i want to keep
//   const { token, shouldKick } = useAuthContext();

//   //for pop up modals and other general continuos functions
//   const [move, setMove] = useState(false);
//   const [allBrands, setAllBrands] = useState(null);
//   const [query, setQuery] = useState("");
//   const [refetchHelp, setRefetchHelp] = useState(false);

//   const handleRefetchHelp = () => {
//     setRefetchHelp(!refetchHelp);
//   }

//   const handleMove = (bool) => {
//     setMove(bool);
//   };

//   const handleQuery = (search) => {
//     setQuery(search);
//   };

//   const handleAllBrands = (brands) => {
//     setAllBrands(brands);
//   };

//   const handleFileUpload = async (e) => {
//     let imgObj = e.target.files[0];
//     if (imgObj.size > 1100000) {
//       return toast.error("Maximum file size is 1mb");
//     }
//     const formdata = new FormData();
//     formdata.append("image", imgObj);
//     toast.loading("uploading image...");
//     const result = await postRequest("public-img-upload", formdata);
//     if (result.status === "success") {
//       toast.dismiss();
//       toast.success("upload successful");
//       return result.imageName;
//     } else {
//       toast.dismiss();
//       toast.error("upload failed");
//       return false;
//     }
//   };


//   const deleteRequest = (route, id) => {
//     const url = `${import.meta.env.VITE_SERVER_URL}/${route}/${id}`;
//     return axios
//       .delete(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })
//       .then((response) => {
//         console.log(response.data);
//         return response.data;
//       })
//       .catch((err) => {
//         shouldKick(err);
//         return false;
//       });
//   };

//   const getRequest = (route) => {
//     const url = `${import.meta.env.VITE_SERVER_URL}/${route}`;
//     return axios
//       .get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })
//       .then((response) => {
//         console.log(response.data);
//         return response.data;
//       })
//       .catch((err) => {
//         console.log(err);
//         shouldKick(err);
//         return false;
//       });
//   };

//   const showRequest = (route, id) => {
//     const url = `${import.meta.env.VITE_SERVER_URL}/${route}/${id}`;
//     return axios
//       .get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       })
//       .then((response) => {
//         console.log(response.data);
//         return response.data;
//       })
//       .catch((err) => {
//         shouldKick(err);
//         return false;
//       });
//   };

//   const postRequest = (route, data) => {
//     var config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `${import.meta.env.VITE_SERVER_URL}/${route}`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       data: data,
//     };

//     return axios(config)
//       .then(function (response) {
//         console.log(response.data);
//         return response.data;
//       })
//       .catch(function (e) {
//         console.log(e.response.data.message);
//         shouldKick(e);
//         return false;
//       });
//   };
//   const putRequest = (route, data) => {
//     var config = {
//       method: "put",
//       maxBodyLength: Infinity,
//       url: `${import.meta.env.VITE_SERVER_URL}/${route}`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       data: data,
//     };

//     return axios(config)
//       .then(function (response) {
//         console.log(response.data);
//         return response.data;
//       })
//       .catch(function (e) {
//         console.log(e.response.data.message);
//         shouldKick(e);
//         return false;
//       });
//   };

//   const postRequestFeedback = (route, data) => {
//     var config = {
//       method: "post",
//       maxBodyLength: Infinity,
//       url: `${import.meta.env.VITE_SERVER_URL}/${route}`,
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       data: data,
//     };

//     return axios(config)
//       .then(function (response) {
//         console.log(response.data);
//         return response.data;
//       })
//       .catch(function (e) {
//         console.log(e.response.data.message);
//         shouldKick(e);
//         return e.response.data;
//       });
// };

  

//   let contextData = {
//     move,
//     handleMove,
//     allBrands,
//     handleAllBrands,
//     deleteRequest,
//     getRequest,
//     postRequest,
//     putRequest,
//     postRequestFeedback,
//     showRequest,
//     query,
//     handleQuery,
//     refetchHelp,
//     handleRefetchHelp,
//     handleFileUpload
//   };

//   return (
//     <DataContext.Provider value={contextData}>{children}</DataContext.Provider>
//   );
// };

// export const useDataContext = () => useContext(DataContext);
