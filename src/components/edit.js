import React, {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import {catBreedsArray} from './breeds'
import {dogBreedsArray} from './breeds'
import Typography from '@material-ui/core/Typography'


const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png"
  ];

const cityStates = require('../updated_cities_states.json');

const Edit = () => {

    const [pet, setPet] = React.useState({});
    const [photo, setPhoto] = React.useState(null);
    const [cityList, setCityList] = React.useState([]);
    const [value, setValue] = React.useState("");

    let {id} = useParams();
    const url = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/pet/${id}`
    const editUrl = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/pets/${id}`


    //Get existing pet data from backend, initialize city list from state
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(url);
                const json = await response.json();
                setPet(json["rows"][0]);
                setCityList(cityStates[json["rows"][0]["state"]]);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
        const check = localStorage.getItem('admin')
        if (check) {
            setValue(check)
        }
    }, []);

    //Change city list depending on state
    function changeCities(name) {
        var list = cityStates[name];
        setCityList(list);
    }
    var stateList = [];
    Object.keys(cityStates).forEach(state =>
        stateList.push(<MenuItem value={state}>{state}</MenuItem>)
    )
    var cityMenuList = [];
    cityList.forEach(city =>
        cityMenuList.push(<MenuItem value={city}>{city}</MenuItem>)
    )

    //Select breed list depending on animal
    function selectBreedList() {
        if(pet.animal == "Dog") {
            return dogBreedsArray;
        }
        else if(pet.animal == "Cat") {
            return catBreedsArray;
        }
        else {
            return null;
        }
    }
    
    //Form handler, send PUT request to pet handler
    const handleSubmit = (event) => {

        if(pet.name == "" || pet.age == "" || pet.weight == "" || pet.adoptionFee == "" || pet.city == "" || pet.state == "") {
            alert("Name, age, weight, city, state, and adoption fee cannot be null");
            event.preventDefault();
            return;
        }

        if(pet.weight < 0 || pet.age < 0 || pet.adoptionFee < 0) {
            alert("Age, weight, and adoption fee cannot be negative");
            event.preventDefault();
            return;
        }

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sellerId: pet.sellerId,
                status: pet.status,
                animal: pet.animal,
                name: pet.name,
                breed: pet.breed,
                sex: pet.sex,
                age: pet.age,
                weight: pet.weight,
                size: pet.size,
                adoptionFee: pet.adoptionFee,
                aboutMe: pet.aboutMe,
                city: pet.city,
                state: pet.state,
                goodWithKids: pet.goodWithKids,
                goodWithDogs: pet.goodWithDogs,
                goodWithCats: pet.goodWithCats,
                requiresFence: pet.requiresFence,
                houseTrained: pet.houseTrained,
                neuteredSpayed: pet.neuteredSpayed,
                shotsUpToDate: pet.shotsUpToDate,
                petId: pet.petId,
            })
        };
        fetch(editUrl, requestOptions)
            .then(response => response.json())
        console.log(pet);
        event.preventDefault();
    }

    //Receive pet id, url, and photo number, send DELETE to photo handler
    function deleteHandler(id, photoNum, petUrl) {
        
        const deleteUrl = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/photo`
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json','Accept': 'application/json' },
            body: JSON.stringify({
                petId:id,
                photoX:photoNum,
                photoUrl:petUrl
            })
        };
        console.log(JSON.stringify({
            petId:id,
            photoX:photoNum,
            photoUrl:petUrl
        }))
        fetch(deleteUrl, requestOptions).then(response => {response.json(); window.location.reload()});
    }

    //Receive pet id and photo number, send POST to photo handler with new image
    function editHandler(id, photoNum) {

        if (photo === null) {
            alert("You need to upload an image file");
            return;
        }
        if(!SUPPORTED_FORMATS.includes(photo.type)) {
            alert("Invalid file type");
            setPhoto(null);
            return;
        }
        var data = new FormData();
        data.append("petId", id);
        data.append("photoX", photoNum);
        data.append("photo", photo);
        const editUrl = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/photo`
        const requestOptions = {
            method: 'POST',
            body: data
        };
        for (var value of data.values()) {
            console.log(value);
        }
        fetch(editUrl, requestOptions).then(response => {response.json(); window.location.reload()});
    }

    //Check for admin id and render nothing if not found or not equal to pet's seller id
    if(!value || value.length === 0 || value != pet.sellerId) {
        return(
            <Typography>
                You do not have permission to access this page.
            </Typography>
        )
    }

    return(

        <div style={{marginTop: "5%"}}>
            <h1><u>Edit Pet</u></h1>
            <form id="form" onSubmit={handleSubmit}>
            <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
            <TextField
                    type='text'
                    name='name'
                    required
                    style={{marginLeft: "auto", marginRight: "auto"}}
                    label={pet.name ? "" : 'Name'}
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.name}
                />
                </div>
                <div style={{display: "grid", gridTemplateColumns: "auto auto auto auto", marginLeft: "10%", marginRight: "10%"}}>
                
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="breed">Breed</InputLabel>
                <Select 
                    labelId="breed"
                    name="breed" 
                    required
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.breed}
                >
                    {selectBreedList()}
                </Select>
                </div>
                
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="sex">Sex</InputLabel>
                <Select 
                    labelId="sex"
                    name="sex" 
                    required
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.sex}
                >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="age">Age</InputLabel>
                <Input 
                    labelId="age"
                    name="age" 
                    type="number"
                    required
                    value={pet.age}
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                >
                </Input>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="weight">Weight (lbs)</InputLabel>
                <Input 
                    labelId="weight" 
                    type="number"
                    name="weight"
                    required
                    value={pet.weight}
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                >
                </Input>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="size">Size</InputLabel>
                <Select 
                    labelId="size"
                    name="size" 
                    required
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.size}
                >
                    <MenuItem value="Small">Small</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Large">Large</MenuItem>
                    <MenuItem value="XLarge">XLarge</MenuItem>

                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="fee">Adoption Fee</InputLabel>
                <Input 
                    labelId="fee" 
                    type="number"
                    name="adoptionFee"
                    required
                    value={pet.adoptionFee}
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                >
                </Input>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="status">Status</InputLabel>
                <Select 
                    labelId="status"
                    name="status" 
                    type="text"
                    required
                    value={pet.status}
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                >
                    <MenuItem value="Available">Available</MenuItem>
                    <MenuItem value="Unavailable">Unavailable</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Adopted!">Adopted!</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="state">State</InputLabel>
                <Select 
                    labelId="state"
                    name='state'
                    required
                    value={pet.state}
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        })); 
                        changeCities(e.target.value);}}
                >
                    {stateList}
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="city">City</InputLabel>
                <Select 
                    labelId="city"
                    name='city'
                    required
                    value={pet.city}
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        })); 
                    }}

                >
                    {cityMenuList}
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkDogs">Good with dogs</InputLabel>
                <Select 
                    labelId="checkDogs"
                    name="goodWithDogs" 
                    required
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.goodWithDogs}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkCats">Good with cats</InputLabel>
                <Select 
                    labelId="checkCats"
                    name="goodWithCats" 
                    required
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.goodWithCats}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkKids">Good with kids</InputLabel>
                <Select 
                    labelId="checkKids"
                    name="goodWithKids" 
                    required
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.goodWithKids}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkFence">Fenced yard required</InputLabel>
                <Select 
                    labelId="checkFence"
                    name="requiresFence" 
                    required
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.requiresFence}
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
                    name="neuteredSpayed" 
                    required
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.neuteredSpayed}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkTrained">Housetrained</InputLabel>
                <Select 
                    labelId="checkTrained"
                    name="houseTrained"
                    required
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.houseTrained}
                >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                    <MenuItem value="UNKNOWN">UNKNOWN</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="checkShots">Shots up to date: {pet.shotsUpToDate}</InputLabel>
                <Select 
                    labelId="checkShots" 
                    name="shotsUpToDate"
                    required
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.shotsUpToDate}
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
                    label={pet.aboutMe ? "" : 'About me'}
                    onChange={e => {
                        const {name, value} = e.target;
                        setPet(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={pet.aboutMe}
                />
             
                <br></br>
                
                <br></br>


                <Button type='submit' style={{backgroundColor: "#4169E1", color: "white"}}>
                    Update
                </Button>
            </form>
            <hr></hr>
            <div style={{display: "grid", gridTemplateColumns: "auto auto auto", width: "80vw", marginLeft: "auto", marginRight: "auto"}}>
            {
                Object.keys(pet).map(function(key) {

                    if(!key.includes("photo")) {
                        return null;
                    }
                    else if (key == "photo1") {
                        return <div style={{textAlign: "center", width: "20vw", height: "40vh", backgroundColor: "rgb(220,220,220)", borderStyle: "solid", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}}>
                                    <div style={{width: "20vw", height: "90%"}}>
                                        <img src={pet[key]} style={{width: "100%", height: "100%", objectFit: "cover"}}></img> 
                                    </div>
                                    <div>
                                        <input type="file" name="photo" onChange={e => setPhoto(e.target.files[0])}/>
                                        <Button onClick={() => {editHandler(pet["petId"], key)}}>
                                            Change
                                        </Button>
                                    </div>
                                </div>       
                    }
                    else if (pet[key] !== null) {
                        return <div style={{textAlign: "center", width: "20vw", height: "40vh", backgroundColor: "rgb(220,220,220)", borderStyle: "solid", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}}>
                                    <div style={{width: "20vw", height: "90%"}}>
                                        <img src={pet[key]} style={{width: "100%", height: "100%", objectFit: "cover"}}></img>
                                    </div>
                                    <Button style={{color: "red"}} onClick={() => {if(window.confirm('Are you sure you want to delete?')){ deleteHandler(pet["petId"], key, pet[key])};}}>
                                        Delete
                                    </Button>
                                    {/* <div>
                                        <input type="file" name="photo" onChange={e => setPhoto(e.target.files[0])}/>
                                        <Button onClick={() => {editHandler(pet["petId"], key)}}>
                                            Add
                                        </Button>
                                    </div> */}
                                    
                        </div>      
                    }
                    else {
                        return <div style={{display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                                    {/* {pet[key] ? <img src={pet[key]} width="300" height="300" ></img> : null}
                                   
                                    <Button onClick={() => {if(window.confirm('Are you sure you want to delete?')){ deleteHandler(pet["petId"], key, pet[key])};}}>
                                        Delete
                                    </Button> */}
                                    <div>
                                        <input type="file" name="photo" onChange={e => setPhoto(e.target.files[0])}/>
                                        <Button onClick={() => {editHandler(pet["petId"], key)}}>
                                            Add
                                        </Button>
                                    </div>
                                    {/* <form method="POST" enctype="multipart/form-data" action="/photo">
                                        <input type="hidden" name="petId" name={pet["petId"]}/>
                                        <input type="hidden" name="photoX" value={key}/>
                                        Photo<input type="file" name="photo"/>
                                        <input type="submit"/>
                                    </form> */}
                                    
                                </div>     
                        }       
                    } 
                )
            }
            </div>
        </div>
        
    )

}
export default Edit;
