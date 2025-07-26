import './message.css'

function Message({ text = 'message', author = 'author', type = 'left' }) {
    return (
        <div className={`MessageDiv ${type}`}>
            <div className={`TextDiv ${type}`}>
                <p>{text}</p>
            </div>
        </div>
    )
}

export default Message