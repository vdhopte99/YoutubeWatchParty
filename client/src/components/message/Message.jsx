import './message.css'
import { format } from "timeago.js";

export default function Message({message, own}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImage"
          src= {
            message.senderProfilePicture 
            ? message.senderProfilePicture
            : PF + 'person/no-avatar.png'
          }
          alt=''
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  )
}
