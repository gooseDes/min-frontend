import { useSearchParams } from 'react-router-dom';
import './message.css'

function Message({ text = 'message', author = 'author', type = 'left' }) {
    const [searchParams, setSearchParams] = useSearchParams();
    return (
        <div className={`MessageDiv ${type}`}>
            <div className={`TextDiv ${type}`}>
                <div className='Author' onClick={() => { searchParams.set('profile', author); setSearchParams(searchParams); }}>{author}</div>
                <p>{text}</p>
            </div>
        </div>
    )
}

export default Message