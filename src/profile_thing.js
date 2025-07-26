import './profile_thing.css'
import logo from './logo.png'

function ProfileThing() {
    return (
        <div className='ProfileThingDiv'>
            <img src={logo} alt='avatar' draggable='false' className='ProfileThingImage'/>
            <p className='ProfileThingText'>Olexey Totskiy</p>
        </div>
    )
}

export default ProfileThing