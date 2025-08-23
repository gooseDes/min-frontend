import './profile_thing.css'
import logo from '../logo.png'

function ProfileThing({ text = 'Default text', animation = true, onClick }) {
    const handleClick = () => {
        if (onClick) {
            onClick(text);
        }
    };
    return (
        <div className={`ProfileThingDiv${animation ? ' anim' : ''}`} onClick={handleClick}>
            <img src={logo} alt='avatar' draggable='false' className='ProfileThingImage'/>
            <p className='ProfileThingText'>{text}</p>
        </div>
    )
}

export default ProfileThing