import './square_img_btn.css';

function SquareImgBtn({ src='', onClick, text='' }) {
    return (
        <div className="SquareImgBtn" onClick={onClick}>
            {src && <img src={src} alt="img" onError={(e) => e.currentTarget.src = '/logo512.png'} />}
            {text && <p>{text}</p>}
        </div>
    )
}

export default SquareImgBtn;