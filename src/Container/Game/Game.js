import { connect } from "react-redux";
import App from "../../App";
import {
  leaderboardLoaded,
  loggedIn,
  moveObjects,
  startGame,
  shoot
} from "../../actions/index";

const mapStateToStore = state => ({
  angle: state.angle,
  gameState: state.gameState,
  currentPlayer: state.currentPlayer,
  players: state.players
});

const mapDispatchToProps = dispatch => ({
  leaderboardLoaded: players => {
    dispatch(leaderboardLoaded(players));
  },
  loggedIn: player => {
    dispatch(loggedIn(player));
  },
  shoot: mousePosition => {
    dispatch(shoot(mousePosition));
  },
  moveObjects: mousePosition => {
    dispatch(moveObjects(mousePosition));
  },
  startGame: () => {
    dispatch(startGame());
  }
});

const Game = connect(
  mapStateToStore,
  mapDispatchToProps
)(App);

export default Game;
