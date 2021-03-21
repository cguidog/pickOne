import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import useSound from 'use-sound';
import sound from './sound.mp3'
import success from './success.mp3'
import hat from './hat.png';
import ticket from './ticket.png';
import clover from './clover.png';
import mask from './mask.png';
import './App.css';

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['players', 'time']);
    const [players, setPlayers] = useState([]);
    const [name, setName] = useState('');
    const [picked, setPicked] = useState([]);
    const [result, setResult] = useState('');
    const [mute, setMute] = useState(false);
    const [play] = useSound(sound);
    const [playSuccess] = useSound(success);
    const [config, setConfig] = useState(false);
    const [done, setDone] = useState(false);
    const [animate, setAnimate] = useState(false);
    const [timer, setTimer] = useState(false);
    const [time, setTime] = useState(60);
    const [intervalID, setIntervalID] = useState('');
    var interval;
    var second = time;
    useEffect(() => {
        if (cookies.players) {
            setPlayers(cookies.players);
        }
        if (cookies.time) {
            setTime(parseInt(cookies.time));
        }
    }, []);
    useEffect(() => {
        setCookie('players', players, { maxAge: 2592000 });
    }, [players]);

    const addPlayer = (event) => {
        event && event.preventDefault();
        if (name !== '') {
            setPlayers([...players, name]);
            setName('');
        }
    };

    const removePlayer = (value) => {
        setPlayers(players.filter(player => player != value));
    };

    const removeAllPlayers = () => {
        setPlayers([]);
    };
    const runTimer = () => {
        if (interval) {
            stopTimer();
        } else {
            interval = setInterval(running, 1000);
            setIntervalID(interval);
        }
            
        function running() {
            if (second > 0) {
                second--;
                setTime(second);
                console.log(interval);
            } else {
                stopTimer();
            }
        }
    }
    const stopTimer = () => {
        if (intervalID !== '') {
            setTimer(false);
            setTime(parseInt(cookies.time));
            clearInterval(intervalID);
        }
    }

    const pickOne = () => {
        setTime(parseInt(cookies.time));
        second = parseInt(cookies.time);
        stopTimer();
        setDone(false);
        setAnimate(true);
        interval = '';
        const active = players.filter(player => picked.indexOf(player) == -1);
        const random = active.length > 1 ? 10 : 1;
        var i = 0;
        var id = setInterval(run, 100);
        var winner = '';
        function run() {
            var current = i < random ? active[Math.floor(Math.random() * active.length)] : winner;
            if (i < random) {
                setResult(current);
                winner = current;
                if (!mute) {
                    play();
                };
                i++;
            } else {
                setPicked([...picked, current])
                clearInterval(id);
                setDone(true);
                setAnimate(false);
                setTimer(true);
                runTimer();
                if (!mute) {
                    playSuccess();
                };
            };
        };
    };

    return (
        <div >
            <div className='options'>
                <div className='title'><h1>QACD’s Nuggets of Gold</h1></div>
                {!config ? <i onClick={() => {setConfig(true);stopTimer()}} className="fas fa-cogs"></i> : <i onClick={() => setConfig(false)} className="fas fa-times"></i>}
            </div>
            {timer && <span style={{color: time <= 15 ? 'red' : ''}} className={time <= 15 ? 'timer time_out' : 'timer'} ><i className="fas fa-stopwatch"></i> {time}</span>}
            {config ? <div className='settings_container'>
                <div className='form_container'>
                    <form >
                        <label htmlFor='timer'>Timer </label>
                        <input onChange={(e) => { setTime(e.target.value); setCookie('time', e.target.value, { maxAge: 2592000 }) }} type='number' name='timer' value={time} /><span> Seconds</span>
                    </form>
                    <form onSubmit={addPlayer}>
                        <label htmlFor='name'>Name </label>
                        <input onChange={e => setName(e.target.value)} value={name} name='name' type='text' />
                        <input type='submit' value='Add' />
                    </form>
                </div>
                <div className='list_container'>
                    {players && players.map((player) => {
                        return <div className='player' key={players.indexOf(player)} ><div >{player}</div><div onClick={() => removePlayer(player)}><i className="fas fa-times"></i></div></div>
                    })}
                </div>
                <div style={{ textAlign: 'center' }}>{players.length > 1 && <button className='clear' onClick={removeAllPlayers}>Clear All</button>}</div>
            </div> : <div>
                <div className='hat_ticket_container'>
                    <div className={done ? 'ticket done' : 'ticket'} style={{ backgroundImage: `url(${ticket})` }}>
                        <div className='result_container'>
                            {result ? <p style={{ textAlign: 'center' }}>{result}</p> : <p style={{ textAlign: 'center' }}>No more players</p>}
                        </div>
                    </div>
                    <div className='hat_container'>
                        <button onClick={pickOne}>
                            <img className='hat' src={hat} />
                        </button>
                    </div>
                </div>
                <div className='clover_container'>
                    {
                        players && players.map((player) => {
                            return <img className={animate ? players.indexOf(player) % 2 == 0 ? 'clover animate' : ' clover animate2' : 'clover'} key={players.indexOf(player)} src={players.indexOf(player) % 2 == 0 ? clover : mask} />
                        })
                    }
                    {
                        players && players.map((player) => {
                            return <img className={animate ? players.indexOf(player) % 2 == 0 ? 'clover animate' : ' clover animate2' : 'clover'} key={players.indexOf(player)} src={players.indexOf(player) % 2 == 0 ? clover : mask} />
                        })
                    }
                    {
                        players && players.map((player) => {
                            return <img className={animate ? players.indexOf(player) % 2 == 0 ? 'clover animate' : ' clover animate2' : 'clover'} key={players.indexOf(player)} src={players.indexOf(player) % 2 == 0 ? clover : mask} />
                        })
                    }
                </div>
            </div>}
        </div>
    );
};

export default App;