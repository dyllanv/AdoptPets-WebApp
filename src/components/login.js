import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';




export default function Album() {


  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>

          <Typography variant="h6" color="inherit" noWrap>
            Login
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Login to find your new best friend
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
                
            </Typography>

            <form>
              <Input placeholder="Username" inputProps={{ 'aria-label': 'description' }} />
              <Input placeholder="Password" inputProps={{ 'aria-label': 'description' }} />
            </form>
            
            <div>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    New user?
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Forgot password
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
      </main>
    </React.Fragment>
  );
}

//export default App;
