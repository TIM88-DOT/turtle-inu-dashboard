const initialState = {
  loading: false,
  account: null,
  smartContract: null,
  nextSellDate: 0,
  errorMsg: "",
  price: 0,
  connected: false,
  myBalance: 0,
  pool: 0,
  stakingContract: null,
  provider: null
};

const blockchainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CONNECTION_REQUEST":
      return {
        ...initialState,
        loading: true,
      };
    case "CONNECTION_SUCCESS":
      return {
        ...state,
        loading: false,
        account: action.payload.account,
        smartContract: action.payload.smartContract,
        connected: action.payload.connected,
        myBalance: action.payload.myBalance,
        nextSellDate: action.payload.nextSellDate,
        stakingContract: action.payload.stakingContract,
        provider: action.payload.provider
      };
    case "CONNECTION_FAILED":
      return {
        ...initialState,
        loading: false,
        errorMsg: action.payload,
      };
    case "UPDATE_ACCOUNT":
      return {
        ...state,
        account: action.payload.account,
      };
    case "STARTUP_SUCCESS":
      return {
        ...state,
        price: action.payload.price,
        //deadBalance: action.payload.dead,
        pool: action.payload.pool
      };
    default:
      return state;
  }
};

export default blockchainReducer;
