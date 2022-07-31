import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { startUp } from '../redux/blockchain/blockchainActions';
import Sidebar from '../components/Sidebar'
import { ethers } from "ethers";
import './CSS/Account.css';
import './CSS/dashboard.css'
import StakingActions from "../components/StakingActions/StakingActions"
import { secondsToTime } from '../utils'


const Account = () => {

  const dispatch = useDispatch();
  let blockchain = useSelector((state) => state.blockchain);
  const [myValue, setMyValue] = useState(0);
  const [myBalance, setMyBalance] = useState(0);
  const [tinuPrice, setTinuPrice] = useState(0);
  const [claimableRewards, setClaimableRewards] = useState(0);
  const [pendingRewards, setPendingRewards] = useState(0);
  const [stakedAmount, setStakedAmount] = useState(0);
  const [currentApy, setCurrentApy] = useState(0);
  const [sec, setSec] = useState({ h: "00", m: "00", s: "00" });
  const [claimSec, setClaimSec] = useState({ h: "00", m: "00", s: "00" });

  var timer = 0;
  const secondes = useRef(0);
  const claimSeconds = useRef(0);
  useEffect(() => {
    let nextSellDate = blockchain.nextSellDate;
    const t =
      Math.floor(Date.now() / 1000) |
      0;
    console.log("next sell", nextSellDate);

    if (nextSellDate > 0) {
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
    getApy();
    getTimeDiff();
  }, [blockchain]);

  useEffect(() => {
    if (timer > 0) clearInterval(timer);
    setTimeout(() => {
      timer = setInterval(countDown, 1000);
    }, 3000);
    dispatch(startUp());
  }, []);


  useEffect(() => {

    const account = blockchain.account;
    const stakingTimer = setInterval(async () => {
      try {
        if (blockchain.stakingContract && blockchain.connected) {
          const earnedRewards = ethers.utils.formatUnits((await blockchain.stakingContract.calcReward(account)), 18).toString().slice(0, 6);
          setClaimableRewards(earnedRewards);
          const userInfos = await blockchain.stakingContract.userInfos(blockchain.account);
          const pendingRewards = ethers.utils.formatUnits(userInfos.pendingAmount, 18).toString().slice(0, 6);
          setPendingRewards(pendingRewards);
          setStakedAmount(ethers.utils.formatUnits(userInfos.stakedAmount, 18));
        } else {
          clearInterval(stakingTimer)
        }
      } catch (err) {
        console.log(err)
      }
    }, 3000)
  }, [blockchain])

  const countDown = () => {

    if (secondes.current > 0) secondes.current--;
    setSec(secondsToTime(secondes.current));

    if (claimSeconds.current) claimSeconds.current--;
    setClaimSec(secondsToTime(claimSeconds.current))
  };

  async function getTimeDiff() {
    if (blockchain.connected) {
      const timeDiffForClaim = await blockchain.stakingContract.timeDiffForClaim(blockchain.account);
      const t = Math.floor(Date.now() / 1000) |
        0;
      if (timeDiffForClaim > 0) {
        claimSeconds.current = (timeDiffForClaim);
        console.log("current claim seconds", claimSeconds.current);
      }
    }

  }
  async function getApy() {
    if (blockchain.connected) {
      const apy = await blockchain.apy;
      setCurrentApy(apy);
    }

  }

  return (
    <div>
      <Sidebar />
      <div className="account">
        <div className="header">
          <h1>Turtle Inu Official Dashboard  </h1>
          <h3>Current APY : <span>{currentApy} %</span></h3>
        </div>


        <div className="first_block">
          <div className="block_inner">
            <h4>You earned</h4>
            <div className="price"><h3>{claimableRewards}</h3>
              <h5>$TINU</h5></div>
          </div>
          <div className="block_inner right_block">

            <h4>Your Balance</h4>
            <div className="price"><h3>{myBalance}</h3>
              <h5>$TINU</h5></div>
          </div>
          <div className="block_inner right_block">
            <h4>Staked Amount</h4>
            <div className="price"><h3>{stakedAmount}</h3>
              <h5>$TINU</h5></div>
          </div>

          <div className="block_inner right_block">
            <h4>TINU Price</h4>
            <div className="price"><h3>{tinuPrice}</h3>
              <h5>$USD</h5></div>
          </div>
        </div>

        <div className="head_block">

          <div className="secondary_block">
            <div className="inner_block2">
              <h4>Pending Rewards</h4>
              <h5>{pendingRewards} $TINU</h5>
            </div>
            <div className="inner_block2 right_block">
              <h4>Claim unlocks in</h4>
              <h5>{claimSec.h}:{claimSec.m}:{claimSec.s}</h5>
            </div>
          </div>

          <div className="secondary_block">
            <div className="inner_block2">
              <h4>Next sell unlocks in</h4>
              <h5>{sec.h}:{sec.m}:{sec.s}</h5>
            </div>
            <div className="inner_block2 right_block">
              <h4>Vault Value (TVL)</h4>
              <h5>Coming Soon</h5>
            </div>
          </div>

        </div>
      </div >
      <StakingActions />

    </div>
  );
};

export default Account;
