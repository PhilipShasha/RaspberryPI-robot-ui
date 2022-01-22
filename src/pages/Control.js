import React, { useState, useEffect, useCallback } from 'react'
import { Link } from "react-router-dom"
import { Card, CardActions, CardMedia, CardContent, Typography, Button, Container } from '@mui/material'
import Loader from "react-loader-spinner"
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
            ? <ActiveSession activeRobot={state.robot} disconnect={disconnect} ping={state.ping} />
            : <Container maxWidth="md" sx={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button size="small" variant='outlined' sx={{ alignSelf: 'flex-end' }}><Link to="/">Logout</Link></Button>
                {state.loading && state.robots.length === 0 && <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={3000} />}
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
                    {props.loading ? <Loader type="Oval" color="#FF0000" height={30} width={30} timeout={3000} /> : 'Connect'}
                </Button>
                <Button size="small">Watch stream</Button>
            </CardActions>
        </Card>
    );
}

function ActiveSession(props) {
    return (
        <Container maxWidth="xl" sx={{ marginTop: '100px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
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
                        ID: {props.activeRobot.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Online Since: {(new Date(props.activeRobot.iat * 1000)).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <b>PING: {props.ping ? `${props.ping}ms` : 'calculating'}</b>
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" variant='contained' color='error' onClick={() => props.disconnect()}>Disconnect</Button>
                </CardActions>
            </Card>
            {/* Video stream */}
            <img src="https://picsum.photos/700/400" alt="Robot video stream" />
        </Container>
    );
}

export default Control