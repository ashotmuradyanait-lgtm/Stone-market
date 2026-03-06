import React from "react";

function Header() {
  return (
        <div className= "flex gap-2">
            <img src="https://www.stonemarket.am/icons/logo-primary.svg" alt="" />
            <div>
                <p className="justify-between">Գլխավոր</p>
                <p>Խանութ</p>
                <p>Դիզայներներ</p>
                <p>Մեր մասին</p>
                <p>Կապ</p>
            </div>
        </div>
  );
}   

export default Header;