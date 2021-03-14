import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import useSound from 'use-sound';
import sound from './sound.mp3'
import success from './success.mp3'

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
        const active = players.filter(player => picked.indexOf(player) == -1);
        const random = active.length > 1 ? players.length * 4 : 1;
        var i = 0;
        var id = setInterval(run, 100);
        function run() {
            var current = active[Math.floor(Math.random() * active.length)];
            if (i < random) {
                setResult(current)
                if (!mute) {
                    play();
                };
                
                i++;
            } else {
                setPicked([...picked, current])
                clearInterval(id);
                if (!mute) {
                    playSuccess();
                };
            };
        };
    };

    return (
        <div >
            <div>
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
            </div>
            <button onClick={pickOne}>Pick</button>
            {result && <p>result: {result}</p>}
            {picked && <p>picked: {picked}</p>}
        </div>
    );
};

export default App;