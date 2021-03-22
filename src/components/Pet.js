import React, {useState, useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import test from '../testImg.jpg'
import { useParams } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';


const Pet = () => {

    const [pet, setPet] = React.useState({});
    const [check, setCheck] = React.useState(false);
    var photos = [];
    let {id} = useParams();
    const url = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/pet/${id}`
    const val = localStorage.getItem('user');
    const favsUrl = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/favorites/${val}`
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(url);
                const json = await response.json();

                const favsReponse = await fetch(favsUrl);
                const favsJson = await favsReponse.json();
                for(var i = 0; i < favsJson["rows"].length; i++) {
                    if(favsJson["rows"][i]["petId"] == id) {
                        
                        setCheck(true);
                        break;
                    } 
                }
                setPet(json["rows"][0]);

            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
        console.log(pet);
    }, []);

    function favoriteHandler() {

        if (val == "" || val === null) {
            alert("You must be logged in with a User account to add favorites.");
            return;
            
        }
        if(check) {
            alert("Pet is already in your favorites");
            return;
        }
        const favsUrl = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/favorites`
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','Accept': 'application/json' },
            body: JSON.stringify({
                userId:val,
                petId:id
            })
        };
        console.log(`Added pet ${id} and user ${val}`);
        fetch(favsUrl, requestOptions).then(response => response.json()).then(() => alert("Pet added to favorites"))
    }

    function yesOrNo(string) {
        if (string == "Yes") {
            return <p>&#9989;</p>;
        }
        else if (string == "No") {
            return <p>&#10060;</p>;
        }
        else {
            return <p>N/A</p>;
        }
    }

    function sizeWeight(animal, size) {
        if (animal=="Dog" && size=="Small") {
            return <p><b>Expected Size: </b>Small (less than 25lbs)</p>
        }
        else if (animal=="Dog" && size=="Medium") {
            return <p><b>Expected Size: </b>Medium (25-60lbs)</p>
        }
        else if (animal=="Dog" && size=="Large") {
            return <p><b>Expected Size: </b>Large (60-100lbs)</p>
        }
        else if (animal=="Dog" && size=="Xlarge") {
            return <p><b>Expected Size: </b>XLarge (100+ lbs)</p>
        }
        if (animal=="Cat" && size=="Small") {
            return <p><b>Expected Size: </b>Small (less than 10lbs)</p>
        }
        else if (animal=="Cat" && size=="Medium") {
            return <p><b>Expected Size: </b>Medium (10-15)</p>
        }
        else if (animal=="Cat" && size=="Large") {
            return <p><b>Expected Size: </b>Large (15-20)</p>
        }
        else if (animal=="Cat" && size=="Xlarge") {
            return <p><b>Expected Size: </b>XLarge (20+ lbs)</p>
        }
        else {
            return <p><b>Expected Size: </b>{size}</p>
        }

    }
            
    function linkToWebsite(url) {
        if (!url) {return;}
        if (url.includes("http://") || url.includes("https://")) {
            return <p><b>Website: </b><a href={url}>{url}</a></p>
        }
        else {
            return <p><b>Website: </b><a href={`https://${url}`}>{url}</a></p>;
        }
    }

    return (

    <div style={{fontSize: "1vw", marginBottom: "10vh", marginLeft: "auto", marginRight: "auto"}}>
        <div style={{display: "grid", gridTemplateColumns: "auto auto"}}>
            <div style={{width: "30vw", marginLeft: "15%", gridArea: 1/1/1/1}}>
                <h1 style={{fontSize: "3vw"}}>Hi, I'm {pet["name"]}!</h1>
                {Object.keys(pet).map(function(key) {
                    if (String(key).includes("photo") && pet[key] ) {
                        photos.push(pet[key]);
                        return 
                    }
                    else return
                })}
                <Carousel>
                    {photos.map(function(image) {
                        return (
                            <div style={{width: "30vw", height: "50vh"}}>
                                <img src={image} style={{width: "100%", height: "100%", objectFit: "contain"}}/>
                            </div>
                        )
                    })}
                </Carousel>
                <Button style={{width: "100%", fontSize: "1vw", backgroundColor: "#4169E1"}} onClick={() => favoriteHandler()}>
                    😊 Add to Favorites 😊
                </Button>
            </div>

        <div style={{width: "40vw", marginTop: "15%", gridArea: 1/2/1/2}}>
            <div style={{borderStyle: "groove", backgroundColor: "rgb(220,220,220)"}}>
                <h1>Shelter Information</h1>
                    <div>
                        <p><b>{pet["shelterName"]}</b> </p>
                    </div>
                    <div>
                        <p>
                            <b>Email: </b><a href={"mailto:"+pet["email"]}>{pet["email"]}</a>
                        </p>
                    </div>
                    <div>
                        {linkToWebsite(pet["website"])}
                    </div>        
            </div>
            <br></br>
            <div style={{}}>
                <div style={{borderStyle: "groove", backgroundColor: "rgb(220,220,220)"}}>
                    <h1>Facts About {pet["name"]}</h1>
                    <div style={{display: "grid", gridTemplateColumns: "auto auto"}}>
                        <div style={{}}>
                            <p><b>Adoption Status:</b> {pet["status"]}</p>
                        </div>
                        <div>
                            <p><b>Breed:</b> {pet["breed"]}</p>
                        </div>
                        <div>
                            <p><b>Sex:</b> {pet["sex"]}</p>
                        </div>
                        <div>
                            <p><b>Age:</b> {pet["ageGroup"]}</p>
                        </div>
                        <div>
                            <p><b>Weight:</b> {pet["weight"]}lbs</p>
                        </div>
                        <div>
                            {sizeWeight(pet["animal"], pet["size"])}
                        </div>
                        <div>
                            <p><b>Adoption Fee:</b> ${pet["adoptionFee"]}</p>
                        </div>
                        <div>
                            <p><b>Location:</b> {pet["city"]}, {pet["state"]}</p>
                        </div>
                    </div>
                </div>
                <br></br>
                <div style={{borderStyle: "groove", backgroundColor: "rgb(220,220,220)"}}>
                    <h2 style={{textAlign: "center"}}>Things You Should Know About Me</h2>
                    <div style={{display: "grid", gridTemplateColumns: "auto auto auto"}}>

                        <div>
                            <p><b>Good With Kids</b></p>
                            {yesOrNo(pet["goodWithKids"])}
                        </div>
                        <div>
                            <p><b>Good With Dogs</b></p>
                            {yesOrNo(pet["goodWithDogs"])}
                        </div>
                        <div>
                            <p><b>Good With Cats</b></p>
                            {yesOrNo(pet["goodWithCats"])}
                        </div>
                        <div>
                            <p><b>Requires Fence</b></p>
                            {yesOrNo(pet["requiresFence"])}
                        </div>
                        <div>
                            <p><b>Spayed/Neutered</b></p>
                            {yesOrNo(pet["neuteredSpayed"])}
                        </div>
                        <div>
                            <p><b>Shots Up To Date</b></p>
                            {yesOrNo(pet["shotsUpToDate"])}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <div style={{alignText: "center", borderStyle: "groove", backgroundColor: "rgb(220,220,220)", width: "60%", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}}>
            <h1>About Me!</h1>
            <p style={{fontSize: "1vw", textAlign: "left"}}>{pet["aboutMe"]}</p>
        </div>
        
        
    </div>
    );
}

export default Pet;
