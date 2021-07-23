import React from 'react'

function Model() {
    return (
        <div className="model">
            <div className="model-content">
                <p>New Enrty</p>
                <input type="text" placeholder="INR 0.00"></input>
                <textarea>Entry Note</textarea>
                <button className="green-btn">IN</button>
                <button className="close-btn">Close</button>
            </div>
        </div>
    )
}

export default Model;
