import React from "react";

const Loading = () => {
  return (
    <>
      <div className="bg-black flex justify-center items-center h-screen">
        <div class="lds-facebook">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Loading;
