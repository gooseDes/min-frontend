import { useSearchParams } from 'react-router-dom';
import './message.css'
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState } from 'react';

function Message({ text = 'message', author = 'author', type = 'left', src = '/logo512.png', connected = false }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedImg, setSelectedImg] = useState(null);

    function openAuthorProfile() {
        searchParams.set('profile', author === 'You' ? localStorage.getItem('username') : author); 
        setSearchParams(searchParams);
    }

    function openImage(url) {
        setSelectedImg(url);
    }

    function closeImage() {
        setSelectedImg(null);
    }

    return (
        <>
            <div className={`MessageDiv ${type}`}>
                <img
                    className={`MessageAvatar${connected ? ' connected' : ''}`}
                    src={src}
                    onError={(e) => (e.currentTarget.src = '/logo512.png')}
                    draggable="false"
                    onClick={openAuthorProfile}
                />
                <div className={`TextDiv ${type}`}>
                    <div className="Author" onClick={openAuthorProfile}>
                        {author}
                    </div>
                    <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            img: ({ node, ...props }) => (
                                <img
                                    {...props}
                                    className="MessageImage"
                                    onClick={() => openImage(props.src)}
                                />
                            ),
                        }}
                    >
                        {text.replaceAll('\n', '  \n')}
                    </Markdown>
                </div>
            </div>

            {selectedImg && (
                <div className="ImageOverlay" onClick={closeImage}>
                    <img src={selectedImg} className="ImageOverlayContent" />
                </div>
            )}
        </>
    );
}

export default Message;