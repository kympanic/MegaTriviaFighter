import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useState } from "react";
import Bar from "./Bar/bar";
import Menu from "./Menu";
import Announcer from "./Announcer";
import ReactHowler from "react-howler";
import { useBattleSequence } from "../../Hooks/useBattleSequence";
import { useEffect } from "react";
import { wait } from "../../Helpers";
import "./battlepage.css";
import styles from "./styles.module.css";
const BattlePage = () => {
	const history = useHistory();
	const location = useLocation();
	const triviaData = location.state.triviaData;
	const player1Data = location.state.player1Data;
	const player2Data = location.state.player2Data;
	const [sequence, setSequence] = useState({});
	const [questionIndex, setQuestionIndex] = useState(0);
	const [winner, setWinner] = useState();
	const [playing, setPlaying] = useState(true);

	const song =
		"https://trivia-fighter.s3.us-west-2.amazonaws.com/Images/Cute_Background_Music_No_Copyright_(getmp3.pro).mp3";

	const {
		turn,
		inSequence,
		player1Health,
		player2Health,
		announcerMessage,
		player1Animation,
		player2Animation,
	} = useBattleSequence(sequence);

	const selectedTriviaData = Object.values(triviaData?.results);
	const arrayOfQuestions = selectedTriviaData.map((trivia) => {
		return {
			question: trivia?.question,
			correct_answer: trivia?.correct_answer,
			incorrect_answers: trivia.incorrect_answers,
		};
	});
	arrayOfQuestions.sort(() => Math.random() - 0.5);

	useEffect(() => {
		if (player1Health === 0 || player2Health === 0) {
			(async () => {
				await wait(2000);
				setPlaying(false);
				setWinner(player1Health === 0 ? player2Data : player1Data);
				history.push({
					pathname: "/gameover",
					state: { triviaData, winner, player1Data, player2Data },
				});
			})();
		}
		// eslint-disable-next-line
	}, [player1Health, player2Health, winner]);

	// console.log(triviaData, "this is the trivia data");
	// console.log(arrayOfQuestions, "these are all the questions");
	// console.log(selectedTriviaData, "this is the trivia data");
	// console.log(player1Data, "this is the player 1 data");
	// console.log(player2Data, "this is the player 2 data");
	// console.log(player1Health, "this is the player 1 health");
	// console.log(player2Health, "this is the player 2 health");
	return (
		<div className="battlepage-main-container">
			<ReactHowler playing={playing} src={[song]} />
			<div className="player-container">
				<div className="player1-summary">
					<h2 className="playertitle-text">Player 1</h2>
					<div className={styles.player1Sprite}>
						<img
							className={styles[player1Animation]}
							src={player1Data.img}
							alt={player1Data.name}
						/>
					</div>
					<h3 className="player-name-text">{player1Data.name}</h3>
					<div className="bar-container">
						<Bar
							label="HP"
							maxValue={player1Data.maxHealth}
							value={player1Health}
						/>
					</div>
				</div>

				<div className={styles.gameHeader}>Fight!</div>

				<div className="player2-summary">
					<h2 className="playertitle-text">Player 2</h2>
					<div className={styles.player2Sprite}>
						<img
							className={styles[player2Animation]}
							src={player2Data.img}
							alt={player2Data.name}
						/>
					</div>
					<h3 className="player-name-text">{player2Data.name}</h3>
					<div className="bar-container">
						<Bar
							label="HP"
							maxValue={player2Data.maxHealth}
							value={player2Health}
						/>
					</div>
				</div>
			</div>
			<div className={styles.hud}>
				{player1Health === 0 || player2Health === 0 ? (
					<div className={styles.hudChild}>
						<Announcer
							message={
								player1Health === 0
									? `${player1Data.name} got knocked out!`
									: `${player2Data.name} got knocked out!`
							}
						/>
					</div>
				) : (
					<div className={styles.hudChild}>
						<Announcer
							message={
								announcerMessage ||
								`Woohoo! It's time for a Trivia Battle! Player One what is the answer to this question?`
							}
						/>
					</div>
				)}
				{!inSequence && (
					<div className={styles.hudChild}>
						<Menu
							arrayOfQuestions={arrayOfQuestions}
							setSequence={setSequence}
							turn={turn}
							setQuestionIndex={setQuestionIndex}
							questionIndex={questionIndex}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default BattlePage;
