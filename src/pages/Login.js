import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, TextField, Container } from '@mui/material'
import axios from 'axios'

import { API_URL } from './../const/constants'

function Login() {
    let navigate = useNavigate()
    const [loadingMsg, setLoadingMsg] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const authenticate = async () => {
        const authData = {
            username: username,
            password: password,
            isRobot: false
        }
        try {
            setLoadingMsg('Logging in')
            const response = await axios.post(`${API_URL}/login`, authData)
            navigate('/control', { state: { token: response.data.token } })
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingMsg('')
        }
    }

    return (
        <Container maxWidth="sm" sx={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignitems: 'space-evenly' }}>
            <TextField id="standard-basic" label="Username" variant="standard" value={username} onChange={(e) => setUsername(e.target.value)} />
            <TextField id="standard-basic" label="Password" variant="standard" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant='contained' sx={{ marginTop: '25px' }} onClick={async () => await authenticate()}>{loadingMsg ? loadingMsg : 'Login'}</Button>
        </Container>
    )
}


export default Login