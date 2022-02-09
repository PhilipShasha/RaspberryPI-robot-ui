import React, { useEffect, useCallback } from 'react'
import { Link } from "react-router-dom"
import { Card, CardActions, CardMedia, CardContent, Typography, Button, Container, CircularProgress, LinearProgress } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { getRobots, connectRobotSock, disconnectRobotSock, connectRobotStream, disconnectRobotStream, sendCommand } from '../store/actions/User'
import ActiveControlSession from './ActiveSession'
import robotPic from '../static/robot.jpg'

function Control() {
    const state = useSelector(state => state.userReducer)
    const dispatch = useDispatch()

    const fetchRobots = useCallback(async () => {
        await dispatch(getRobots())
    }, [dispatch])

    // Sockets
    const send = useCallback(async (event) => {
        await dispatch(sendCommand(event.key))
    }, [dispatch])

    const connect = useCallback(async (robot) => {
        await dispatch(connectRobotSock(robot))
        await dispatch(connectRobotStream(robot))
    }, [dispatch])

    const disconnect = useCallback(async (robot) => {
        await dispatch(disconnectRobotSock(robot))
        await dispatch(disconnectRobotStream(robot))
    }, [dispatch])

    // Streams
    const connectStream = useCallback(async (robot) => {
        await dispatch(connectRobotStream(robot))
    }, [dispatch])

    const disconnectStream = useCallback(async (robot) => {
        await dispatch(disconnectRobotStream(robot))
    }, [dispatch])

    // Fetch robo list on load
    useEffect(() => {
        fetchRobots()
    }, [fetchRobots])

    return (
        state.robot && !state.loading
            ? state.socketConn
                ? <ActiveControlSession activeRobot={state.robot} disconnect={disconnect} sendCommand={send} ping={{ server: state.pingServer, robot: state.pingRobot }} loading={true} control={true} />
                : <ActiveControlSession activeRobot={state.robot} disconnect={disconnectStream} ping={{ server: state.pingServer, robot: state.pingRobot }} loading={state.loading} currentFrame={state.currentFrame} />
            : <Container maxWidth="md" sx={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', alignSelf: 'flex-end' }}>
                    <Button size="small" variant='contained'>Logout</Button>
                </Link>
                {state.loading && state.robots.length === 0 && <CircularProgress color="secondary" />}
                {state.robots?.map((robot, idx) => <Robot data={robot} loading={state.loading} connect={connect} connectStream={connectStream} key={idx} />)}
            </Container>
    )
}

function Robot(props) {
    return (
        <Card sx={{ width: 400, padding: '10px' }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.data.username}
                </Typography>
                <CardMedia component="img" height="194"
                    image={robotPic} alt="Robot Picture"
                />
                <Typography variant="body2" color="text.secondary">
                    <p>ID: {props.data.id}</p>
                    <p>Online Since: {(new Date(props.data.iat * 1000)).toLocaleString()}</p>
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" variant='contained' onClick={async () => await props.connect(props.data)}>
                    {props.loading ? "Connecting" : "Connect"}
                </Button>
                <Button size="small" onClick={async () => await props.connectStream(props.data)}>Watch stream</Button>
            </CardActions>
            {props.loading && <LinearProgress color='success' />}
        </Card>
    )
}

export default Control