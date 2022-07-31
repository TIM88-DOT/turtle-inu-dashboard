import React from "react";
import '../../pages/CSS/dashboard.css';
import CustomButton from "../CustomButton/CustomButton";
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { ethers } from "ethers";
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../../redux/blockchain/blockchainActions";


const StakingActions = () => {
    const [open, setOpen] = useState(false);
    const [stakeState, setStakeState] = useState(false);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [stakeBalance, setStakeBalance] = useState(0);
    const [showClaim, setShowClaim] = useState(false);
    const [approvedState, setApprovedState] = useState("Approve");
    const [stakeWithBal, setStakeWithBal] = useState(0);
    const [tokenAbi, setTokenAbi] = useState();
    const [stakingAbi, setStakingAbi] = useState();
    const inputElement = useRef();
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        CONTRACT_ADDRESS_STAKING: ""
    });
    let blockchain = useSelector((state) => state.blockchain);
    const dispatch = useDispatch();
    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        borderRadius: '5px',
    };
    const getConfig = async () => {
        const configResponse = await fetch("/config/config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };

    const getTokenAbi = async () => {
        const tokenAbiResponse = await fetch("/config/abi.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const tokenAbi = await tokenAbiResponse.json();
        setTokenAbi(tokenAbi);
    };


    const getStakingAbi = async () => {
        const stakingAbiResponse = await fetch("/config/stakingabi.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const stakingAbi = await stakingAbiResponse.json();
        setStakingAbi(stakingAbi);
    };



    const onClickPick = () => {
        setStakeState(true);
        setStakeWithBal(0)
        if (blockchain.connected) {
            const currentValue = blockchain.myBalance;
            setCurrentBalance(currentValue - 0)
            console.log(currentValue)
            setOpen(true)
        }
    }

    const onClickClaim = async () => {
        setStakeState(false);
        setStakeWithBal(0);
        try {
            if (blockchain.connected) {
                const stakingContract = new ethers.Contract(
                    CONFIG.CONTRACT_ADDRESS_STAKING,
                    stakingAbi,
                    blockchain.provider.getSigner()
                );
                const farmCon = await stakingContract.claim();
                await farmCon.wait();
                dispatch(connect());
                alert(`You just claimed your tokens !`)
            }
        } catch (err) {
            console.log(err);
            alert(err.message);
        }
    }

    const onClickHarvest = async () => {
        setStakeState(false);
        setStakeWithBal(0);
        try {
            if (blockchain.connected) {
                const stakingContract = new ethers.Contract(
                    CONFIG.CONTRACT_ADDRESS_STAKING,
                    stakingAbi,
                    blockchain.provider.getSigner()
                );
                const farmCon = await stakingContract.harvest();
                await farmCon.wait();
                dispatch(connect());
                alert(`You just harvested your rewards !`)
            }
        } catch (err) {
            console.log(err);
            alert(err.message);
        }
    }

    const onClickWithdraw = async () => {
        setStakeState(false);
        setStakeWithBal(0);
        try {
            if (blockchain.connected) {
                const userInfos = await blockchain.stakingContract.userInfos(blockchain.account);
                const val = ethers.utils.formatUnits(userInfos.stakedAmount, 18);
                setStakeBalance(val);
                console.log("valo", val)
                setOpen(true)
            }
        } catch (err) {
            console.log(err);
            alert(err.message);
        }
    }


    const onClickStake = async () => {
        if (stakeWithBal && stakeWithBal > 0) {
            try {
                if (blockchain.connected) {
                    const account = blockchain.account;
                    const tokenContract = new ethers.Contract(
                        CONFIG.CONTRACT_ADDRESS,
                        tokenAbi,
                        blockchain.provider.getSigner()
                    );
                    const stakingContract = new ethers.Contract(
                        CONFIG.CONTRACT_ADDRESS_STAKING,
                        stakingAbi,
                        blockchain.provider.getSigner()
                    );

                    console.log(tokenContract)
                    const sendToken = stakeWithBal + '000000000000000000';
                    if (stakeState === true) {
                        const getAllowance = await tokenContract.allowance(account, CONFIG.CONTRACT_ADDRESS_STAKING);
                        console.log('getAllowance', getAllowance / Math.pow(10, 18))
                        if (getAllowance / Math.pow(10, 18) < stakeWithBal) {
                            setApprovedState("Approve")
                            const tokenCon = await tokenContract.approve(CONFIG.CONTRACT_ADDRESS_STAKING, (sendToken));
                            await tokenCon.wait();
                            dispatch(connect());
                        }
                        else {
                            setApprovedState("Stake")
                        }

                        console.log('sendToken', sendToken)
                        const farmCon = await stakingContract.stakeToken(sendToken);
                        await farmCon.wait();
                        dispatch(connect());
                        setOpen(false)
                    } else {
                        const farmCon = await stakingContract.unstakeToken(sendToken, false);
                        await farmCon.wait();
                        dispatch(connect());
                        setOpen(false)
                    }
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            alert('please insert stake or withdraw value')
        }
    }

    const onClickWithdrawEmeregency = async () => {
        if (stakeWithBal && stakeWithBal > 0) {
            try {
                if (blockchain.connected) {
                    const account = blockchain.account;
                    const tokenContract = new ethers.Contract(
                        CONFIG.CONTRACT_ADDRESS,
                        tokenAbi,
                        blockchain.provider.getSigner()
                    );
                    const stakingContract = new ethers.Contract(
                        CONFIG.CONTRACT_ADDRESS_STAKING,
                        stakingAbi,
                        blockchain.provider.getSigner()
                    );

                    console.log(tokenContract)
                    const sendToken = stakeWithBal + '000000000000000000';

                    const farmCon = await stakingContract.unstakeToken(sendToken, true);
                    await farmCon.wait();
                    dispatch(connect());
                    setOpen(false)
                }
            } catch (err) {
                console.log(err);
                alert(err.message);
            }
        } else {
            alert('please insert stake or withdraw value')
        }
    }

    async function checkAllowance() {
        if (blockchain.connected) {
            const account = blockchain.account;
            const tokenContract = new ethers.Contract(
                CONFIG.CONTRACT_ADDRESS,
                tokenAbi,
                blockchain.provider.getSigner()
            );
            const getAllowance = await tokenContract.allowance(account, CONFIG.CONTRACT_ADDRESS_STAKING);
            if (getAllowance > 0) {
                setApprovedState("Stake");
            } else { setApprovedState("Approve"); }
        }
    }

    async function getTimeDiff() {
        if (blockchain.connected) {
            const timeDiffForClaim = await blockchain.stakingContract.timeDiffForClaim(blockchain.account);
            if (timeDiffForClaim > 0) {
                setShowClaim(false)
            }
            else {
                setShowClaim(true)
            }
        }
    }

    const setMaxValue = () => {
        console.log("clicked")
        if (stakeState) {
            inputElement.current.value = currentBalance;
        } else {
            inputElement.current.value = stakeBalance;
        }
    }

    useEffect(() => {
        getTimeDiff();
        checkAllowance();
        getConfig();
        getTokenAbi();
        getStakingAbi();
    }, [blockchain]);

    return (<>
        <div style={{
            display: "flex",
            justifyContent: "center",
            marginBlock: "25px"
        }} className="secondary_block">
            <div>
                <CustomButton style={{ backgroundColor: "#e5400d" }} onClick={() => onClickPick()} value="Stake $TINU" />
            </div>
            <div>
                {showClaim && (stakeBalance > 0) && <CustomButton onClick={() => onClickClaim()} value="Claim $TINU" />}
            </div>
            <div>
                <CustomButton onClick={() => onClickHarvest()} value="Harvest $TINU" style={{ backgroundColor: "#09160c" }} />
            </div>
            <div>
                <CustomButton style={{ backgroundColor: "#323c43" }} onClick={() => onClickWithdraw()} value="Withdraw $TINU" />
            </div>
        </div>
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
                <Box sx={modalStyle}>
                    <h2 className="modal_header">{stakeState ? "Stake your tokens" : "Select withdraw option"}</h2>
                    <div className="unmber">
                        {!stakeState && <ul>
                            <li>Unstake will allow you to get $TINU tokens after 3 days.</li>
                            <li>Emergency Withdraw will allow you to get $TINU tokens immediately with 9% fee.</li>
                        </ul>}
                        <h3> {stakeState ? "Balance : " + currentBalance : "Amount staked : " + stakeBalance.toString()}</h3>
                        <input ref={inputElement} type="number" max={currentBalance} onChange={(e) => {
                            setStakeWithBal(e.target.value)
                            if (e.target.value < 0) e.target.value = 0
                        }}
                        />
                        <a style={{ color: "blue", marginLeft: "10px" }} onClick={() => setMaxValue()}>Max</a>
                    </div>
                    <div className="modal-buttons">
                        <CustomButton value={stakeState ? approvedState : "Unstake"} onClick={onClickStake} style={{ backgroundColor: "#e5400d", padding: "0px 15px", float: 'right', margin: '0 30px 20px 0', width: 150, lineHeight: "35px" }} />
                        {!stakeState &&
                            <CustomButton value={"Emergency Withdraw"} onClick={onClickWithdrawEmeregency} style={{ backgroundColor: "#323c43", padding: "0px 15px", float: 'right', margin: '0 30px 20px 0', width: 200, lineHeight: "35px" }} />
                        }

                    </div>

                </Box>
            </Fade>
        </Modal>
    </>
    )
}

export default StakingActions;



