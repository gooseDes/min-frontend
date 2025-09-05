import { useSearchParams } from 'react-router-dom';
import './message.css'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';

function Message({ text = 'message', author = 'author', type = 'left', src = '/logo512.png', connected = false }) {
    const [searchParams, setSearchParams] = useSearchParams();

    function openAuthorProfile() {
        searchParams.set('profile', author == 'You' ? localStorage.getItem('username') : author); 
        setSearchParams(searchParams);
    }

    function handleImageClick(src) {
        window.openImageOverlay(src);
    }

    return (
        <div className={`MessageDiv ${type}`}>
            <img className={`MessageAvatar${connected ? ' connected' : ''}`} src={src} onError={(e) => e.currentTarget.src='/logo512.png'} draggable='false' onClick={openAuthorProfile} />
            <div className={`TextDiv ${type}`}>
                <div className='Author' onClick={openAuthorProfile}>{author}</div>
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        img: ({ node, ...props }) => (
                        <img {...props} style={{ cursor: "pointer" }} onClick={() => handleImageClick(props.src)} />
                        )
                    }}
                >
                    {text.replaceAll('\n', '  \n')}
                </Markdown>
            </div>
        </div>
    )
}

export default Message