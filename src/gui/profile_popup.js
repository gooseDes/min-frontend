import { useImperativeHandle, forwardRef, useState } from 'react';
import '../App.css';
import './profile_popup.css';
import logo from '../logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faXmark } from '@fortawesome/free-solid-svg-icons';

const ProfilePopup = forwardRef(({ id = '', username = '' }, ref) => {
    const [isShown, setIsShown] = useState(false);

    useImperativeHandle(ref, () => ({
        show: () => setIsShown(true),
        hide: () => setIsShown(false),
    }));

    return (
        <div className={`ProfilePopup${isShown ? ' show' : ''}`} id={id}>
            <div className='ProfilePopupHeader'>
                <p>{`Profile: ${username}`}</p>
                <button className='CloseButton' onClick={() => setIsShown(false)}>
                    <FontAwesomeIcon icon={faXmark}/>
                </button>
            </div>
            <div className='ProfilePopupContent'>
                <img src={logo} alt='logo' className='ProfilePopupAvatar'></img>
                <p className='ProfilePopupUsername'>{username}</p>
                <div className='ProfilePopupBottom'>
                    <button className='MessageButton'><p>Send message</p><FontAwesomeIcon className='icon' icon={faMessage}/></button>
                </div>
            </div>
        </div>
    );
});


export default ProfilePopup;