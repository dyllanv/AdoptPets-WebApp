import React, { useEffect } from 'react'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import ReactDOM from 'react-dom';



const Gallery = () => {

    

    const [value, setValue] = React.useState("No user");
    

    useEffect(() => {

        const check = localStorage.getItem('user')
        if (check) {
            setValue(check)
        }
    }, []);

    return(
        <div style={{width: "95%", marginLeft: "auto", marginRight: "auto"}}>
        <div style={{display: "grid", gridTemplateColumns: "auto auto auto auto auto"}}>
            <div style={{width: "15vw", height: "30vh", borderStyle: "groove", marginLeft: "auto", marginRight: "auto", marginTop: "20%"}}>
                <img src="https://elasticbeanstalk-us-east-2-181021098475.s3.us-east-2.amazonaws.com/cs467/4018.jpeg" style={{width: "100%", height: "100%", objectFit: "cover"}}></img>
            </div>
            <div style={{width: "2.5vw", height: "30vh", marginLeft: "auto", marginRight: "auto"}}></div>
            <div style={{width: "40vw", height: "30vh", marginLeft: "auto", marginRight: "auto", fontSize: "1vw"}}>
                <h1 style={{fontSize: "2.5vw"}}>Welcome to AdoptPets!</h1>
                <h2>We are here to help you find your new best friend!</h2>
                <h3>Here are some of our many features:</h3>
                <p> &bull; Create a user account to favorite animals on the site</p>
                <p> &bull; Create an admin account to manage animals on the site</p>
                <p>&bull; Upload pictures and bios of your animals</p>
                <p>&bull; Search for animals with many different options</p>
                <p>&bull; Keep track of your favorite animals</p>
            </div>
            <div style={{width: "2.5vw", height: "30vh", marginLeft: "auto", marginRight: "auto"}}></div>
            <div style={{width: "15vw", height: "30vh", borderStyle: "groove", marginLeft: "auto", marginRight: "auto", marginTop: "20%"}}>
                <img src="https://elasticbeanstalk-us-east-2-181021098475.s3.us-east-2.amazonaws.com/cs467/image0.jpg" style={{width: "100%", height: "100%", objectFit: "cover"}}></img>

            </div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "auto auto auto auto auto", marginTop: "10%", marginLeft: "auto", marginRight: "auto"}}>
            <div style={{width: "15vw", height: "30vh", borderStyle: "groove", marginLeft: "auto", marginRight: "auto"}}>
                <img src="https://elasticbeanstalk-us-east-2-181021098475.s3.us-east-2.amazonaws.com/cs467/1a36b305-412d-405e-a38b-0947ce6709ba.jpeg" style={{width: "100%", height: "100%", objectFit: "cover"}}></img>
            </div>
            <div style={{width: "15vw", height: "30vh", borderStyle: "groove", marginLeft: "auto", marginRight: "auto"}}>
                <img src="https://elasticbeanstalk-us-east-2-181021098475.s3.us-east-2.amazonaws.com/cs467/3b982f7918b74e2decdaee1fa0d6ca0b.jpg" style={{width: "100%", height: "100%", objectFit: "cover"}}></img>
            </div>
            <div style={{width: "15vw", height: "30vh", borderStyle: "groove", marginLeft: "auto", marginRight: "auto"}}>
                <img src="https://elasticbeanstalk-us-east-2-181021098475.s3.us-east-2.amazonaws.com/cs467/bigstock-Little-Striped-Cute-Kitten-Sit-244080397.jpg" style={{width: "100%", height: "100%", objectFit: "cover"}}></img>
            </div>
            <div style={{width: "15vw", height: "30vh", borderStyle: "groove", marginLeft: "auto", marginRight: "auto"}}>
                <img src="https://elasticbeanstalk-us-east-2-181021098475.s3.us-east-2.amazonaws.com/cs467/download+(1).jpg" style={{width: "100%", height: "100%", objectFit: "cover"}}></img>
            </div>
            <div style={{width: "15vw", height: "30vh", borderStyle: "groove", marginLeft: "auto", marginRight: "auto"}}>
                <img src="https://elasticbeanstalk-us-east-2-181021098475.s3.us-east-2.amazonaws.com/cs467/puppies-cover.jpg" style={{width: "100%", height: "100%", objectFit: "cover"}}></img>
            </div>
        </div>
        </div>
    )
}
export default Gallery;
