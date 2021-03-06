import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import './user-home.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { Button} from 'semantic-ui-react'
import Login from '../login/login.jsx'
import ScrollView, { ScrollElement } from "./scroll.jsx";
import { Redirect } from 'react-router'
import NavBar from '../nav-bar/nav-bar.jsx'
import { browserHistory } from 'react-router'

import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import firebase from 'firebase';

class UserHome extends Component {

	constructor() {
        super();

        this.state = {
          user: null,
          lostItems: [],
          foundItems: []
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

			let db = firebase.firestore();
		    let index = 0;
		    db.collection("items")
		    .where("email", "==", user.email)
				.where("lostOrFound", "==", "lost")
				.where("found", "==", 0)
		    .get()
		    .then((item) => {
		    	let lostItems = [];
		        item.forEach((i) => {
		            let copy = i.data();
								console.log("Lost", copy);

		            lostItems.push(copy);
		        })
		        if( this.state.lostItems.length != lostItems.length) {
		        	this.setState({lostItems: lostItems});
				}
		    })

		    db.collection("items")
		    .where("email", "==", user.email)
				.where("lostOrFound", "==", "found")
				.where("found", "==", 0)
		    .get()
		    .then((item) => {
		    	let foundItems = [];
		        item.forEach((i) => {
		            let copy = i.data();
		            foundItems.push(copy);
								console.log("Found", copy);
		        })
		        if( this.state.foundItems.length != foundItems.length) {
		        	this.setState({foundItems: foundItems});
				}
		    })
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
             		<div className="items lost">
             			<h2>Lost Items</h2>
	                	<ScrollView ref={scroller => this._scroller = scroller}>
				          <div className="scroller">
				           	{ this.state.lostItems.length ?
					            this.state.lostItems.map(({ brand, description, matchedUser }) => {
												if(matchedUser){
													return (
													 <ScrollElement>
															 <div className="found-item">
																 <p>{brand} - {description}</p>
																 <p className="bold">{matchedUser.name} ({matchedUser.email}) has this item</p>
															 </div>
													 </ScrollElement>
												 );
												}else{
													return (
													 <ScrollElement>
														 <div className="item">
															 {brand} - {description}
														 </div>
													 </ScrollElement>
												 );
												}

				            	})
					            :
					            <span>0 items found!</span>
				            }
				          </div>
				        </ScrollView>

				        <Link to="/form" className="submissionBtn">
						    Add a lost item!
						</Link>
				    </div>

				    <div className="items found">
				        <h2>Found Items</h2>

				        <ScrollView ref={scroller => this._scroller = scroller}>
				          <div className="scroller">
				            { this.state.foundItems.length ?
				            	this.state.foundItems.map(({ brand, description, matchedUser }) => {
												if(matchedUser){
													return (
													 <ScrollElement>
															 <div className="found-item">
																 <p>{brand} - {description}</p>
																 <p className="bold">{matchedUser.name} ({matchedUser.email}) lost this item</p>
															 </div>
													 </ScrollElement>
												 );
												}else{
													return (
													 <ScrollElement>
														 <div className="item">
															 {brand} - {description}
														 </div>
													 </ScrollElement>
												 );
												}
					            })
				            	:
				            	<span>0 Items found!</span>
				            }
				          </div>
				        </ScrollView>

				        <Link to="/form" className="submissionBtn">
						    Add a found item!
						</Link>
			        </div>
                </div>
            </div>
        )
    }
}


export default UserHome;
