import React, {useEffect} from 'react'
import MaterialTable from 'material-table'
import Typography from '@material-ui/core/Typography'
import Tab from '@material-ui/core/Tab'
import {Link} from 'react-router-dom'



const Admin = () => {

    const [pets, setPets] = React.useState([]);
    const [value, setValue] = React.useState("");

    //Load admin id
    useEffect(() => {

        const val = localStorage.getItem('admin');
        setValue(val);
        const url = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/admin/${val}/pets`
		fetch(url)
			.then((response) => response.json())
			.then((data) => setPets(data["rows"]))
        
	}, [pets])

    //Receive pet id and send delete request to backend
    function deleteHandler(id) {

        const deleteUrl = `http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/pets/${id}`
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json','Accept': 'application/json' },
        };
        console.log(id);
        fetch(deleteUrl, requestOptions).then(response => response.json())
    }

    //Check for admin id and render nothing if not found
    if(!value || value.length === 0) {
        return(
            <Typography>
                You do not have permission to access this page.
            </Typography>
        )
    }

    //Render dashboard components
    return(
        <div style={{width: "90%", marginLeft: "auto", marginRight: "auto"}}>
            <Tab label="Add Dog" to="/addDog" component={Link} /> 
            <Tab label="Add Cat" to="/addCat" component={Link} />
            <Tab label="Add Other" to="/addAnimal" component={Link} />
            <br></br>
            <MaterialTable
                title="Pets"
                columns={[
                    { title: 'Animal', field: 'animal' },
                    { title: 'Name', field: 'name' },
                    { title: 'Breed', field: 'breed' },
                    { title: 'Age', field: 'age', type: 'numeric' },
                    { title: 'Sex', field: 'sex'},
                    { title: 'Weight', field: 'weight', type: 'numeric' },
                    { title: 'City', field: 'city'},
                    { title: 'State', field: 'state'},
                    { title: 'View', field: 'petId', render: rowData => <Link to={"/pet/" + rowData.petId}>View</Link>},    //Send to pet's page
                    { title: 'Edit', field: 'petId', render: rowData => <Link to={"/edit/" + rowData.petId}>Edit</Link>},   //Send to pet's edit page
                    { title: 'Delete', field: 'petId', render: rowData => <Link to={"/admin"} onClick={() => {if(window.confirm('Are you sure you want to delete?')){ deleteHandler(rowData.petId)};}}>Delete</Link>}

                ]}
                data={pets}        
            />
        </div>
        
    )
}
export default Admin;
