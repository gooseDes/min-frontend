import { useSearchParams } from 'react-router-dom';
import './message.css'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatTime } from '../../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faReply } from '@fortawesome/free-solid-svg-icons';
import { t } from 'i18next';

function Message({ text = 'message', author = 'author', type = 'left', src = '/logo512.png', connected = false, sent_at = null, seen = false, messages = [], onContextMenu }) {
    const [searchParams, setSearchParams] = useSearchParams();

    function openAuthorProfile() {
        searchParams.set('profile', author == 'You' ? localStorage.getItem('username') : author); 
        setSearchParams(searchParams);
    }

    function handleImageClick(src) {
        window.openImageOverlay(src);
    }

    function formatReplyText(msg) {
        try {
            return `${msg.author}: ${msg.text}`;
        } catch {
            return t('old_message');
        }
    }

    function convertText(text) {
        if (text[0] != '/') return text.replaceAll('\n', '  \n');
        else {
            return text.slice(text.indexOf('\n'));
        }
    }

    return (
        <div className={`MessageDiv ${type}`}>
            <img className={`MessageAvatar${connected ? ' connected' : ''}`} src={src} onError={(e) => e.currentTarget.src='/logo512.png'} draggable='false' onClick={openAuthorProfile} />
            <div className={`TextDiv ${type}`} onContextMenu={onContextMenu}>
                <div className='Author' onClick={openAuthorProfile}>{author}</div>
                {(text[0] == '/') ? (<div className='MessageReply'><p><FontAwesomeIcon icon={faReply} />{formatReplyText(messages.find(msg => msg.id == parseInt(text.split(' ')[1])))}</p></div>) : <div />}
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        img: ({ node, ...props }) => (
                        <img {...props} style={{ cursor: "pointer", maxWidth: "100%" }} onClick={(e) => { e.preventDefault(); handleImageClick(props.src) }} />
                        )
                    }}
                >
                    {convertText(text)}
                </Markdown>
                <div className='MessageAdditionsDiv'>
                    <p className='DateText'>{formatTime(sent_at)}</p>
                    {seen && type=='right' ? <FontAwesomeIcon icon={faCheck}/> : <p />}
                </div>
            </div>
        </div>
    )
}

export default Message