import React, { useEffect, useCallback } from 'react'
import { Link } from "react-router-dom"
import { Card, CardActions, CardMedia, CardContent, Typography, Button, Container, CircularProgress, LinearProgress, Skeleton } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'

import { getRobots, connectRobotSock, disconnectRobotSock, calcPing } from '../store/actions/User'

function Control() {
    const state = useSelector(state => state.userReducer)
    const dispatch = useDispatch()

    const fetchRobots = useCallback(async () => {
        try {
            await dispatch(getRobots())
        } catch (err) {
            console.error(err)
        }
    }, [dispatch])

    const connect = useCallback(async (robot) => {
        await dispatch(connectRobotSock(robot))
    }, [dispatch])

    const disconnect = useCallback(async (robot) => {
        await dispatch(disconnectRobotSock(robot))
    }, [dispatch])

    // Fetch robo list on load
    useEffect(() => {
        fetchRobots()
    }, [fetchRobots])
    return (
        state.socketConn && state.robot && !state.loading
            ? <ActiveSession activeRobot={state.robot} disconnect={disconnect} ping={state.ping} loading={true} />
            : <Container maxWidth="md" sx={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button size="small" variant='outlined' sx={{ alignSelf: 'flex-end' }}><Link to="/">Logout</Link></Button>
                {state.loading && state.robots.length === 0 && <CircularProgress color="secondary" />}
                {state.robots?.map((robot, idx) => <Robot data={robot} loading={state.loading} connect={connect} key={idx} />)}
            </Container>
    )
}

function Robot(props) {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.data.username}
                </Typography>
                <CardMedia component="img" height="194"
                    image="https://www.zdnet.com/a/img/resize/8b332212397a18de3eba2a8f4bc2e723d3807d4f/2021/06/11/a419ab3e-428b-40fa-b554-02a18831fce3/raspberry-pi-4-model-b-header.jpg?width=1200&height=900&fit=crop&auto=webp" alt="Robot Picture"
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
                <Button size="small">Watch stream</Button>
            </CardActions>
            {props.loading && <LinearProgress color='success' />}
        </Card>
    );
}

function ActiveSession(props) {
    return (
        <Container maxWidth="xl" sx={{ marginTop: '100px', display: 'flex', flexDirection: 'row' }}>
            {/* Information card */}
            <Card sx={{ maxWidth: 600 }}>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Connected to {props.activeRobot.username}
                    </Typography>
                    <CardMedia component="img" height="194"
                        image="https://www.zdnet.com/a/img/resize/8b332212397a18de3eba2a8f4bc2e723d3807d4f/2021/06/11/a419ab3e-428b-40fa-b554-02a18831fce3/raspberry-pi-4-model-b-header.jpg?width=1200&height=900&fit=crop&auto=webp" alt="Robot Picture"
                    />
                    <Typography variant="body2" color="text.secondary">
                        <b>ID: {props.activeRobot.id}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <b>Online Since: {(new Date(props.activeRobot.iat * 1000)).toLocaleString()}</b>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <b>PING: {props.ping ? `${props.ping}ms` : <CircularProgress size={20} />}</b>
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" variant='contained' color='error' onClick={() => props.disconnect()}>Disconnect</Button>
                </CardActions>
                {props.loading && <LinearProgress color='success' />}
            </Card>
            {/* Video stream */}
            {props.loading && <Skeleton variant="rectangular" width={700} height={400} />}
        </Container>
    );
}

export default Control