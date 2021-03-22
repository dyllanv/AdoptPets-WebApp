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
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import PetsIcon from '@material-ui/icons/Pets';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from "react-router-dom";

const data = require('../updated_cities_states.json');

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



const AddAdmin = () => {

  const history = useHistory();
    const [fname, setFname] = React.useState("");
    const [lname, setLname] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [email, setEmail] = React.useState("");
    //New Below
    const [shelterName, setShelter] = React.useState("");
    const [city, setCity] = React.useState("");
    const [state, setState] = React.useState("");
    const [website, setWebsite] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [aboutMe, setAbout] = React.useState("");
    //New Above
    const [user, setUserId] = React.useState();
    const [cityList, setCityList] = React.useState([]);
    
    const handleSubmit = (event) => {
      const requestOptions = {
          method: 'POST',
          headers: { 
              'Accept': 'application/json',
              'Content-Type': 'application/json'
           },
          body: JSON.stringify({
              userId: 10, 
              password: password,
              fname: fname,
              lname: lname,
              email: email,
              shelterName: shelterName,
              city: city,
              state: state,
              website: website,
              phone: phone,
              aboutMe: aboutMe,

          }
        )
      };
      fetch("http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/admin", requestOptions)
      .then(response => response.json())
      .then(json => {
          console.log('parsed json', json) // access json.body here
          localStorage.clear(); //Remove all previous logins
          localStorage.setItem('admin', json.rows[0].sellerId)
          alert("You are now logged in as " + json.rows[0].fname + ' ' + json.rows[0].lname + ' from ' + json.rows[0].shelterName)
      }).then(history.push("/userdash"))
      .then(() => window.location.reload())
      

    }

    
    function changeCities(name) {

      var list = data[name];
      setCityList(list);
    }

    var stateList = [];
    Object.keys(data).forEach(state =>
        stateList.push(<MenuItem value={state}>{state}</MenuItem>)
    )
    var cityMenuList = [];
    cityList.forEach(city =>
        cityMenuList.push(<MenuItem value={city}>{city}</MenuItem>)
    )


    
    const classes = useStyles();
    return(
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <PetsIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up as an Admin!
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    type='text'
                    name='fname'
                    variant="outlined"
                    required
                    label='First Name'
                    autoFocus
                    onChange={e => setFname(e.target.value)}
                    value={fname}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth 
                    type='text'
                    name="lname" 
                    label="Last Name" 
                    onChange={e => setLname(e.target.value)}
                    value={lname}
                    autoComplete="lname"
                />

                </Grid>
                </Grid>

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
                    //type='text'
                    type='password' //possibly change to this?
                    name="password" 
                    label="Password" 
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                >
                </TextField>
                </Grid>


                

                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type='text'
                    name="website" 
                    label="Website" 
                    onChange={e => setWebsite(e.target.value)}
                    value={website}
                >
                </TextField>
                </Grid>

                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type='text'
                    name="phone" 
                    label="Phone Number" 
                    onChange={e => setPhone(e.target.value)}
                    value={phone}
                >
                </TextField>
                </Grid>
                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type='text'
                    name="aboutMe" 
                    label="About Me" 
                    onChange={e => setAbout(e.target.value)}
                    value={aboutMe}
                >
                </TextField>
                </Grid>
            

                <Grid item xs={12}>
                <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type='text'
                    name="shelterName" 
                    label="Shelter Name" 
                    onChange={e => setShelter(e.target.value)}
                    value={shelterName}
                >
                </TextField>
                </Grid>

                <div style={{display: "grid", gridTemplateColumns: "auto auto", marginLeft: "auto", marginRight: "auto", marginTop: "2vh", marginBottom: "2vh"}}>
                  <div>
                  
                
                <InputLabel id="state">State</InputLabel>
                <Select labelId="state"
                    required
                    onChange={e => {setState(e.target.value); changeCities(e.target.value)}}
                >
                    {stateList}
                </Select>
                </div>


              <div>
                <InputLabel id="city">City</InputLabel>
                <Select labelId="city"
                    required
                    onChange={e => {setCity(e.target.value)}}

                >
                    {cityMenuList}
                </Select>
                </div>
                </div>






                <br></br>
                <Button type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
          >
            Register
          </Button>
          
            </form>
            </div>
            </Container>
    )
}

export default AddAdmin;
