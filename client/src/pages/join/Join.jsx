import './join.css'
import { useState } from 'react';
import { TextField } from '@material-ui/core'
import { Link } from "react-router-dom";
import { useHistory } from "react-router";
import Header from '../../components/header/Header'

export default function Join() {
    const [code, setCode] = useState("");
    const history = useHistory();

    return (
        <>
        <Header/>
        <div className="join">
            <div className="joinWrapper">
                <div className="joinTop">
                    <span className="joinLogo">
                        Join a Room
                    </span>
                </div>

                <div className="joinBottom">
                    <div className="joinOptionsBox">
                        <TextField
                          label='Code'
                          placeholder='Enter a Room Code'
                          variant='outlined'
                          onChange={(e) => setCode(e.target.value)}
                          value={code}
                        />

                        <button className="joinJoinButton" onClick={() => history.push(`/room/${code}`)}>
                            Join Room
                        </button>

                        <Link to='/'>
                            <button className="joinBackButton">
                                Back
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
