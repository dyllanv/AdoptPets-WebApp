import React, {useState, useEffect} from 'react';
import SearchFilter from './SearchFilter';
import ListPets from './ListPets'

const SearchPage = () => {

    const [search, setSearch] = React.useState({});

    //Handler to set search, passed to SearchFilter component
    const handleSearch = obj => {
        setSearch(obj);
    };
    
    
    return(
        <div style={{width: "95%", display: "grid", gridTemplateColumns: "auto auto", marginLeft: "auto", marginRight: "auto", fontSize: "2vh"}}>
            <div style={{width: "25vw", marginLeft: "auto", marginRight: "auto", marginTop: "15%"}}>
                <h1>Search Filters:</h1>
                <SearchFilter search={search} handleSearch={handleSearch}/>
            </div>
            <div style={{width: "65vw", marginLeft: "auto", marginRight: "auto", marginTop: "5%"}}>
                <h1>Pets Matching Your Search</h1>
                <ListPets search={search}/>
            </div>
            
        </div>
    )
}

export default SearchPage;
