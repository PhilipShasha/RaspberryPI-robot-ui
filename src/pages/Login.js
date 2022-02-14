import React, { useState, useCallback } from 'react'
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux'
import LoginIcon from '@mui/icons-material/Login'
import LoadingButton from '@mui/lab/LoadingButton'
import { TextField, Container, Card, CardContent, CardActions, LinearProgress } from '@mui/material'

import { login } from '../store/actions/User'

function Login() {
    let navigate = useNavigate()
    const dispatch = useDispatch()
    const [loadingMsg, setLoadingMsg] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const authenticate = useCallback(async () => {
        setLoadingMsg('Logging in')
        let loggedIn = await dispatch(login(username, password))
        setLoadingMsg('')
        if (loggedIn) navigate('/control')
    }, [username, password, setLoadingMsg, navigate, dispatch])

    return (
        <Container maxWidth="sm" sx={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignitems: 'space-evenly' }} >
            <Card sx={{ width: 400, padding: '10px' }}>
                <form onSubmit={(e) => { e.preventDefault(); authenticate(); }}>
                    <CardContent>
                        <TextField fullWidth id="username" label="Username" variant="standard" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </CardContent>
                    <CardContent>
                        <TextField fullWidth id="password" label="Password" variant="standard" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                    </CardContent>
                    <CardActions>
                        <LoadingButton loading={loadingMsg} type="submit" variant='contained' startIcon={<LoginIcon />} sx={{ marginTop: '25px' }} >{loadingMsg ? loadingMsg : 'Login'}</LoadingButton>
                    </CardActions>
                </form>
                {loadingMsg && <LinearProgress color='success' />}
            </Card>
        </Container>
    )
}


export default Login