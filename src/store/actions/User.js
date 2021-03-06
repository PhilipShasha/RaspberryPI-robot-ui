import axios from 'axios'
import { API_URL, SOCK_URL, PING_INTERVAL } from './../../const/constants'

const allowedkeys = ['W', 'S', 'A', 'D']

// REST API endpoints

export function login(username, password) {
    return async (dispatch) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true })

            const res = await axios.post(`${API_URL}/login`, {
                username: username,
                password: password
            })
            // Save data in redux store
            dispatch({
                type: "LOGGED_IN",
                payload: res.data.token
            })
            dispatch({ type: "LOGIN_ERROR_MSG", payload: "" })
            return true
        }
        catch (err) {
            console.log(`Error logging in: ${err}`)
            dispatch({ type: "LOGIN_ERROR_MSG", payload: err.response?.data })
            return false
        }
        finally {
            dispatch({ type: "SET_LOADING", payload: false })
        }
    }
}

export function getRobots() {
    return async (dispatch, getState) => {
        dispatch({ type: "SET_LOADING", payload: true })
        try {
            const state = getState().userReducer
            const headers = { headers: { Authorization: `JWT ${state.token}` } }
            const response = await axios.get(`${API_URL}/listRobots`, headers)

            // Save data in redux store
            dispatch({
                type: "LIST_ROBOTS",
                payload: response.data,
            })
            return true
        }
        catch (err) {
            console.log(`Error fetching robot list: ${err}`)
            return false
        }
        finally {
            dispatch({ type: "SET_LOADING", payload: false })
        }
    }
}

// WebSocket methods

export function connectRobotSock(robot) {
    return async (dispatch, getState) => {
        dispatch({ type: "SET_LOADING", payload: true })
        try {
            const state = getState().userReducer
            if (!state.token) throw new Error("Token is not present. Re-auth required")

            // Close existing socket 
            if (state.socketConn)
                state.socketConn.close()

            const socketConn = new WebSocket(`${SOCK_URL}/ws?token=${state.token}&view=false&lobby=${robot.id}`)
            let pingInterval
            socketConn.addEventListener('open', event => {
                console.log('Socket Opened')
                pingInterval = setInterval(() => {
                    dispatch(calcPing())
                }, PING_INTERVAL)
                dispatch({ type: "SET_LOADING", payload: false })
            })
            socketConn.addEventListener('error', event => {
                console.error('Socket Error: ', event)
                clearInterval(pingInterval)
            })
            socketConn.addEventListener('close', event => {
                console.log('Socket Closed')
                clearInterval(pingInterval)
            })
            socketConn.addEventListener('message', event => {
                try {
                    const message = JSON.parse(event.data)
                    console.log(message)
                    switch (message.cmd.toUpperCase()) {
                        case "TX_PING":
                            const startDate = new Date(message.data)
                            const diff = Date.now() - startDate
                            if (!diff) return
                            if (message.sender === "server")
                                dispatch({ type: "TX_PING_SERVER", payload: diff })
                            if (message.sender === robot.id)
                                dispatch({ type: "TX_PING_ROBOT", payload: diff })
                            break
                        case "TX_STATS":
                            dispatch({ type: "TX_STATS", payload: message.data })
                            break
                        default:
                            console.log(`Unrecognized command recieved ${message.cmd.toUpperCase()}`)
                    }
                } catch (err) {
                    console.log(`Failed to parse Server sock msg as JSON ${err}`)
                }
            })
            // Save socket in redux store
            dispatch({ type: "WEBSOCKET_CONNECT", payload: { socketConn: socketConn, robot: robot } })
            return true
        }
        catch (err) {
            console.log(`Error connecting to websocket: ${err}`)
            return false
        }
    }
}

export function disconnectRobotSock() {
    return async (dispatch, getState) => {
        dispatch({ type: "SET_LOADING", payload: true })
        try {
            const state = getState().userReducer
            if (!state.token) throw new Error("Token is not present. Re-auth required")

            // Close existing socket 
            if (state.socketConn)
                state.socketConn.close()

            // Save socket in redux store
            dispatch({ type: "WEBSOCKET_CONNECT", payload: { socketConn: null, robot: null } })
        }
        catch (err) {
            console.log(`Error connecting to websocket: ${err}`)
        }
        finally {
            dispatch({ type: "SET_LOADING", payload: false })
        }
    }
}

export function connectRobotStream(robot) {
    return async (dispatch, getState) => {
        dispatch({ type: "SET_LOADING", payload: true })
        try {
            const state = getState().userReducer
            if (!state.token) throw new Error("Token is not present. Re-auth required")

            // Close existing socket 
            if (state.streamConn)
                state.streamConn.close()

            const streamConn = new WebSocket(`${SOCK_URL}/ws?token=${state.token}&view=true&lobby=${robot.id}`)
            streamConn.binaryType = 'arraybuffer'

            streamConn.addEventListener('open', event => {
                console.log('Socket Opened')
                dispatch({ type: "SET_LOADING", payload: false })
            })
            streamConn.addEventListener('error', event => {
                console.error('Socket Error: ', event)
            })
            streamConn.addEventListener('close', event => {
                console.log('Socket Closed')
            })
            streamConn.addEventListener('message', event => {
                // HANDLE VIDEO STREAM FROM SERVER
                dispatch({ type: "RX_FRAME", payload: { currentFrame: event.data } })
                console.log('Recieved Video Frame')
            })
            // Save socket in redux store
            dispatch({ type: "STREAM_CONNECT", payload: { streamConn: streamConn, robot: robot } })
            return true
        }
        catch (err) {
            console.log(`Error connecting to websocket stream: ${err}`)
            return false
        }
    }
}

export function disconnectRobotStream() {
    return async (dispatch, getState) => {
        dispatch({ type: "SET_LOADING", payload: true })
        try {
            const state = getState().userReducer
            if (!state.token) throw new Error("Token is not present. Re-auth required")

            // Close existing socket 
            if (state.streamConn)
                state.streamConn.close()

            // Save socket in redux store
            dispatch({ type: "STREAM_CONNECT", payload: { streamConn: null, robot: null } })
        }
        catch (err) {
            console.log(`Error connecting to websocket: ${err}`)
        }
        finally {
            dispatch({ type: "SET_LOADING", payload: false })
        }
    }
}

export function calcPing(robot) {
    return async (dispatch, getState) => {
        try {
            const state = getState().userReducer

            if (!state.token) throw new Error("Token is not present. Re-auth required")
            if (!state.socketConn) throw new Error("Socket not active. Cannot ping")

            // Send Server Ping 
            const pingSrvTX = JSON.stringify({
                cmd: "TX_PING",
                data: Date.now(),
                target: "server"
            })
            state.socketConn.send(pingSrvTX)

            // Send Robot Ping
            const pingRobotTX = JSON.stringify({
                cmd: "TX_PING",
                data: Date.now(),
                target: state.robot.id
            })
            state.socketConn.send(pingRobotTX)
        }
        catch (err) {
            console.log(`Error pinging websocket: ${err}`)
        }
    }
}

export function sendCommand(key) {
    return async (dispatch, getState) => {
        try {
            const state = getState().userReducer

            if (!state.token) throw new Error("Token is not present. Re-auth required")
            if (!state.socketConn) throw new Error("Socket not active. Cannot ping")
            if (!allowedkeys.includes(key.toUpperCase())) throw new Error("Invalid command")

            const cmdTX = {
                cmd: "TX_CMD",
                data: key.toUpperCase(),
                target: state.robot.id
            }
            console.log(cmdTX)
            state.socketConn.send(JSON.stringify(cmdTX))
        }
        catch (err) {
            console.log(`Error sending command through websocket: ${err}`)
        }
    }
}