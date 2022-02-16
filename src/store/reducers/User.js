
const initialState = {
    token: '',
    loginErr: '',
    loading: false,
    robots: [],
    robot: null,
    socketConn: null,
    streamConn: null,
    currentFrame: '',
    socketErr: '',
    pingServer: null,
    pingRobot: null
}

function userReducer(state = initialState, action) {
    switch (action.type) {
        case "LOGGED_IN":
            return { ...state, token: action.payload }
        case "LOGIN_ERROR_MSG":
            return { ...state, loginErr: action.payload }
        case "LIST_ROBOTS":
            return { ...state, robots: action.payload }
        case "WEBSOCKET_CONNECT":
            return { ...state, robot: action.payload.robot, socketConn: action.payload.socketConn, ping: null, socketErr: '' }
        case "WEBSOCKET_ERROR":
            return { ...state, socketErr: action.payload }
        case "TX_PING_SERVER":
            return { ...state, pingServer: action.payload }
        case "TX_STATS":
            return { ...state, statsRobot: action.payload }
        case "TX_PING_ROBOT":
            return { ...state, pingRobot: action.payload }
        case "STREAM_CONNECT":
            return { ...state, robot: action.payload.robot, streamConn: action.payload.streamConn, ping: null, socketErr: '' }
        case "RX_FRAME":
            return { ...state, currentFrame: action.payload.currentFrame }
        case "SET_LOADING":
            return { ...state, loading: action.payload }
        default:
            return state
    }
}
export default userReducer