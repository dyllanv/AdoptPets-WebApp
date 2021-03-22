import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar'
import Gallery from './components/Gallery'
import ListPets from './components/ListPets'
import AddDog from './components/AddDog'
import AddCat from './components/AddCat'
import AddAnimal from './components/AddAnimal'
import AddTest from './components/AddTest'
import Admin from './components/Admin'
import SearchPage from './components/SearchPage'
import SearchFilter from './components/SearchFilter'
import Grid from '@material-ui/core/Grid'
import Edit from './components/edit'
import Pet from './components/Pet'
import Favorites from './components/Favorites'
import LoginAdmin from './components/adminLogin'
import LoginUser from './components/userLogin'
import EditUser from './components/EditUser'
import EditAdmin from './components/EditAdmin'
import UserRegister from './components/userRegister'
import AdminRegister from './components/adminRegister'


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link, Redirect
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <Switch>
          <Route exact path="/" render={() => (
            <Redirect to="/userdash"/>
          )}/>
          <Route path="/userdash">
            <Gallery/>
          </Route>
          <Route path="/search">
            <Grid container direction="row">
              {/* <SearchFilter/>
              <ListPets/> */}
              <SearchPage/>
            </Grid>
            
          </Route> 
          <Route path="/addDog">
            <AddDog/>
          </Route>
          <Route path="/addCat">
            <AddCat/>
          </Route>  
          <Route path="/addAnimal">
            <AddAnimal/>
          </Route>  
          <Route path="/addTest">
            <AddTest/>
          </Route>  
          <Route path="/admin">
            <Admin/>
          </Route> 
          <Route path="/edit/:id">
            <Edit  />
          </Route>
          <Route path="/pet/:id">
            <Pet/>
          </Route>
          <Route path="/favorites/">
            <Favorites/>
          </Route>
          <Route path="/userLogin">
            <LoginUser/>
          </Route>
          <Route path="/adminLogin">
            <LoginAdmin/>
          </Route>
          <Route path="/EditUser">
            <EditUser/>
          </Route>
          <Route path="/EditAdmin">
            <EditAdmin/>
          </Route>
          <Route path="/UserRegister">
            <UserRegister/>
          </Route>
          <Route path="/AdminRegister">
            <AdminRegister/>
          </Route>
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;