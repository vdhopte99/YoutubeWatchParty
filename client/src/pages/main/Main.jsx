import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './main.css'
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios'
import { useHistory } from "react-router";
import Header from '../../components/header/Header'

export default function Main() {
    const { user } = useContext(AuthContext)
    const history = useHistory();
    const [room, setRoom] = useState(null)

    // check if user already has a room
    useEffect(() => {
        const fetchRoom = async () => {
            const res = await axios.get(`/rooms/${user._id}/userroom`);
            setRoom(res.data);
        };
        fetchRoom();
      }, [user]);

    const handleCreate = async (e) => {
        e.preventDefault();

        // delete existing room
        if (room !== null) {
            try {
                await axios.delete(`/rooms/${user._id}`);
            } catch(err) {
                console.log(err)
            }
        }

        // create new room and redirect
        try {
            const res = await axios.post('/rooms', { hostID: user._id, members: [user._id] });
            history.push(`/room/${res.data.code}`)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <>
        <Header/>
        <div className="main">
            <div className="mainWrapper">
                <div className="mainTop">
                    <h3 className="mainLogo">Welcome to StreamTube! </h3>
                    <span className="mainDescription">
                        Create your own room or join an existing one
                    </span>
                </div>

                <div className="mainBottom">
                    <div className="mainOptionsBox">
                        <button className="mainCreateButton" onClick={handleCreate}>
                                Create a Room
                        </button>

                        <Link to={`/join`}>
                            <button className="mainJoinButton">
                                Join a Room
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
