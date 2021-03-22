import React, {useState, useEffect, useRef} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import { useHistory } from 'react-router-dom';


const EditUser = () => {

    const [user, setUser] = React.useState({});
    const [id, setId] = React.useState("");
    const history = useHistory();


    useEffect(() => {
        
        async function fetchData() {
            try {
                const val = localStorage.getItem('user');
                const url = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/users/${val}`
                const response = await fetch(url);
                const json = await response.json();
                setUser(json["rows"][0]);
                setId(val);
                console.log(url)
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

     //Send PUT request to user route, check for null fields
    const handleSubmit = (event) => {

        if(user.fname == "" || user.lname == "" || user.email == "" || user.password == "") {
            alert("All fields are required");
            event.preventDefault();
            return;
        }

        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: id,
                password: user.password,
                fname: user.fname,
                lname: user.lname,
                email: user.email,
            })
        };

        var editUrl = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/users/${id}`;

        fetch(editUrl, requestOptions)
            .then(response => response.json()).then(alert("Profile updated"))
            .then(() => history.push("/userdash"))
        console.log(user);
        event.preventDefault();
    }

    //Send delete request with user id
    function deleteHandler() {

        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: id,
            })
        };

        var deleteUrl = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/users/${id}`;

        fetch(deleteUrl, requestOptions)
            .then(response => response.json())
            .then(history.push("/userdash"))
            .then(localStorage.clear())
            .then(window.location.reload())


        console.log(user);
    }

    return(

        <div id="form" style={{marginTop: "5%", marginLeft: "auto", marginRight: "auto"}}>
            <h1><u>User Dashboard</u></h1>
            <form onSubmit={handleSubmit}>
            <div style={{display: "grid", gridTemplateColumns: "auto auto auto auto", marginLeft: "20%", marginRight: "20%", backgroundColor: "rgb(220,220,220)", padding: "2%", borderStyle: "groove"}}>
            <div style={{width:"25%", height: "10vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="fname">
                        First Name
                    </InputLabel>
                    <TextField
                    type='text'
                    name='fname'
                    required
                    label={user.fname ? "" : 'First Name'}
                    onChange={e => {
                        const {name, value} = e.target;
                        setUser(prevState => ({
                            ...prevState,
                            [name]: value
                        }));
                    }}
                    value={user.fname}
                />
                </div>
                <div style={{width:"10vw", height: "7vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="lname">
                        Last Name
                    </InputLabel>
                    <TextField
                        type='text'
                        name='lname'
                        required
                        label={user.lname ? "" : 'Last Name'}
                        onChange={e => {
                            const {name, value} = e.target;
                            setUser(prevState => ({
                                ...prevState,
                                [name]: value
                            }));
                        }}
                        value={user.lname}
                    />
                </div>
                <div style={{width:"10vw", height: "7vh", marginLeft: "auto", marginRight: "auto"}}>
                    <InputLabel id="password">
                        Password
                    </InputLabel>
                    <TextField
                        type='password'
                        name='password'
                        required
                        label={user.password ? "" : 'Password'}
                        onChange={e => {
                            const {name, value} = e.target;
                            setUser(prevState => ({
                                ...prevState,
                                [name]: value
                            }));
                        }}
                        value={user.password}
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
                        label={user.email ? "" : 'Email'}
                        onChange={e => {
                            const {name, value} = e.target;
                            setUser(prevState => ({
                                ...prevState,
                                [name]: value
                            }));
                        }}
                        value={user.email}
                    />
                </div>
                </div>
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
export default EditUser;
