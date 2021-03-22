import React, {useState, useEffect, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import { useHistory } from 'react-router-dom';


const cityStates = require('../updated_cities_states.json');

const EditAdmin = () => {

    const [admin, setAdmin] = React.useState({});
    const [cityList, setCityList] = React.useState([]);
    const [id, setId] = React.useState("");
    const [state, setState] = React.useState("");
    const [city, setCity] = React.useState("");
    const history = useHistory();


    useEffect(() => {

        async function fetchData() {
            try {
                const val = localStorage.getItem('admin');
                const url = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/admin/${val}`
                const response = await fetch(url);
                const json = await response.json();
                setAdmin(json["rows"][0]);
                setState(json["rows"][0]["state"]);
                setCityList(cityStates[json["rows"][0]["state"]]);
                setCity(json["rows"][0]["city"])

                setId(val);
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
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

    
    //Send PUT request to admin route, check for null fields
    const handleSubmit = (event) => {

        var array = Object.values(admin);
        for(var i = 0; i < array.length; i++) {
            if(array[i] == "") {
                alert("All fields are required");
                event.preventDefault();
                return;
            }
        }

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                aboutMe: admin.aboutMe,
                password: admin.password,
                shelterName: admin.shelterName,
                fname: admin.fname,
                lname: admin.lname,
                email: admin.email,
                website: admin.website,
                phone: admin.phone,
                city: admin.city,
                sellerId: id,
                state: admin.state,
            })
        };

        const editUrl = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/admin/${id}`
        fetch(editUrl, requestOptions)
            .then(response => response.json()).then(alert("Profile updated"))
        console.log(admin);
        
        event.preventDefault();
    }

    //Send delete request with admin id
    function deleteHandler() {

        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sellerId: id,
            })
        };

        var deleteUrl = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/admin/${id}`;
        fetch(deleteUrl, requestOptions)
            .then(response => response.json())
            .then(history.push("/userdash"))
            .then(localStorage.clear())
            .then(window.location.reload())
    }

    return(

        <div id="form" style={{marginTop: "5%", marginLeft: "auto", marginRight: "auto"}}>
            <h1><u>Admin Dashboard</u></h1>
            <form onSubmit={handleSubmit}>
            <div style={{display: "grid", gridTemplateColumns: "auto auto auto", marginLeft: "10%", marginRight: "10%"}}>
            <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="shelterName">
                        Shelter Name
                    </InputLabel>
                    <TextField
                        type='text'
                        name='shelterName'
                        focused="true"
                        required
                        onChange={e => {
                            const {name, value} = e.target;
                            setAdmin(prevState => ({
                                ...prevState,
                                [name]: value
                            }));
                        }}
                        value={admin.shelterName}
                    />
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="password">
                        Password
                    </InputLabel>
                    <TextField
                        type='password'
                        name='password'
                        required
                        onChange={e => {
                            const {name, value} = e.target;
                            setAdmin(prevState => ({
                                ...prevState,
                                [name]: value
                            }));
                        }}
                        value={admin.password}
                    />
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="fname">
                        First Name
                    </InputLabel>
                    <TextField
                        type='text'
                        name='fname'
                        required
                        onChange={e => {
                            const {name, value} = e.target;
                            setAdmin(prevState => ({
                                ...prevState,
                                [name]: value
                            }));
                        }}
                        value={admin.fname}
                    />
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="lname">
                        Last Name
                    </InputLabel>
                    <TextField
                        type='text'
                        name='lname'
                        required
                        onChange={e => {
                            const {name, value} = e.target;
                            setAdmin(prevState => ({
                                ...prevState,
                                [name]: value
                            }));
                        }}
                        value={admin.lname}
                    />
                </div>
                <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="phone">
                        Phone Number
                    </InputLabel>
                    <TextField
                        type='tel'
                        name='phone'
                        required
                        onChange={e => {
                            const {name, value} = e.target;
                            setAdmin(prevState => ({
                                ...prevState,
                                [name]: value
                            }));
                        }}
                        value={admin.phone}
                    />
                </div>
                <div style={{width:"10vw", height: "7vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="email">
                        Email
                    </InputLabel>
                    <TextField
                        type='email'
                        name='email'
                        required
                        onChange={e => {
                            const {name, value} = e.target;
                            setAdmin(prevState => ({
                                ...prevState,
                                [name]: value
                            }));
                        }}
                        value={admin.email}
                    />
                </div>
                <div style={{width:"10vw", height: "7vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="email">
                        Website
                    </InputLabel>
                    <TextField
                        type='text'
                        name='website'
                        required
                        onChange={e => {
                            const {name, value} = e.target;
                            setAdmin(prevState => ({
                                ...prevState,
                                [name]: value
                            }));
                        }}
                        value={admin.website}
                    />
                </div>
                <div style={{width:"10vw", height: "7vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="state">State</InputLabel>
                    <Select 
                        labelId="state"
                        name='state'
                        required
                        value={admin.state ?? state}
                        onChange={e => {
                            const {name, value} = e.target;
                            setAdmin(prevState => ({
                                ...prevState,
                                [name]: value
                            })); 
                            changeCities(e.target.value);}}
                    >
                        {stateList}
                </Select>
                </div>
                <div style={{width:"10vw", height: "7vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="city">City</InputLabel>
                    <Select 
                        labelId="city"
                        name='city'
                        required
                        value={admin.city ?? city}
                        onChange={e => {
                            const {name, value} = e.target;
                            setAdmin(prevState => ({
                                ...prevState,
                                [name]: value
                            })); 
                         }}

                >
                        {cityMenuList}
                    </Select>
                </div>
                </div>
                <br></br>
                <Button type='submit' style={{backgroundColor: "#4169E1", color: "white"}}>
                    Update
                </Button>
                    
            </form>
            <Button color='secondary' onClick={() => {if(window.confirm('Are you sure you want to delete?')){ deleteHandler()};}}>
                Delete
            </Button>
        </div>
        
    )

}
export default EditAdmin;
