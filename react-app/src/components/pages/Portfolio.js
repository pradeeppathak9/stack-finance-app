import React, { useState, useEffect } from "react";
import Navbar from "../layouts/Navbar";
import EnhancedTable from "../layouts/EnhancedTable";
import axios from 'axios';
import socketIOClient from "socket.io-client";

// const ENDPOINT = "http://34.87.159.131:9999/";   

function Home(props)  {
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
              <EnhancedTable
              rows={rows}
              headCells={headCells}
              sortKey={'name'}
              sortOrder={'desc'}
              />
              :
              <h3>Loading Portfolio...</h3>
              }
            </div>
        </div>
    );
    
}


export default Home;
