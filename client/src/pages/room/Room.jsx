import './room.css'
import Header from '../../components/header/Header'
import { useParams, useHistory } from "react-router";
import { useState, useEffect, useContext, useRef } from 'react';
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Search } from '@material-ui/icons'
import Message from '../../components/message/Message'
import { io } from 'socket.io-client'

export default function Room() {
    const [room, setRoom] = useState({})
    const roomCode = useParams().roomCode;
    const { user } = useContext(AuthContext)
    const history = useHistory();
    const [query, setQuery] = useState("")
    const [videoID, setVideoID] = useState("")
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef()
    const [messages, setMessages] = useState([]);
    const socket = useRef()
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [arrivalVideoID, setArrivalVideoID] = useState(null);
    const [arrivalQuery, setArrivalQuery] = useState(null);

    // leave room
    const handleLeave = async (e) => {
        e.preventDefault();
        
        // if host leaves delete room
        if (user._id === room.hostID) {
            // delete room messages first
            try {
                await axios.delete(`/messages/${room._id}`);
            } catch(err) {
                console.log(err)
            }

            // delete room
            try {
                await axios.delete(`/rooms/${user._id}`);
                history.push(`/login`)
            } catch(err) {
                console.log(err)
            }
        }
        else {
            history.push(`/login`)
        }
    }

    // search video
    const handleSearch = async (e) => {
        e.preventDefault();

        const extractID = query.split('v=')[1].split('_')[0]
        setVideoID(extractID)
    
        console.log("HANDLE SEARCH")
        console.log(query)
        console.log(videoID)

        socket.current.emit("sendVideo", { videoID: videoID, roomName: room.code })   
        socket.current.emit("sendQuery", { query: query, roomName: room.code })          
    }

    // get room object
    useEffect(() => {
        const fetchRoom = async () => {
            const res = await axios.get(`/rooms/${roomCode}`);
            setRoom(res.data);
        };
        fetchRoom();
    }, [roomCode]);

    // initialize socket connection
  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    // look for incoming messages
    socket.current.on("newMessage", (data) => {
      setArrivalMessage({
        senderID: data.senderID,
        text: data.text,
        createdAt: Date.now(),
        roomID: room._id,
        senderProfilePicture: data.senderProfilePicture
      });
    });

    // look for incoming video update
    socket.current.on("newVideo", (data) => {
        setArrivalVideoID(data.videoID)
    });

    // look for incoming query update
    socket.current.on("newQuery", (data) => {
        setArrivalQuery(data.query)
    });
  }, [room]);

  // join socket room
  useEffect(() => {
    room && socket.current.emit("joinRoom", room.code)
  }, [room])

  // get room messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`/messages/${room._id}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [room]);

  // new message from socket
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  // new video from socket
  useEffect(() => {
    arrivalVideoID && setVideoID(arrivalVideoID);
  }, [arrivalVideoID]);

  // new query from socket
  useEffect(() => {
    arrivalQuery && setQuery(arrivalQuery);
  }, [arrivalQuery]);

  const handleSend = async (e) => {
    e.preventDefault();

    const message = {
      senderID: user._id,
      text: newMessage,
      roomID: room._id,
      senderProfilePicture: user.profilePicture
    };

    // send message to socket
    socket.current.emit("sendMessage", { senderID: user._id, roomName: room.code, text: newMessage, senderProfilePicture: user.profilePicture})

    try {
      const res = await axios.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  // scroll to bottom of messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: 'smooth'})
  }, [messages])

    return (
        <>
        <Header/>
        {room ? (
            <>
            <div className='roomTopbar'>
                <div className="roomTopbarLeft">
                    <button className="roomBackButton" onClick={(handleLeave)}>
                        Leave Room
                    </button>
                </div>

                <div className="roomTopbarCenter">
                    <div className="roomSearchbar">
                        <Search className="searchIcon"/>
                        <input
                          placeholder="Enter YouTube video link here"
                          className="searchInput"
                          onChange={(e) => setQuery(e.target.value)}
                          value={query}
                        />
                    </div>
                </div>

                <div className="roomTopbarRight">
                    <button className="searchSubmit" onClick={(handleSearch)}>
                        Search
                    </button>
                </div>
            </div>

            <div className='room'>
                <div className="roomVideo">
                    <div className="roomVideoWrapper">
                        {videoID ? (
                            <div className="videoPlayer">
                                <iframe
                                  width="1000"
                                  height="550" 
                                  src={`https://www.youtube.com/embed/${videoID}?autoplay=1` }
                                  title="YouTube Video Player" 
                                  frameBorder="0" 
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                  allowFullScreen>
                                </iframe>
                            </div>
                        ) : (
                            <h1 className="noVideoMessage">Enter a YouTube video link</h1>
                        )}
                    </div>
                </div>

                <div className="roomChat">
                    <div className="roomChatWrapper">
                        <div className="chatTop">
                            {messages.map((m) => (
                                <div ref={scrollRef} key={m._id}>
                                    <Message message={m} own={m.senderID === user._id} />
                                </div>
                            ))}
                        </div>

                        <div className="chatBottom">
                            <textarea
                              className="chatMessageInput"
                              placeholder="write something..."
                              onChange={(e) => setNewMessage(e.target.value)}
                              value={newMessage}
                            >
                            </textarea>
                            <button className="chatSendButton" onClick={handleSend}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            </>
        ) : (
            <>Room does not exist</>
        )}
        </>
    )
}
