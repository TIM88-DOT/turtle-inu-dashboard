const initialState = {
  loading: false,
  account: null,
  smartContract: null,
  nextSellDate:0,
  errorMsg: "",
  price: 0,
  connected: false,
  myBalance: 0,
  pool:0
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
        nextSellDate: action.payload.nextSellDate,
        pool: action.payload.pool
      };
    default:
      return state;
  }
};

export default blockchainReducer;
