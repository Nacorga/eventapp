import React, { Component } from 'react'
import { HashRouter as Router, Route, NavLink , Switch } from 'react-router-dom'
import AllEvents from '../pages/AllEvents';
import MyEvents from '../pages/MyEvents';
import  { navbar } from '../data/navbar.json';
import logo from '../logo.svg';
import '../styles/Navbar.scss';

class Navbar extends Component {

  render() {

    const components = [AllEvents, MyEvents]

    const navLinks = navbar.map((item, i) => {
      return (
        <NavLink key={"navlink-" + i} className="nav-item" activeClassName="active" to={item.route}>{item.name}</NavLink >
      )
    });

    const navRoutes = navbar.map((item, i) => {
      return (
        <Route key={"route-" + i} exact path={item.route} component={components[i]} />
      )
    });

    return (
      <Router>
        <div className="header">
          <img className="logo" src={logo} alt="Logo" />
          <div className="container">
            <nav className="nav">
              { navLinks }
            </nav>
          </div>
        </div>
        <Switch>
          <div className="main-wrapper mt-5 mb-5">
            { navRoutes }
          </div>
        </Switch>
      </Router>
  
    );

  }

}

export default Navbar;
