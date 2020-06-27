import React, { Component } from "react";
import propTypes from "prop-types";
import { getCanvasPosition } from "./utils/formulas";
import Canvas from "./components/Canvas";
import * as Auth0 from "auth0-web";
import io from "socket.io-client";

Auth0.configure({
  domain: "dev-e85sh2jy.auth0.com",
  clientID: "v02sa1lxizbGGozt0CyYt6LfTCKzt78b",
  redirctUri: "http://localhost:3000/",
  responseType: "token id_token",
  scope: "openid profile manage:points",
  audience: "https://aliens-go-home.digituz.com.br"
});

class App extends Component {
  constructor(props) {
    super(props);
    this.shoot = this.shoot.bind(this);
  }

  componentDidMount() {
    const self = this;
    Auth0.handleAuthCallback();
    Auth0.subscribe(auth => {
      if (!auth) return;

      const playerProfile = Auth0.getProfile();
      const currentPlayer = {
        id: playerProfile.sub,
        maxScore: 0,
        name: playerProfile.name,
        picture: playerProfile.picture
      };
      this.props.loggedIn(currentPlayer);

      const socket = io("http://localhost:3001", {
        query: `token=${Auth0.getAccessToken()}`
      });

      let emitted = false;
      socket.on("players", players => {
        this.props.leaderboardLoaded(players);

        if (emitted) return;
        socket.emit("new-max-score", {
          id: playerProfile.sub,
          maxScore: 120,
          name: playerProfile.name,
          picture: playerProfile.picture
        });
        emitted = true;
        setTimeout(() => {
          socket.emit("new-max-score", {
            id: playerProfile.sub,
            maxScore: 222,
            name: playerProfile.name,
            picture: playerProfile.picture
          });
        }, 5000);
      });
    });

    window.onresize = () => {
      const cnv = document.getElementById("aliens-go-home-canvas");
      cnv.style.width = `${window.innerWidth}px`;
      cnv.style.height = `${window.innerHeight}px`;
    };
    window.onresize();
    setInterval(() => {
      self.props.moveObjects(self.canvasMousePosition);
    }, 10);
  }

  trackMouse(event) {
    this.canvasMousePosition = getCanvasPosition(event);
  }
  shoot() {
    this.props.shoot(this.canvasMousePosition);
  }
  render() {
    return (
      <Canvas
        angle={this.props.angle}
        currentPlayer={this.props.currentPlayer}
        gameState={this.props.gameState}
        players={this.props.players}
        shoot={this.shoot}
        startGame={this.props.startGame}
        trackMouse={event => this.trackMouse(event)}
      />
    );
  }
}

App.propTypes = {
  angle: propTypes.number.isRequired,
  gameState: propTypes.shape({
    started: propTypes.bool.isRequired,
    kills: propTypes.number.isRequired,
    lives: propTypes.number.isRequired,
    flyingObject: propTypes.arrayOf(
      propTypes.shape({
        position: propTypes.shape({
          x: propTypes.number.isRequired,
          y: propTypes.number.isRequired
        }).isRequired,
        id: propTypes.number.isRequired
      })
    ).isRequired
  }).isRequired,
  moveObjects: propTypes.func.isRequired,
  currentPlayer: propTypes.shape({
    id: propTypes.string.isRequired,
    maxScore: propTypes.number.isRequired,
    name: propTypes.string.isRequired,
    picture: propTypes.string.isRequired
  }),
  leaderboardLoaded: propTypes.func.isRequired,
  loggedIn: propTypes.func.isRequired,
  players: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.string.isRequired,
      maxScore: propTypes.number.isRequired,
      name: propTypes.string.isRequired,
      picture: propTypes.string.isRequired
    })
  ),
  shoot: propTypes.func.isRequired
};

App.defaultProps = {
  currentPlayer: null,
  players: null
};

export default App;
