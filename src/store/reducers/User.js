
const initialState = {
    token: '',
    loginErr: '',
    loading: false,
    robots: [],
    robot: null,
    socketConn: null,
    socketErr: '',
    ping: null
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
            return { ...state, robot: action.payload.robot, socketConn: action.payload.socketConn, socketErr: '' }
        case "WEBSOCKET_ERROR":
            return { ...state, socketErr: action.payload }
        case "TX_PING":
            return { ...state, ping: action.payload }
        case "SET_LOADING":
            return { ...state, loading: action.payload }
        default:
            return state
    }
}
export default userReducer