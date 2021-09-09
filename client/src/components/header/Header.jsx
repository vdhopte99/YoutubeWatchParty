import './header.css'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'

export default function Header() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const { user } = useContext(AuthContext)

  return (
    <div className="header">
      <div className="headerLeft">
        <Link to='/' style={{ textDecoration: "none" }}>
          <span className="logo">YT WatchParty</span>
        </Link>
      </div>

      <div className="headerRight">
        <img
          src={
            user.profilePicture
            ? user.profilePicture
            : PF + 'person/no-avatar.png'
          }
          alt=""
          className="headerProfilePicture"
        />
      </div>
    </div>
  );
}