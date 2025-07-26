import './profile_thing.css'
import logo from '../logo.png'

function ProfileThing({ text = 'Default text', onClick }) {
    const handleClick = () => {
        if (onClick) {
            onClick(text);
        }
    };
    return (
        <div className='ProfileThingDiv' onClick={handleClick}>
            <img src={logo} alt='avatar' draggable='false' className='ProfileThingImage'/>
            <p className='ProfileThingText'>{text}</p>
        </div>
    )
}

export default ProfileThing