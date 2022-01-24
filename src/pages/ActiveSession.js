
import { Card, CardActions, CardMedia, CardContent, Typography, Button, Container, CircularProgress, LinearProgress, Skeleton } from '@mui/material'
import robotPic from '../static/robot.jpg'

export default function ActiveControlSession(props) {
    return (
        <Container maxWidth="xl">
            <Container sx={{ marginTop: '100px', display: 'flex', flexDirection: 'row' }}>
                {/* Information card */}
                <Card sx={{ maxWidth: 600 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.control ? "Controlling" : "Viewing"} {props.activeRobot.username}
                        </Typography>
                        <CardMedia component="img" height="194"
                            image={robotPic} alt="Robot Picture"
                        />
                        <Typography ariant="body2" color="text.secondary">
                            <b>ID: {props.activeRobot.id}</b>
                        </Typography>
                        <Typography gutterBottom variant="body2" color="text.secondary">
                            <b>Online Since: {(new Date(props.activeRobot.iat * 1000)).toLocaleString()}</b>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <b>PING Server: {props.ping?.server ? `${props.ping.server}ms` : <CircularProgress size={20} />}</b>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            <b>PING Robot: {props.ping?.robot ? `${props.ping.robot}ms` : <CircularProgress size={20} />}</b>
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
            {/* Control box to send robot commands */}
            {props.control && <input style={{ width: '100%' }} type="text" id="one" onKeyPress={(e) => props.sendCommand(e)} value={""} onChange={() => { }} />}
        </Container>
    )
}