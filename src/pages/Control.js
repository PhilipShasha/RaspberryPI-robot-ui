import { Link, useLocation} from "react-router-dom"
import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { API_URL } from './../const/constants'
import { render } from "@testing-library/react";

function Control() {
    const { state } = useLocation();

    useEffect(async () => {
        console.log('test')
        console.log(state.token)
        const config = { headers: { Authorization: `JWT ${state.token}` }};
        try{
            const response = await axios.get(`${API_URL}/listRobots`, config)
            console.log(response)

        } catch (err) {
            console.error(err)
        } finally {
            
        }
        
      })

    return (
        <div>
            <ul>
                <li>
                    <Link to="/">Login Page</Link>
                </li>
                <p>Select raspberry robot</p>
            </ul>
        </div>
    )
}



export default Control