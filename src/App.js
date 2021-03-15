import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import useSound from 'use-sound';
import sound from './sound.mp3'
import success from './success.mp3'
import hat from './hat.png';
import ticket from './ticket.png';
import './App.css';

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['players']);
    const [players, setPlayers] = useState([]);
    const [error, setError] = useState('');
    const [name, setName] = useState('');
    const [picked, setPicked] = useState([]);
    const [result, setResult] = useState('');
    const [mute, setMute] = useState(false);
    const [play] = useSound(sound);
    const [playSuccess] = useSound(success);
    const [config, setConfig] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (cookies.players) {
            setPlayers(cookies.players);
        }
    }, []);
    useEffect(() => {
        setCookie('players', players, { maxAge: 2592000 });
    }, [players]);

    const addPlayer = (event) => {
        event && event.preventDefault();
        setPlayers([...players, name]);
        setName('');
    };

    const removePlayer = (value) => {
        setPlayers(players.filter(player => player != value));
    };

    const removeAllPlayers = () => {
        setPlayers([]);
    };

    const pickOne = () => {
        setDone(false);
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
                if (!mute) {
                    playSuccess();
                };
            };
        };
    };

    return (
        <div >
            <div className='options'>
                {!config ? <i onClick={() => setConfig(true)} className="fas fa-cogs"></i> : <i onClick={() => setConfig(false)} className="fas fa-times"></i>}
            </div>
            {config ? <div>
                <form onSubmit={addPlayer}>
                    <label htmlFor='name'>Name:</label>
                    <input onChange={e => setName(e.target.value)} value={name} name='name' type='text' />
                    <input type='submit' value='Add' />
                </form>
                <button onClick={removeAllPlayers}>Clear All</button>
                <ul>
                    {players && players.map((player) => {
                        return <li key={players.indexOf(player)} >{player} <span onClick={() => removePlayer(player)}> X</span></li>
                    })}
                </ul>
            </div> : <div>
                <div className='hat_ticket_container'>
                    <div className={done ? 'ticket done' : 'ticket'} style={{ backgroundImage: `url(${ticket})` }}>
                        <div className='result_container'>
                            {result && <p>{result}</p>}
                        </div>
                    </div>
                    <div className='hat_container'>
                        <button onClick={pickOne}>
                            <img className='hat' src={hat} />
                        </button>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default App;