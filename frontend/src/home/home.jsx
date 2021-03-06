import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import './home.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { Button} from 'semantic-ui-react'
import Login from '../login/login.jsx'
import NavBar from '../nav-bar/nav-bar.jsx'

import treasureMapImg from './treasure-map.png';
import foundImg from './found.png';

import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import firebase from 'firebase';

class Home extends Component {
    constructor() {
        super();

        this.state = {
          user: {
          },
        };

        this.auth = app.auth();

      }

    componentDidMount() {
      this.auth.onAuthStateChanged(user => {
        if(user){
  				this.setState({ user }) ;
  				let db = firebase.firestore();
  				db.collection("userRoles")
  				 .doc(user.uid)
  				 .get()
  				 .then((item) => {
  					 let data = item.data();
  					 if(data && data.isAdmin == true){
  						 user.isAdmin = data.isAdmin;
  						 this.setState({ user }) ;

  					 }
  					 console.log(user);
  				 })
  			}else{
  				 this.setState({ user: null });
  			}
      });
    }

    handleChange(e) {
      this.setState({ [e.target.name]: e.target.value });
      console.log(this.state);
    }


    render() {
        console.log(this.state.user);

        return (
          <div className="sections">
              <NavBar user={this.state.user}/>

              <div className="section content-wrapper">
                <div className="cards-wrapper">
                  <div className="title-card card-shadow">
                    <h1 className="app-title">Lost and Found</h1>
                    <p>Bringing your old fashion lost and found bin to the world</p>
                  </div>
                  <div className="flex-row">
                    <div className="info-card card-shadow">
                        <h3 className="found-title">Found Something</h3>
                        <img src={foundImg}/>
                        <p>Describe the item that you found and where you found it and we will find the owner</p>
                    </div>
                    <div className="info-card card-shadow">
                        <h3 className="lost-title">Lost Something</h3>
                        <img src={treasureMapImg}/>
                        <p>Tell us what you lost and we will tell you when soemone finds it</p>
                    </div>
                  </div>
                  <Login/>
              </div>



              </div>

            </div>
        )
    }
}



export default Home;
