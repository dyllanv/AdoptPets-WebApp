import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";




function logOut() {
  alert("Logging out");
  // localStorage.removeItem('user');
  localStorage.clear();
  window.location.reload();


}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(5),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
const LoginUser = () => {

  const history = useHistory();

    const [password, setPassword] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [user, setUserId] = React.useState();
    const handleSubmit = (event) => {
      var data = new FormData();
      data.append("email", email);
      data.append("password", password);
      const requestOptions = {
          method: 'POST',
          headers: { 
              'Accept': 'application/json',
              'Content-Type': 'application/json'
           },
          body: JSON.stringify({
              email: email,            
              password: password,
          }
        )
        
      };
      fetch(" http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/users/login", requestOptions)
      .then(response => response.json())
      //console.log(response.json())
      .then(json => {
        console.log('parsed json', json) // access json.body here
        //alert(json.rows[0].userId)
        setUserId(json.rows[0].userId)
        localStorage.clear(); //Remove all previous logins
        localStorage.setItem('user', json.rows[0].userId)
        alert("You are now logged in as " + json.rows[0].fname + ' ' + json.rows[0].lname)
    }).then(history.push("/userdash"))
    .then(() => window.location.reload())
      .catch((error) => {
        alert('Invalid Login')
        console.error(error)
      })
      event.preventDefault();





    }
    const classes = useStyles();
    return(

      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <EmojiPeopleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login to your user account!
        </Typography>
        <form onSubmit={handleSubmit}>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type='text'
                    name="email" 
                    label="email@example.com" 
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                >
                </TextField>
                </Grid>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type='password'
                    name="password" 
                    label="Password" 
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                >
                </TextField>
                </Grid>
                <br></br>
                <Button type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  //onClick={() => {window.location.assign('http://flip2.engr.oregonstate.edu:4256/users')}}
                  
          >
            Login
          </Button>
          <br></br>
          <Button 
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() =>  history.push("/userRegister") }
          >
            New User?
          </Button>

            </form>
            
            </div>
            </Container>

    )
}
export default LoginUser;