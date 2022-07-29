import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startUp } from '../redux/blockchain/blockchainActions';
import Sidebar from '../components/Sidebar'
import './CSS/Account.css';
import './CSS/dashboard.css'
import { secondsToTime } from '../utils'

const Account = () => {

  const dispatch = useDispatch();
  let blockchain = useSelector((state) => state.blockchain);
  const [myValue, setMyValue] = useState(0);
  const [myBalance, setMyBalance] = useState(0);
  const [tinuPrice, setTinuPrice] = useState(0);
  const [sec, setSec] = useState({ h: "00", m: "00", s: "00" });


  var timer = 0;
  const secondes = useRef(0);

  useEffect(() => {
    let nextSellDate = blockchain.nextSellDate;
    const t =
      Math.floor(Date.now() / 1000) |
      0;
    console.log("next selluuu", nextSellDate);

    if(nextSellDate > 0){
    secondes.current = (nextSellDate - t);
    console.log("current seconds", secondes.current);
    }

    setTinuPrice(Number(blockchain.price).toFixed(7));
    if (blockchain.myBalance !== 0) {
      setMyValue(
        (Number(blockchain.price) * Number(blockchain.myBalance)).toFixed(2)
      );
      setMyBalance(Number(blockchain.myBalance).toFixed(2));
    }
  }, [blockchain]);

  useEffect(() => {
    if (timer > 0) clearInterval(timer);
    setTimeout(() => {
      timer = setInterval(countDown, 1000);
    }, 3000);
    dispatch(startUp());
  }, []);

  const countDown = () => {
    console.log("sec", secondes.current);
    if (secondes.current > 0) secondes.current--;
    setSec(secondsToTime(secondes.current));
    console.log("formatted sec", secondsToTime(secondes.current));
  };


  return (
    <div>
      <Sidebar />
      <div className="account">
        <div className="header">
          <h1>Turtle Inu Official Dashboard  </h1>
        </div>


        <div className="first_block">
          <div className="block_inner">
            <h4>Your Balance</h4>
            <div className="price"><h3>{myBalance}</h3>
              <h5>$TINU</h5></div>
          </div>
          <div className="block_inner right_block">

            <h4>TINU Price</h4>
            <div className="price"><h3>{tinuPrice}</h3>
              <h5>$USD</h5></div>
          </div>
          <div className="block_inner right_block">
            <h4>Vault Balance</h4>
            <div className="price"><h3>0</h3>
              <h5>$TINU</h5></div>

          </div>
        </div>

        <div className="head_block">


          <div className="secondary_block">
            <div className="inner_block2">
              <h4>Your next sell unlocks in</h4>
              <h5>{sec.h}:{sec.m}:{sec.s}</h5>
            </div>
            <div className="inner_block2 right_block">
              <h4>Your $TINU worth</h4>
              <h5>{myValue}$</h5>
            </div>
          </div>

          <div className="secondary_block">
            <div className="inner_block2">
              <h4>$TINU Earned</h4>
              <h5>Coming Soon</h5>
            </div>
            <div className="inner_block2 right_block">
              <h4>Vault Value (TVL)</h4>
              <h5>Coming Soon</h5>
            </div>
          </div>

          <div style={{
            display: "flex",
            justifyContent: "center"
          }} className="secondary_block">
            <div>
            </div>
            <div>
              <a href="" className="pill-btn">Buy $TINU</a>
            </div>
            <div >
            </div>
          </div>
        </div>
      </div >
    </div>
  );
};

export default Account;
