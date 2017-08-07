import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const API_URL = 'https://api.github.com/users/';

const infoCache = {};

export const UserRow = ({user, onclick}) => {
  return (<tr><td>{user.name}</td><td>{user.public_repos}</td><td><button onClick={onclick}>Delete</button></td></tr>);
}

export const UserInfoDisplay = ({children}) => {
  return(
    <table>
      <thead>
        <tr>
          <th>User Name</th>
          <th>Number of Repos</th>
        </tr>
      </thead>
      <tbody>
        { children }
      </tbody>
    </table>
  );
}

class App extends Component {

  // constructor(){
  //   super();
  //   // this.getUserNames = this.getUserNames.bind(this);
  // }

    state = {
      usernames: [],
      users: []
    };
  

  getUserNames() {
    const input = document.getElementById('usernames');
    if(input && input.value && input.value.length > 0){
      let namesArray = input.value.replace(/\s/g,'').split(",");
      namesArray = namesArray.filter(name => {
        if(infoCache[name]){
          return false
        }
        infoCache[name] = false;
        return true;
      });
      // this.setState(() => {
      //   return { usernames: namesArray };
      // }, () => {
      //   this.getProfileInfo();
      // })
    } 
  }

  dummyFn = () => {}

  getFromCache = (username) => {
    return new Promise(resolve => {
      resolve({
        json: () => {
          return new Promise(resolve => resolve(infoCache[username]));
        }
      })
    })
  }

  deleteUser = (username) => {
    infoCache[username] = false;
    this.setState(() => { return { users: this.state.users.filter(user => user.username !== username) } }, () => console.log('after', infoCache, this.state.users));
  }

  getProfileInfo = () => {
    let promiseArray = [];
    this.state.usernames.forEach(username => {
      promiseArray.push(
        infoCache[username] ?
        this.getFromCache(username) :
        fetch(`${API_URL}${username}`)
        
      );
    });
    Promise.all(promiseArray).then(
      resultsArray => {
        promiseArray.length = 0;
        resultsArray.forEach(result => promiseArray.push(result.json()));
        Promise.all(promiseArray).then(userInfoArray => {
          userInfoArray.forEach(({id, login, name, public_repos}, index) => {
            console.log(login, name, public_repos, infoCache[login], 'test');
            if(infoCache[login] !== undefined){
              infoCache[login] = { id, name, username: login, public_repos};
            }
            //setState calls are batched so no need to further optimize this
            this.setState({ users: [...this.state.users, {id, name, username: login, public_repos}]});
          });
        });
      }
    );
  }

  render() {
    
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>GitHub Users Search</h2>
        </div>
        <div className="App-intro">
          <input type="text" name="usernames" id="usernames"/>
          <button onClick={() => this.getUserNames()}>Search</button>
          <UserInfoDisplay>
            { this.state.users.map( user => <UserRow key={user.id} user={user} onClick={() => this.deleteUser(user.username)}/>) }
          </UserInfoDisplay>
        </div>
      </div>
    );
  }
}

export default App;

console.log(App.prototype);
