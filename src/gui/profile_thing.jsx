import './profile_thing.css'

function ProfileThing({ text = 'Default text', src = '/logo512.png', animation = true, onClick }) {
    const handleClick = () => {
        if (onClick) {
            onClick(text);
        }
    };
    return (
        <div className={`ProfileThingDiv${animation ? ' anim' : ''}`} onClick={handleClick}>
            <img src={src} alt='avatar' draggable='false' className='ProfileThingImage' onError={(e) => e.currentTarget.src='/logo512.png'}/>
            <p className='ProfileThingText'>{text}</p>
        </div>
    )
}

export default ProfileThing