import React, {useRef, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {catBreedsArray} from './breeds'
import * as yup from 'yup';

const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/png"
  ];

const schema = yup.object().shape({
    status: yup.string().required(),
    name: yup.string().required(),
    breed: yup.string().required(),
    sex: yup.string().required(),
    age: yup.number().positive().required(),
    weight: yup.number().positive().required(),
    size: yup.string().required(),
    fee: yup.number().positive().required(),
    desc: yup.string().required(),
    city: yup.string().required(),
    state: yup.string().required(),
    goodWithKids: yup.string().required(),
    goodWithDogs: yup.string().required(),
    goodWithCats: yup.string().required(),
    requiresFence: yup.string().required(),
    houseTrained: yup.string().required(),
    neuteredSpayed: yup.string().required(),
    shotsUpToDate: yup.string().required(),
    // photoHere: yup.mixed().required().test("type", "Unsupported Format", (value) => {
    //     //console.log(value)
    //     return value && SUPPORTED_FORMATS.includes(value[0].type)}
    // )
  });

  const data = require('../updated_cities_states.json');


const AddCat = () => {


    const [cityList, setCityList] = React.useState([]);
    const [name, setName] = React.useState("");
    const [breed, setBreed] = React.useState("");
    const [age, setAge] = React.useState("");
    const [sex, setSex] = React.useState("");
    const [weight, setWeight] = React.useState("");
    const [fee, setFee] = React.useState("");
    const [size, setSize] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [city, setCity] = React.useState("");
    const [state, setState] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [dogs, setDogs] = React.useState("");
    const [cats, setCats] = React.useState("");
    const [kids, setKids] = React.useState("");
    const [fence, setFence] = React.useState("");
    const [trained, setTrained] = React.useState("");
    const [neut, setNeut] = React.useState("");
    const [shots, setShots] = React.useState("");
    const [files, setFiles] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    

    const url = "http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/pets"
    const storedVal = localStorage.getItem('admin');
    
    //Change city list depending on state
    function changeCities(name) {
        var list = data[name];
        console.log(list);
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
    

    const handleSubmit = (event) => {

        //Create form data to be sent to backend
        var data = new FormData();
        data.append("sellerId", storedVal); //Need to update
        data.append("status", status);
        data.append("animal", "Cat");
        data.append("name", name);
        data.append("breed", breed);
        data.append("sex", sex);
        data.append("age", age);
        data.append("weight", weight);
        data.append("size", size);
        data.append("adoptionFee", fee);
        data.append("aboutMe", desc);
        data.append("city", city);
        data.append("state", state);
        data.append("goodWithKids", kids);
        data.append("goodWithDogs", dogs);
        data.append("goodWithCats", cats);
        data.append("requiresFence", fence);
        data.append("houseTrained", trained);
        data.append("neuteredSpayed", neut);
        data.append("shotsUpToDate", shots);

        //Check for null values
        if(name == "" || age == "" || weight == "" || fee == "" || city == "" || state == "" || size == "") {
            alert("Name, age, weight, city, state, size, and adoption fee cannot be null");
            event.preventDefault();
            return;
        }

        //Check for nonpositive values
        if(weight < 0 || age < 0 || fee < 0) {
            alert("Age, weight, and adoption fee cannot be negative");
            event.preventDefault();
            return;
        }

        //Check if files are valid
        if (files === null) {
            alert("You need to upload one image file");
            event.preventDefault();
            return;
        }
        else {
            for (let i = 0; i < files.length; i++) {
                if(!SUPPORTED_FORMATS.includes(files[i].type)) {

                    alert("Invalid file type");
                    setFiles(null);
                    event.preventDefault();
                    return;
                }
                if(files[i].size > 1048576) {
                    
                    alert("Files must be under 1MB");
                    setFiles(null);
                    event.preventDefault();
                    return;
                }
                if(i >= 6) {
                    break //cut off extra files
                }
                data.append("photo", files[i])
            }
        }

        const requestOptions = {
            method: 'POST',
            body: data
        };
        
        //Send POST request with form data
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(json => {
            console.log('parsed json', json) // access json.body here
        }).then(() => handleClick())
        event.preventDefault();
    }

    //Open dialog on pet add
    const handleClick = () => {
      setOpen(true);
    };

    //Close dialog
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };
    
    return(
        <div style={{marginTop: "5%"}}>
            <h1><u>Add Cat</u></h1>
            <form id="form" onSubmit={handleSubmit}>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <TextField
                    type='text'
                    name='name'
                    label='Name'
                    required
                    onChange={e => setName(e.target.value)}
                    value={name}
                />
                </div>
                <div style={{display: "grid", gridTemplateColumns: "auto auto auto auto", marginLeft: "10%", marginRight: "10%"}}>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="breed">Breed</InputLabel>
                <Select 
                    labelId="breed" 
                    required
                    onChange={e => setBreed(e.target.value)}
                    value={breed}
                >
                    {catBreedsArray}
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="sex">Sex</InputLabel>
                <Select 
                    labelId="sex" 
                    required
                    onChange={e => setSex(e.target.value)}
                    value={sex}
                >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="age">Age (years)</InputLabel>
                <Input 
                    labelId="age" 
                    type="number"
                    required
                    value={age}
                    onChange={e => setAge(e.target.value)}
                >
                </Input>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="weight">Weight (lbs)</InputLabel>
                <Input 
                    labelId="weight" 
                    type="number"
                    required
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                >
                </Input>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="size">Expected Size When Grown</InputLabel>
                <Select 
                    labelId="size"
                    required 
                    onChange={e => setSize(e.target.value)}
                    value={size}
                >
                    <MenuItem value="Small">Small (less than 10lbs)</MenuItem>
                    <MenuItem value="Medium">Medium (10-15)</MenuItem>
                    <MenuItem value="Large">Large (15-20)</MenuItem>
                    <MenuItem value="XLarge">XLarge (20+ lbs)</MenuItem>

                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="fee">AdoptionFee</InputLabel>
                <Input 
                    labelId="fee" 
                    type="number"
                    required
                    value={fee}
                    onChange={e => setFee(e.target.value)}
                >
                </Input>
                </div>
                
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="state">State</InputLabel>
                <Select labelId="state"
                    required
                    onChange={e => {setState(e.target.value); changeCities(e.target.value)}}
                >
                    {stateList}
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="city">City</InputLabel>
                <Select labelId="city"
                    required
                    onChange={e => {setCity(e.target.value)}}

                >
                    {cityMenuList}
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="status">Status</InputLabel>
                <Select 
                    labelId="status" 
                    type="text"
                    required
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Unvailable">Unvailable</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkDogs">Good With Dogs</InputLabel>
                <Select 
                    labelId="checkDogs" 
                    required
                    onChange={e => setDogs(e.target.value)}
                    value={dogs}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkCats">Good With Cats</InputLabel>
                <Select 
                    labelId="checkCats" 
                    required
                    onChange={e => setCats(e.target.value)}
                    value={cats}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkKids">Good With Kids</InputLabel>
                <Select 
                    labelId="checkKids"
                    required 
                    onChange={e => setKids(e.target.value)}
                    value={kids}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkFence">Fenced Yard Required</InputLabel>
                <Select 
                    labelId="checkFence" 
                    required
                    onChange={e => setFence(e.target.value)}
                    value={fence}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkNeut">Neutered/Spayed</InputLabel>
                <Select 
                    labelId="checkNeut" 
                    required
                    onChange={e => setNeut(e.target.value)}
                    value={neut}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkTrained">House Trained</InputLabel>
                <Select 
                    labelId="checkTrained" 
                    required
                    onChange={e => setTrained(e.target.value)}
                    value={trained}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                <div style={{width:"15vw", height: "7vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkShots">Shots Up To Date</InputLabel>
                <Select 
                    labelId="checkShots" 
                    required
                    onChange={e => setShots(e.target.value)}
                    value={shots}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                </div>
                <InputLabel id="aboutMe">About Me</InputLabel>
                <textarea
                    style={{fontSize: 18}}
                    cols="100"
                    rows="20"
                    name='aboutMe'
                    form="form"
                    onChange={e => setDesc(e.target.value)}
                    value={desc}
                ></textarea>
                <br></br>
                <input
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    name="photo"
                    onChange={e => setFiles(e.target.files)}
                />
                <br></br>
                <Button type='submit'>
                    Add
                </Button>
                <Snackbar
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="Pet added"
                    action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                    }
                />
            </form>
        </div>
    )
}

export default AddCat;
