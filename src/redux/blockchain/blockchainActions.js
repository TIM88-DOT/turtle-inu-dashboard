import { ethers } from "ethers";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const startupSuccess = (payload) => {
  return {
    type: "STARTUP_SUCCESS",
    payload: payload,
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner().getAddress();
    console.log(signer);
    dispatch(connectRequest());
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();

    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();

    const stakingAbiResponse = await fetch("/config/stakingabi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const stakingAbi = await stakingAbiResponse.json();

    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });

        if (networkId == CONFIG.NETWORK.ID) {
          const myContract = new ethers.Contract(
            CONFIG.CONTRACT_ADDRESS,
            abi,
            provider
          );

          const stakingContract = new ethers.Contract(
            CONFIG.CONTRACT_ADDRESS_STAKING,
            stakingAbi,
            provider
          );

          //const myBalance0 = await myContract.balanceOf(accounts[0]);
          const myBalance0 = await myContract.balanceOf(accounts[0]);
          const myBalance = ethers.utils.formatUnits(myBalance0, 18);
          const nextSellDate = await myContract.nextInvestorSellDate(accounts[0]);

          dispatch(
            connectSuccess({
              account: signer,
              connected: true,
              smartContract: myContract,
              stakingContract: stakingContract,
              myBalance: myBalance.toString(),
              provider: provider,
              nextSellDate: nextSellDate.toString()

            })
          );
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed(`Change network to ${CONFIG.NETWORK.NAME}.`));
        }
      } catch (err) {
        dispatch(connectFailed("Something went wrong."));
      }
    } else {
      dispatch(connectFailed("Install Metamask."));
    }
  };
};

export const startUp = () => {

  const getJSONP = async (url) => {
    let data = await (await fetch(url)).json();
    return data;
  };
  return async (dispatch) => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );
    const abiResponse = await fetch("/config/abi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const abi = await abiResponse.json();

    const pairabiResponse = await fetch("/config/pairabi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const pairabi = await pairabiResponse.json();

    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const CONFIG = await configResponse.json();

    const stakingAbiResponse = await fetch("/config/stakingabi.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const stakingAbi = await stakingAbiResponse.json();

    const myContract = new ethers.Contract(
      CONFIG.CONTRACT_ADDRESS,
      abi,
      provider
    );

    const stakingContract = new ethers.Contract(
      CONFIG.CONTRACT_ADDRESS_STAKING,
      stakingAbi,
      provider
    );


    const poolAddress = await myContract.lpPair();
    const pool = await myContract.balanceOf(poolAddress);
    console.log(poolAddress);

    const contractBalance0 = await myContract.balanceOf(CONFIG.CONTRACT_ADDRESS_STAKING);
    const contractBalance = ethers.utils.formatUnits(contractBalance0, 18);
    console.log("contract balance",contractBalance);

    // const deadaddress = "0x000000000000000000000000000000000000dEaD";
    // const dead = await myContract.balanceOf(deadaddress);
    // console.log("deadbalance = ", dead.toString());

    const ethPrice = await getJSONP("https://api.pancakeswap.info/api/v2/tokens/0x2170ed0880ac9a755fd29b2688956bd959f933f8");
    console.log("eth price", ethPrice.data.price);
    const PairContract = new ethers.Contract(
      CONFIG.CONTRACT_ADDRESS_PAIR,
      pairabi,
      provider
    );

    const [reserve0, reserve1, _] = await PairContract.getReserves();
    const eth = ethers.utils.formatEther(reserve0);
    const tinu = ethers.utils.formatUnits(reserve1, 18);
    const price = Number(ethPrice.data.price) * Number(eth) / Number(tinu);

    const apy = await stakingContract.rewardRate();


    dispatch(
      startupSuccess({
        apy: apy.toString(),
        price: price,
        pool: pool,
        contractBalance: contractBalance.toString()
      })
    );
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
  };
};
