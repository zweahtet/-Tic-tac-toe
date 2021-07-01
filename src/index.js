import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// React.Component (sub-class of React)
// a component takes in parameters, called props (short for 
// "properties"), and returns a hierarchy of views to display
// via the render method. 
// a component use state to "remember" things

// Square is a React component class/ type
// renders a single <button> 
// class Square extends React.Component {

//     // react components can have state by setting this.state
//     // in their constructors.
//     // In JavaScript classes, you need to always call super
//     // when defining the constructor of a subclass.
//     // all React component classes that have a constructor should
//     // start with a super(props) call.

//     // implement the render method of React complement class
//     // return a description of what you want to see on the 
//     // screen (a React element)
//     render() {
//         return (
//             // when a square is clicked, the onClick function
//             // provided by the Board is called.
//             <button 
//                 className="square" 
//                 onClick={() => this.props.onClick()}
//             >
//                 {this.props.value} 
//             </button>
//         );
//     }
// }

// In React, function components are a simpler way to write 
// components that only contain a render method and don’t have 
// their own state. 
function Square (props) {
    return (
        // when a square is clicked, the onClick function
        // provided by the Board is called.
        <button 
            className="square" 
            onClick={props.onClick}
        >
            {props.value} 
        </button>
    );
}

// there is a special syntax "JSX" equivalent to the Square class
// <div/> syntax is transformed at build time to 
// React.createElement('div')

// Board is a React component class/ type
// renders 9 squares
class Board extends React.Component {
    // To collect data from multiple children, 
    // or to have two child components communicate with each other, 
    // you need to declare the shared state in their parent component 
    // instead. The parent component can pass the state back down to 
    // the children by using props; this keeps the child components 
    // in sync with each other and with the parent component.

    // add a contructor to the Board and set the Board's intial
    // state to contain an array of 9 nulls corresponding to the 
    // 9 squares

    // the Board component receive squares and onClick props 
    // from the Game component

    // pass down two props from Board to Square: value and onClick
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>  
        );
    }
}

// Game is a React component class/type
// renders a board with placeholder values 
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0, // indicate which step we're currently viewing
            xIsNext: true,
        };
    }

    
    handleClick(i) {
        // .slice(0, this.state.stepNumber + 1) ensures that
        // if we 'go back in time' and then make a new move
        // from that point, we throw away all the 'future'
        // history 
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares_copy = current.squares.slice();
        if (calculateWinner(squares_copy) || squares_copy[i]) {
            return;
        }

        // Xs and Ostake turns
        squares_copy[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares_copy,
            }]), // concatenate new history entries onto history
            // concat() method doesn't mutate the original array
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    // use the most recent history entry to determine
    // and display the game's status
    render() {
        const history = this.state.history;

        // render the currently selected move according to 
        // stepNumber
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        // map history of moves to React elements representing
        // buttons on the screen and display a list of buttons
        // to "jump" to past moves
        const moves = history.map((step, move) => {
            const desc = move ? 
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
        <div className="game">
            <div className="game-board">
                <Board
                    squares={current.squares}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }