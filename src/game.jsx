import { useState } from 'react';
import style from './game.module.css';


//
// The calculateWinner function that is calculate winner.
// List up the pattern of the way of win.
// And then check to same symbols line up as any pattern.
//

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

	for (let i =  0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] &&
				squares[a] === squares[c]) {

			return lines[i];
		}
	}
	return null;
}

//
// Define handleClick() function that return X or O 
// when a square is clicked.
// And call handlePlay() function.
//

function handleClick(
	i, 
	squares, 
	xIsNext, 
	onPlay, 
	onLocation
) {

	const nextSquares = squares.slice();

	if (calculateWinner(squares) || squares[i]) { return; }
	if(xIsNext) { nextSquares[i] = 'X' }
	else { nextSquares[i] = 'O' }

	onPlay(nextSquares);
	onLocation(i);
}


//
// The Square, SquareRows and RenderSquare functions 
// are components which show a cell of the Board.
//

function Square({ 
	i, 
	value, 
	onSquareClick, 
	squares
}) {

	const winNb = calculateWinner(squares);
	if (!winNb) {
		return (
			<button 
				id={"sq" + i} 
				className={ style.square } 
				onClick={onSquareClick} 
				style={{backgroundColor: 'white'}}
			>
				{value}
			</button>
		);
	} else if (i == winNb[0] || i == winNb[1] || i == winNb[2]) {
		return (
			<button 
				id={"sq" + i} 
				className={ style.square } 
				onClick={onSquareClick} 
				style={{backgroundColor: 'yellow'}}
			>
				{value}
			</button>
		);
	} else {
		return (
			<button 
				id={"sq" + i} 
				className={ style.square } 
				onClick={onSquareClick} 
				style={{backgroundColor: 'white'}}
			>
				{value}
			</button>
		);
	}
}

//
//SquareRows() function
//

function SquareRows({
	row, 
	squares, 
	xIsNext, 
	onPlay, 
	onLocation
}) {

	const squareItem = row.map((i) => {
		return (
			<Square 
				key={i} 
				i={i}
				value={squares[i]} 
				onSquareClick={() => {
					handleClick(i, squares, xIsNext, onPlay, onLocation); 
				}} 
				squares={squares}
			/>
		)
	});

	return (
		<div className={ style.borderRow }>
			{squareItem}
		</div>
	);
}


//
// RenderSquare() function
//

function RenderSquare({
	squares, 
	xIsNext, 
	onPlay, 
	onLocation
}) {

	const index = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
	const squareRows = index.map((row, i) => {
		return (
			<SquareRows 
				key={i} 
				row={row} 
				squares={squares} 
				xIsNext={xIsNext} 
				onPlay={onPlay}
				onLocation={onLocation}
			/>
		);
	});

	return (
		<>
			{squareRows}
		</>
	);
}


//
// The Board function.
// which include Squares function and status of the player. 
//

function Board({ 
	xIsNext, 
	currentM, 
	squares, 
	onPlay,
	onLocation
}) {

	const winner = calculateWinner(squares);
	let status;
	if (winner) { status = 'Winner: ' + squares[winner[0]]; }
	else if (currentM == 9) { status = 'DRAW'; }
	else { status = 'Next player: ' + (xIsNext ? 'X' : 'O'); }

	return (
		<>
			<div className={ style.status }>{status}</div>
			<RenderSquare 
				squares={squares} 
				xIsNext={xIsNext} 
				onPlay={onPlay} 
				onLocation={onLocation} 
			/>
		</>
	);
}


//
// The function that show game history.
// When isReverse is true, the order of the history is reversed.
//

function History({ 
	history, 
	isReverse, 
	jump, 
	mLocation 
}) {

	const his = history;
	const renMoves = [];
	const loc = mLocation.slice();
	let description = '';
	
	if (!isReverse) {
		for (let i = 0; i < his.length; i++ ) {
			if (i > 0) { description = 'Move#' + i; }
			else { description = 'Start'; }

			const xy = loc[i];

			renMoves.push(
				<li key={i}>
					<a 
						className={style.historyBtn} 
						onClick={() => jump(i)}
					>
						{description}
					</a>
					<span> {xy[0]} {xy[1]}</span>
				</li>
			);
		}
	} else {
		for (let i = his.length-1; i > -1; i-- ) {
			if (i > 0) { description = 'Move#' + i; }
			else { description = 'Start'; }

			const xy = loc[i];
			
			renMoves.push(
				<li key={i}>
					<a 
						className={style.historyBtn} 
						onClick={() => jump(i)}
					>
						{description}
					</a>
					<span> {xy[0]} {xy[1]}</span>
				</li>
			);
		}
	}

	return renMoves;
}


//
// The function that control the entire of the Game
//

export default function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [isReverse, setIsReverse] = useState(false);
	const [currentMove, setCurrentMove] = useState(0);
	const [moveLocation, setMoveLocation] = useState(['']);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];

	function handlePlay(nextSquares){
		const nextHistory = [
			...history.slice(0, currentMove + 1), 
			nextSquares
		];
		setHistory(nextHistory); 
		setCurrentMove(nextHistory.length -1);
	}

	function setLocation(i) {
		let l = [];

		if (((i + 1) % 3) === 1) { l.push(1); }
		else if (((i + 1 ) % 3) === 2) { l.push(2); }
		else if (((i + 1 ) % 3) === 0) { l.push(3); }

		if (i < 3) { l.push(1); }
		else if (2 < i && i < 6) { l.push(2); }
		else if (5 < i && i < 9) { l.push(3); }

		const nextLocation = [
			...moveLocation.slice(0, currentMove + 1),
			l
		];

		setMoveLocation(nextLocation);
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	return (
		<div className={style.game}>
			<div className={style.board}>
				<p className={style.fs08}>You are at move #{currentMove + 1}</p>
				<Board 
					xIsNext={xIsNext} 
					currentM={currentMove}
					squares={currentSquares} 
					onPlay={handlePlay} 
					onLocation={setLocation}
				/>
			</div>
			<div className={style.history}>
				<a 
					className={style.historyBtn} 
					onClick={() => location.reload()}
				>
					Reload<br />
				</a>
				<a 
					className={style.historyBtn} 
					onClick={() => setIsReverse(!isReverse)}
				>
					Reverse
				</a>
				<ol className={style.historyList}>
					<History 
					className={style.reverseButton} 
						history={history} 
						isReverse={isReverse} 
						jump={jumpTo} 
						mLocation={moveLocation}
					/>
				</ol>
			</div>
		</div>
	);
}
