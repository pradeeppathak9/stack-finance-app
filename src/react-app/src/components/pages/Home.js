import React, { useState, useEffect } from "react";
import Navbar from "../layouts/Navbar";
import EnhancedTable from "../layouts/EnhancedTable";

import socketIOClient from "socket.io-client";

// const ENDPOINT = "http://34.87.159.131:9999/";   

function Home(props)  {
    const [rows, setRows] = useState();

    const {token, user} = JSON.parse(localStorage.getItem("tokens"))
    // console.log(token, user);

    
    useEffect(() => {
        const socket = socketIOClient();
        // send information
        socket.emit('all-stocks',  user);
        socket.on("message", data => {
            // console.log(data);
            const { date, stocks } = data;
            var newRows = []
            for (var i = 0; i < stocks.length; i++) {
                // console.log(stocks[i])
                newRows.push(stocks[i]);
            }
            console.log(newRows.length);
            setRows(newRows);
        });

        return () => {
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
              <EnhancedTable
              rows={rows}
              headCells={headCells}
              sortKey={'name'}
              sortOrder={'desc'}
              />
              :
            <div className="auth-wrapper">
                <div className="loading">
                    <h3>Loading Stock Prices ... </h3>
                </div>
            </div>
              }
            </div>
        </div>
    );
    
}


export default Home;
