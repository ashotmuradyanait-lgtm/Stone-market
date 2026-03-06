import React from "react";

function Header() {
  return (
        <div className= "flex gap-80 p-4">
            <img src="https://www.stonemarket.am/icons/logo-primary.svg" alt="" />
            <div className="justify-between flex gap-8">
                <p className="font-GHEAGrpalatReg font-bold">Գլխավոր</p>
                <p className="font-GHEAGrpalatReg font-bold">Խանութ</p>
                <p className="font-GHEAGrpalatReg font-bold">Դիզայներներ</p>
                <p className="font-GHEAGrpalatReg font-bold">Մեր մասին</p>
                <p className="font-GHEAGrpalatReg font-bold">Կապ</p>
            </div>
        </div>
  );
}   

export default Header;