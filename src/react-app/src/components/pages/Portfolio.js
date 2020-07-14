import React, { useState, useEffect } from "react";
import Navbar from "../layouts/Navbar";
import EnhancedTable from "../layouts/EnhancedTable";
import axios from 'axios';
import socketIOClient from "socket.io-client";

// const ENDPOINT = "http://34.87.159.131:9999/";   

function Home(props)  {
    const [rows, setRows] = useState();

    const {token, user} = JSON.parse(localStorage.getItem("tokens"))
    // console.log(token, user);

    useEffect(() => {
        const socket = socketIOClient();

        // request for portfolio information
        socket.emit('portfolio',  user);

        var interval = setInterval(function() {
            // request for portfolio information after every 3 seconds
            socket.emit('portfolio',  user);
        }, 3000);
        
        socket.on("message", data => {
            // console.log(data);
            const { date, stocks, name } = data;
            console.log(name);
            var newRows = []
            for (var i = 0; i < stocks.length; i++) {
                // console.log(stocks[i])
                newRows.push(stocks[i]);
            }
            console.log(newRows.length);
            setRows(newRows);
        });
        return () => {
            clearInterval(interval);
            socket.disconnect();
         }
      }, []);


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
                rows.length > 0 ?
                    <EnhancedTable
                    rows={rows}
                    headCells={headCells}
                    sortKey={'name'}
                    sortOrder={'desc'}
                    />
                :
                    <div className="auth-wrapper">
                        <div className="loading">
                            <h3>No Stocks in Portfolio!</h3>
                            <h3> Go to Manage Portfolio for adding Stocks to Portfolio</h3>
                        </div>
                    </div>
              :
                <div className="auth-wrapper">
                    <div className="loading">
                        <h3>Loading Portfolio Prices ...</h3>
                    </div>
                </div>
              }
            </div>
        </div>
    );
    
}


export default Home;
