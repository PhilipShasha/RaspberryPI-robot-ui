
import { Card, CardActions, CardMedia, CardContent, Typography, Button, Container, CircularProgress, LinearProgress, Skeleton } from '@mui/material'


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
            {props.control && <input style={{ width: '100%' }} type="text" id="one" onKeyPress={(e) => props.sendCommand(e)} value={""} onChange={() => { }} />}
        </Container>
    )
}