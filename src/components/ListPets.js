import React, {useState, useEffect} from 'react';


const ListPets = (props) => {

    const [pets, setPets] = React.useState([]);

    let {search} = props;

    //Get list of pets depending on search criteria 
    useEffect(() => {
      async function fetchData() {
          try {
            //Check for empty query, need to switch routes if true
              var emptySearch = true;
              var keysList = Object.values(search);
              for(var i = 0; i < keysList.length; i++) {
                if(keysList[i] != "") {
                  emptySearch = false;
                  break;
                }
              }
              
              var url = "";
              //Change backend call depending on empty search
              if(emptySearch){
                url = new URL("http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/pets/");
              }
              else{
                url = new URL("http://adoptpets.eba-uxjrmpet.us-east-2.elasticbeanstalk.com/pets/search");
                Object.keys(search).forEach(function(key) {
                  if(search[key] != ""){
                    url.searchParams.append(key, search[key]);
                  };
                });

              }
              const response = await fetch(url);
              const json = await response.json();
              console.log(url);
              console.log(json);
              setPets(json["rows"]);
          } catch (e) {
              console.error(e);
              alert("Search failed, please reload page and try again")
          }
      };
      fetchData();
    }, [search]);

    return(
      <div style={{display: "grid", gridTemplateColumns: "auto auto auto"}}>
        {pets.map((pet) => (
          <a href={`/pet/${pet.petId}`} style={{textAlign: "center", width: "20vw", height: "40vh", backgroundColor: "rgb(220,220,220)", borderStyle: "solid", color: 'inherit', textDecoration: 'inherit'}}>
            <div style={{width: "20vw", height: "80%"}}>
                <img src={pet.photo1} style={{width: "100%", height: "100%", objectFit: "cover"}}/>
            </div>
            <div>
              {pet.name}
              <br></br>
              {`${pet.sex}, ${pet.ageGroup}`}
              <br></br>
              {`${pet.city}, ${pet.state}`}
            </div>
          </a>                        
        ))}
      </div>
    )
}
export default ListPets;
