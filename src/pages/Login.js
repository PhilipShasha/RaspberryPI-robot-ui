import React, { useState, useCallback } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, TextField, Container } from '@mui/material'
import { useDispatch } from 'react-redux'

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
        <Container maxWidth="sm" sx={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignitems: 'space-evenly' }}>
            <TextField id="standard-basic" label="Username" variant="standard" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField id="standard-basic" label="Password" variant="standard" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant='contained' sx={{ marginTop: '25px' }} onClick={async () => await authenticate()}>{loadingMsg ? loadingMsg : 'Login'}</Button>
        </Container>
    )
}


export default Login