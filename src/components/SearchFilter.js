import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import {dogBreedsArray} from './breeds'
import {catBreedsArray} from './breeds'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'

const data = require('../updated_cities_states.json');


const SearchFilter = (props) => {

    const [sex, setSex] = React.useState("");
    const [breed, setBreed] = React.useState("");
    const [age, setAge] = React.useState("");
    const [animal, setAnimal] = React.useState("");
    const [size, setSize] = React.useState("");
    const [st, setSt] = React.useState("");
    const [city, setCity] = React.useState("");
    const [cityList, setCityList] = React.useState([]);
    const [dogs, setDogs] = React.useState(false);
    const [cats, setCats] = React.useState(false);
    const [kids, setKids] = React.useState(false);
    const [fence, setFence] = React.useState(false);
    const [trained, setTrained] = React.useState(false);
    const [neut, setNeut] = React.useState(false);
    const [shots, setShots] = React.useState(false);
    const [distance, setDistance] = React.useState(50);
    const [breedList, setBreedList] = React.useState([]);

    let {search, handleSearch} = props;

    //Update search object with form properties 
    const handleSubmit = (event) => {
  
        if(city == "" || st == "" || animal == "") {
            alert("You need to select an animal, state, and city");
            event.preventDefault();
            return;
        }
        var newSearch = {
            animal:animal,
            breed:breed == "Any" ? "" : breed,
            sex:sex,
            ageGroup:age,
            size:size,
            city:city,
            state:st,
            distance:distance,
            goodWithKids:kids ? "Yes": "",
            goodWithDogs:dogs ? "Yes": "",
            goodWithCats:cats ? "Yes": "",
            requiresFence:fence ? "Yes": "",
            houseTrained: trained ? "Yes": "",
            neuteredSpayed:neut ? "Yes": "",
            shotsUpToDate:shots ? "Yes": ""
        };
        handleSearch(newSearch);
        event.preventDefault();
    }

    //Select breed list depending on animal
    function changeBreeds(animal) {
        if(animal == "Dog"){
            setBreedList(dogBreedsArray);
        }
        else if (animal == "Cat") {
            setBreedList(catBreedsArray);
        }
        else {
            setBreedList([]);
        }
    }

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

    

    return(
        <div style={{}}>
            <form id="form" onSubmit={handleSubmit}>
            <div style={{display: "grid", gridTemplateColumns: "auto auto"}}>
                <div style={{width:"50%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="animal">Animal</InputLabel>
                <Select labelId="animal"
                    onChange={e => {setAnimal(e.target.value); changeBreeds(e.target.value)}}
                >
                    <MenuItem value="Dog">Dog</MenuItem>
                    <MenuItem value="Cat">Cat</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </Select>
                </div>
                <div style={{width:"50%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="breed">Breed</InputLabel>
                <Select labelId="breed"
                    onChange={e => setBreed(e.target.value)}
                >
                    {breedList}
                </Select>
                </div>
                
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="sex">Sex</InputLabel>
                <Select labelId="sex"
                    onChange={e => setSex(e.target.value)}
                >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="age">Age</InputLabel>
                <Select labelId="age"
                    onChange={e => setAge(e.target.value)}
                >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="Baby">Baby</MenuItem>
                    <MenuItem value="Young">Young (1-3)</MenuItem>
                    <MenuItem value="Adult">Adult (4-8)</MenuItem>
                    <MenuItem value="Senior">Senior (9+)</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="size">Size</InputLabel>
                <Select labelId="size"
                    onChange={e => setSize(e.target.value)}
                >
                    <MenuItem value="">Any</MenuItem>
                    <MenuItem value="Small">Small</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Large">Large</MenuItem>
                    <MenuItem value="XLarge">Extra Large</MenuItem>
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="state">State</InputLabel>
                <Select labelId="state"
                    onChange={e => {setSt(e.target.value); changeCities(e.target.value)}}
                >
                    {stateList}
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="city">City</InputLabel>
                <Select labelId="city"
                    onChange={e => {setCity(e.target.value)}}

                >
                    {cityMenuList}
                </Select>
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                <InputLabel id="distance">Distance (miles)</InputLabel>
                <Select labelId="distance"
                     onChange={e => {setDistance(e.target.value)}}
                >
                    <MenuItem value="10000">Anywhere</MenuItem>
                    <MenuItem value="10">10</MenuItem>
                    <MenuItem value="25">25</MenuItem>
                    <MenuItem value="50">50</MenuItem>
                    <MenuItem value="100">100</MenuItem>
                </Select>
                </div>
                </div>
                <FormGroup row style={{justifyContent: 'center'}}>
                <FormControlLabel
                    control={<Checkbox checked={dogs} onChange={e => setDogs(!dogs)} name="dogs" />}
                    label="Good with dogs"
                />
                <FormControlLabel
                    control={<Checkbox checked={cats} onChange={e => setCats(!cats)} name="cats" />}
                    label="Good with cats"
                />
                <FormControlLabel
                    control={<Checkbox checked={kids} onChange={e => setKids(!kids)} name="kids" />}
                    label="Good with kids"
                />
                <FormControlLabel
                    control={<Checkbox checked={fence} onChange={e => setFence(!fence)} name="fence" />}
                    label="Fence required"
                />
                <FormControlLabel
                    control={<Checkbox checked={trained} onChange={e => setTrained(!trained)} name="trained" />}
                    label="Housetrained"
                />
                <FormControlLabel
                    control={<Checkbox checked={neut} onChange={e => setNeut(!neut)} name="neut" />}
                    label="Neutered/Spayed"
                />
                <FormControlLabel
                    control={<Checkbox checked={shots} onChange={e => setShots(!shots)} name="shots" />}
                    label="Shots up to date"
                />
                </FormGroup>
                <Button type='submit'>
                    Search
                </Button>
            </form>
            </div>
    )

}
export default SearchFilter;
