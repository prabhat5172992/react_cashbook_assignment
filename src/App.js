import React, { useState, useEffect } from 'react';
import Moment from 'react-moment';
import './App.css';


const MomentDate = ({time}) => {
  return (
    <p><Moment>{time}</Moment></p>
  );  
}


function App() {
  const [open, setOpen] = useState(false);
  const [btnType, setType] = useState("IN");
  const [amt, setAmt] = useState(0);
  const [text, setText] = useState("");
  const [totalAmt, setTotal] = useState(0);
  const [data, setData] = useState([]);
  const [btnDisable, setDisable] = useState(false);

  useEffect(()=>{
    setTotal(parseFloat(localStorage.getItem("totalAmount")) || 0);
    if(localStorage.getItem("cashbookData")) {
      setData(JSON.parse(localStorage.getItem("cashbookData")) || []);
    }

    if(document.body.clientHeight < (window.innerHeight - 50)) {
      document.getElementById('footer_btn').style.position = "fixed";
    }
  }, []);

  useEffect(()=>{
    localStorage.setItem("totalAmount", totalAmt);
    localStorage.setItem("cashbookData", JSON.stringify(data));
    if(document.body.clientHeight > (window.innerHeight - 50)) {
      document.getElementById('footer_btn').style.position = "sticky";
    }
  });

  const openModel = (e, type) => {
    e.preventDefault();
    setOpen(true);
    setType(type);
    setAmt(0);
    setText("");
  }

  const closeModel = (e) => {
    e.preventDefault();
    setOpen(false);
    setDisable(false);
  }

  const getAmount = (e) => {
    setAmt(Number(e.target.value));
    if(isNaN(Number(e.target.value))){
      setDisable(true);
    } else {
      setDisable(false);
    }
  }

  const getText = (e) => {
    setText(e.target.value);
  }

  const submitData = (e, type) => {
    e.preventDefault();
    const obj = {};
    if(amt && text) {
      obj["time"] = new Date();
      if(type === "IN") {
        obj["text"] = text;
        obj["inAmount"] = amt;
        setData(ar => [...ar, obj]);
        setTotal(amount => parseFloat(amount) + parseFloat(amt));
      }
      if(type === "OUT" && totalAmt >= amt) {
        obj["text"] = text;
        obj["outAmount"] = amt;
        setData(ar => [...ar, obj]);
        setTotal(amount => parseFloat(amount) - parseFloat(amt));
      }
      setOpen(false);
    }
  }

  const displayRow = () => {
    return data.map((item, index) => 
    <div className="wrap" key={`key_${index}${item.text}`}>
      <div className="first">
        <MomentDate time={item.time} />
        <p>{item.text}</p>
      </div>
      <div className="out">
        <p>Out</p>
        {item.outAmount ? <p>{`₹ ${item.outAmount.toFixed(2)}`}</p> : <p>-</p>}
      </div>
      <div className="in">
        <p>In</p>
        {item.inAmount ? <p>{`₹ ${item.inAmount.toFixed(2)}`}</p> : <p>-</p>}
      </div>
    </div>)
  }

  return (
    <div className="App">
      <div>
        <h1 className="Heading">My Cashbook</h1>
        <div className="today-balance">
          <h1 data-testid="balance">{`₹ ${totalAmt.toFixed(2)}`}</h1>
          <p>Today's Balance</p>
        </div>
      </div>
      <div className="transaction">
        {data.length ? 
        <div className="wrapper">
          {displayRow()}
        </div>:
        <div className="entry">
          <h1 data-testid="no-entry-found">No Entry Found!</h1>
        </div>}
      </div>
      <div id="footer_btn" className="action-group">
        <button className="red"  data-testid="cashout-btn" onClick={(e)=>openModel(e, "OUT")}>Out</button>
        <button className="green"  data-testid="cashin-btn" onClick={(e)=>openModel(e, "IN")}>IN</button>
      </div>
      {open ? <div className="model">
            <div className="model-content">
                <p>New Entry</p>
                <input type="text" placeholder="₹ 0.00"  data-testid="amount" onChange={(e)=>getAmount(e)}></input>
                <textarea placeholder="Entry Note"  data-testid="note" onChange={(e)=>getText(e)} />
                {btnType === "IN" ? 
                  <button 
                    className="green-btn"
                    data-testid="create-entry-btn"
                    onClick={(e)=> submitData(e, "IN")}
                    disabled={btnDisable}
                  >
                    IN
                  </button> : 
                  <button
                    className="red-btn"
                    data-testid="create-entry-btn"
                    onClick={(e)=> submitData(e, "OUT")}
                    disabled={btnDisable}
                  >
                    OUT
                  </button>}
                <button className="close-btn" onClick={(e) => closeModel(e)}>Close</button>
            </div>
        </div> : null}
    </div>
  );
}

export default App;
