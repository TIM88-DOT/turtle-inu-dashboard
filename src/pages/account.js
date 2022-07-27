import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startUp } from "../redux/blockchain/blockchainActions";
import Sidebar from "../components/Sidebar"
import "./CSS/Account.css";
import './CSS/dashboard.css'

const Account = () => {
  const secondsToTime = (secs) => {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours.toString(),
      m: minutes.toString(),
      s: seconds.toString(),
    };
    return obj;
  };
  const currentAPY = 460367;
  const dispatch = useDispatch();
  let blockchain = useSelector((state) => state.blockchain);
  const [myValue, setMyValue] = useState(0);
  const [myBalance, setMyBalance] = useState(0);
  const [apy, setAPY] = useState(0);
  const [dailyROI, setDailyROI] = useState(0);
  const [sec, setSec] = useState({ h: "00", m: "00", s: "00" });
  const [price, setPrice] = useState(0);
  const [nextRewardSAFUU, setNextRewardSafuu] = useState(0);
  const [nextRewardUSD, setNextRewardUSD] = useState(0);
  const [nextRewardYield, setNextRewardYield] = useState(0);
  const [roi1USD, setRoi1USD] = useState(0);
  const [roi5, setRoi5] = useState(0);
  const [roi5USD, setRoi5USD] = useState(0);

  var timer = 0;
  var secondes = 10 * 60;
  const countDown = () => {
    if (secondes > 0) secondes--;
    else secondes = 10 * 60;
    setSec(secondsToTime(secondes));
    //console.log("sed", secondsToTime(secondes));
  };
  useEffect(() => {
    dispatch(startUp());
  }, []);
  useEffect(() => {
    const t =
      (new Date(Date.now() + new Date().getTimezoneOffset() * 60000).getTime() /
        1000) |
      0;
    //console.log("t", t);
    if (timer > 0) clearInterval(timer);
    timer = setInterval(countDown, 1000);
    dispatch(startUp());
  }, []);
  useEffect(() => {
    let lauchtime = blockchain.launchTime;
    const t =
      (new Date(Date.now() + new Date().getTimezoneOffset() * 60000).getTime() /
        1000) |
      0;
    secondes = 600 - ((t - lauchtime) % 600);
    setPrice(Number(blockchain.price).toFixed(2));
    if (blockchain.myBalance !== 0) {
      setMyValue(
        (Number(blockchain.price) * Number(blockchain.myBalance)).toFixed(2)
      );
      setMyBalance(Number(blockchain.myBalance).toFixed(2));
    }
    setAPY(currentAPY);
    let perQuarter = (apy / 100.0 + 1) ** (1 / 144.0 / 364.0);
    //console.log("per", perQuarter)
    setNextRewardYield(((perQuarter - 1) * 100).toFixed(3));
    setNextRewardSafuu((Number(blockchain.myBalance) * (perQuarter - 1)).toFixed(3));
    setNextRewardUSD(
      (
        Number(blockchain.price) *
        Number(blockchain.myBalance) *
        (perQuarter - 1)
      ).toFixed(3)
    );
    let _roi1 = (perQuarter ** 144 - 1) * blockchain.myBalance * blockchain.price;
    let _roi1_Per = (perQuarter ** 144 - 1) * 100;
    let _roi5 = (perQuarter ** 720 - 1) * 100;
    let _roi5USD = (perQuarter ** 720 - 1) * blockchain.myBalance * blockchain.price;
    setRoi1USD(_roi1.toFixed(2));
    setDailyROI(_roi1_Per.toFixed(2));
    setRoi5(_roi5.toFixed(2));
    setRoi5USD(_roi5USD.toFixed(2));
  }, [blockchain]);
  return (
    <div>
      <Sidebar/>
      <div className="account">
        <div className="header">
          <h1>Turtle Inu Official Dashboard  </h1>
        </div>


        <div className="first_block">
          <div className="block_inner">
            <h4>You earned</h4>
            <div className="price"><h3>0</h3>
              <h5>$TINU</h5></div>
          </div>
          <div className="block_inner right_block">

            <h4>Your Balance</h4>
            <div className="price"><h3>0</h3>
              <h5>$TINU</h5></div>
          </div>
          <div className="block_inner right_block">
            <h4>Total rewards</h4>
            <div className="price"><h3>0</h3>
              <h5>$TINU</h5></div>

          </div>
        </div>

        <div className="head_block">


          <div className="secondary_block">
            <div className="inner_block2">
              <h4>Vault Unlocks in</h4>
              <h5>50:40:20</h5>
            </div>
            <div className="inner_block2 right_block">
              <h4>Vault Value</h4>
              <h5>$3,752,419</h5>
            </div>
          </div>

          <div className="secondary_block">
            <div className="inner_block2">
              <h4>$TINU Price</h4>
              <h5>$0.056</h5>
            </div>
            <div className="inner_block2 right_block">
              <h4>Claimable $TINU</h4>
              <h5>752,419</h5>
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
