import React, { useCallback } from 'react'
import { Card, CardActions, CardMedia, CardContent, Typography, Button, Container, CircularProgress, LinearProgress, TextField, Skeleton, Stack, Chip, Divider } from '@mui/material'
import robotPic from '../static/robot.jpg'

export default function ActiveControlSession(props) {

    const getPingColor = useCallback((ping) => {
        if (!ping) return "primary"
        if (ping < 150) return "success"
        if (ping < 250) return "warning"
        else return "error"
    }, [])

    return (
        <Container maxWidth="xl">
            <Container sx={{ marginTop: '100px', display: 'flex', flexDirection: 'row' }}>
                {/* Information card */}
                <Card sx={{ maxWidth: 600 }}>
                    {props.loading && <LinearProgress color='info' />}
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.control ? "Controlling" : "Viewing"} {props.activeRobot.username}
                        </Typography>
                        <CardMedia component="img" height="200" image={robotPic} alt="Robot Picture" />
                        <Divider>INFO</Divider>
                        <Typography variant="body2" color="text.secondary">ID: {props.activeRobot.id}</Typography>
                        <Typography gutterBottom variant="body2" color="text.secondary">
                            Online Since: {(new Date(props.activeRobot.iat * 1000)).toLocaleTimeString()}
                        </Typography>
                        <Divider>STATS</Divider>
                        <Typography variant="body2" color="text.secondary">
                            <Stack direction="column" spacing={1}>
                                <Chip color={getPingColor(props.ping?.server)} variant="outlined" label={props.ping?.server ? `Ping Server: ${props.ping.server}ms` : <CircularProgress size={20} />} />
                                <Chip color={getPingColor(props.ping?.robot)} variant="outlined" label={props.ping?.robot ? `Ping Robot: ${props.ping.robot}ms` : <CircularProgress size={20} />} />
                            </Stack>
                        </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: 'flex-end' }}>
                        <Button size="small" variant='contained' color='error' onClick={() => props.disconnect()}>Disconnect</Button>
                    </CardActions>
                    {/* Control box to send robot commands */}
                    {props.control && <TextField fullWidth id="command-box" label="Press Command" variant="filled" onKeyPress={(e) => props.sendCommand(e)} value={""} onChange={() => { }} />}
                </Card>
                {/* Video stream */}
                {props.loading && !props.currentFrame && <Skeleton variant="rectangular" width="70%" height={500} sx={{ bgcolor: 'grey.600' }} />}
                {!props.loading && props.currentFrame && <img src={`data:image/jpeg;base64,${props.currentFrame}`} width="70%" height={500} />}
            </Container>
        </Container>
    )
}