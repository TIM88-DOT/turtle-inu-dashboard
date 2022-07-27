import React, { useState, useEffect } from "react";
import "./navbar.css";
import img from "../assets/logo.png";
import twitterImg from "../assets/twitter.png";
import telegramImg from "../assets/telegram.png";
import { IconContext } from "react-icons";
import { useDispatch, useSelector } from "react-redux";
import { connect, startUp } from "../redux/blockchain/blockchainActions";
// import Web3 from "web3";

function Navbar() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [address, setAddress] = useState("Connect Wallet");


  const handleConnet = async (e) => {
    e.preventDefault();
    dispatch(connect());
    dispatch(startUp());
  };

  useEffect(() => {
    let account = blockchain.account;
    console.log("account = , connected", account, blockchain.connected);
    let connected = blockchain.connected;
    let address =
      connected && account
        ? account.slice(2, 6) + "..." + account.slice(38, 42)
        : "Connect Wallet";
    if (blockchain.connected) {
      setAddress(address);
    }
    // dispatch(startUp());
  }, [blockchain]);

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <div className="navbar">

          <img className="logo_img_sm" src={img} alt="" />
          <div className="nav_switch">
          <div className="socials">
            <a href={"#"} target="_blank" rel="noreferrer"><img src={twitterImg} /></a>
            <a href={"#"} target="_blank" rel="noreferrer"><img src={telegramImg} /></a>
          </div>
            <span onClick={handleConnet}>{address}</span>
          </div>
        </div>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
