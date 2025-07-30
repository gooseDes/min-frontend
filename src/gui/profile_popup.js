import { useImperativeHandle, forwardRef, useState } from 'react';
import '../App.css';
import './profile_popup.css';

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
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <div className='ProfilePopupContent'>
                <p>Profile info (WIP)</p>
            </div>
        </div>
    );
});


export default ProfilePopup;