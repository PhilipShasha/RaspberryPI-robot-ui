import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
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
            console.log(response)
            navigate('/control')
        } catch (err) {
            console.error(err)
        } finally {
            setLoadingMsg('')
        }
    }

    return (
        <div>
            <p>LOGIN BOY </p>
            <label> Username: <input name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} /> </label>
            <label> Password: <input name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /> </label>
            <button onClick={async () => await authenticate()}>{loadingMsg ? loadingMsg : 'Login'}</button>
        </div>
    )
}


export default Login