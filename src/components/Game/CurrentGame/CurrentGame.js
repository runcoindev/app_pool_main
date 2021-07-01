import React, { useState, useEffect } from "react";
import ListOfPlays from "../ListOfPlays/ListOfPlays";
import {
  CurrentGameContainer,
  GameRow,
  JackPot,
  SeasonTitle,
  JackPotAmount,
  JackPotText,
} from "./CurrentGame.elements";
import ButtonPlay from "../ButtonPlay/ButtonPlay";
import Alert from "../Alert/Alert";
import { getPriceInEth, getReward, getSeasonCurrent, miContrato } from "../../../services/server";
import { BarContextProvider } from "../../../context/BarContext";
import { useFullBar } from "../../../hooks/useFullBar";
import ButtonClaim from "../ButtonClaim/ButtonClaim";
import { Bc } from 'react-cryptocoins';
import { reduceDecimal } from "../../../utils/reduceDecimal";

function CurrentGame({reload, setReload}) {
  const [cost, setCost] = useState(0);
  const [season, setSeason] = useState(0);
  const [stopReload, setStopReload] = useState(false);
  const { isFull } = useFullBar();

  useEffect(() => {
    if(reload){
      loadCost()
      loadSeason()
      const timerStopGame = setTimeout(() => {
        setStopReload(!stopReload)
      }, 60000 )
      return () => {
        clearTimeout(timerStopGame)
      }
    }
  }, [reload,stopReload])

  useEffect(() => {
    miContrato.events.Game(
      {
        // filter: {myIndexedParam: [20,23], myOtherIndexedParam: '0x123456789...'},
        fromBlock: "latest",
      },
      (error, event) => {
        loadCost();
        loadSeason()
      }
    );
  }, []);

  const loadCost = () => {
    getReward().then((res) => {
      if (res !== false) {
        getPriceInEth(res.recompensa).then((val) => setCost(val));
      }
    });
  };
  const loadSeason = () => {
    getSeasonCurrent().then((res) => {
      setSeason(res)
    });
  };

  return (
    <>
      <CurrentGameContainer>
        <SeasonTitle>Season {season}</SeasonTitle>
        <GameRow>
          <JackPot>
            
            <JackPotAmount>≈ {reduceDecimal(cost, 2)} MATIC</JackPotAmount>
            <JackPotText>current jackpot</JackPotText>
          </JackPot>
          {!isFull ? <ButtonPlay /> : <ButtonClaim />}
        </GameRow>
        <ListOfPlays />
        {/* <BarRow>
          <PlayerId>you: 0x34...f9F7</PlayerId>
          <GameBar>
            <Bar className="current-game-animation"></Bar>
          </GameBar>
          <TimeBar>End In: 1 day 45 min</TimeBar>
        </BarRow>
        <BarRow>
          <PlayerId>Id: 0x6A...AdE8</PlayerId>
          <GameBar>
            <Bar className="game-ended"></Bar>
          </GameBar>
          <TimeBar>Ended</TimeBar>
        </BarRow>
        <BarRow>
          <PlayerId>Id: 0x6A...AdE8</PlayerId>
          <GameBar>
            <Bar className="game-ended"></Bar>
          </GameBar>
          <TimeBar>Ended</TimeBar>
        </BarRow>
        <BarRow>
          <PlayerId>you: 0x34...f9F7</PlayerId>
          <GameBar>
            <Bar className="game-ended-player"></Bar>
          </GameBar>
          <TimeBar>Ended</TimeBar>
        </BarRow>
        <BarRow>
          <PlayerId>Id: 0x6A...AdE8</PlayerId>
          <GameBar>
            <Bar className="game-ended"></Bar>
          </GameBar>
          <TimeBar>Ended</TimeBar>
        </BarRow>
        <BarRow>
          <PlayerId>Id: 0x6A...AdE8</PlayerId>
          <GameBar>
            <Bar className="game-ended"></Bar>
          </GameBar>
          <TimeBar>Ended</TimeBar>
        </BarRow> */}
      </CurrentGameContainer>
    </>
  );
}

export default CurrentGame;
