import React, { useState, useEffect } from "react";
import Navbar from "../layouts/Navbar";
import EnhancedTable from "../layouts/EnhancedTable";
import axios from 'axios';
import socketIOClient from "socket.io-client";

// const ENDPOINT = "http://34.87.159.131:9999/";   

function ManagePortfolio(props)  {
    const [rows, setRows] = useState();
    const [allStocks, setAllStocks] = useState();


    const {token, user} = JSON.parse(localStorage.getItem("tokens"))
    // console.log(token, user);

    function getAllStocks() {
        axios.get("/api/stock").then(result => {
            console.log(result)
            if (result.status === 200) {
                setAllStocks(result.data)
            } else {
                setAllStocks(null);
            }
        }).catch(e => {
            setAllStocks(null);
        });
    }

    const headCells = [
        { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
        { id: 'symbol', numeric: false, disablePadding: false, label: 'Symbol' },
        { id: 'price', numeric: true, disablePadding: false, label: 'Price' },
    ];
    
    return (
        <div className="App">
            <Navbar/>
          <div container className="stock-prices">
              {rows ?
              <EnhancedTable
              rows={rows}
              headCells={headCells}
              sortKey={'name'}
              sortOrder={'desc'}
              />
              :
              <div className="auth-wrapper">
              <div className="auth-inner">
                  <h3>Loading Your Stocks ...</h3>
              </div>
            </div>
              
              }
            </div>
        </div>
    );
    
}


export default ManagePortfolio;
