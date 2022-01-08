import { Link, useLocation } from "react-router-dom"
import React, { useState, useEffect } from 'react'
import Loader from "react-loader-spinner"
import { Card, CardActions, CardContent, CardMedia, Typography, Button, Container } from '@mui/material'

import axios from 'axios'
import { API_URL } from './../const/constants'

function Control() {
    const { state } = useLocation()
    const [robots, setRobot] = useState([])
    const [loading, setLoading] = useState('')

    useEffect(async () => {
        try {
            setLoading('Discovering Robots...')
            if (!state.token) throw new Error("No token found")

            const config = { headers: { Authorization: `JWT ${state.token}` } };
            const response = await axios.get(`${API_URL}/listRobots`, config)

            setRobot(response.data)
        } catch (err) {
            console.error(err)
        }
        finally {
            setLoading('')
        }
    }, [])

    return (
        <Container maxWidth="sm" sx={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Button size="small" variant='outlined' sx={{ alignSelf: 'flex-end' }}><Link to="/">Logout</Link></Button>
            {loading && <Loader type="Puff" color="#00BFFF" height={100} width={100} timeout={3000} />}
            {robots.map((robot) => <Robot data={robot} />)}
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
                <Typography variant="body2" color="text.secondary">
                    <p>ID: {props.data.id}</p>
                    <p>Online Since: {(new Date(props.data.iat * 1000)).toLocaleString()}</p>
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" variant='contained'>Connect</Button>
                <Button size="small">Watch stream</Button>
            </CardActions>
        </Card>
    );
}



export default Control