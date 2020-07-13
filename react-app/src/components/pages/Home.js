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
        socket.emit('metainfo',  user);


        socket.on(user.id, data => {
            // console.log(data);
            const { date, stocks } = data;
        
            var newRows = []
            for (var i = 0; i < stocks.length; i++) {
                console.log(stocks[i])
                newRows.push(stocks[i]);
            }
            console.log(newRows);
            setRows(newRows);
        });
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
              <h3>Loading prices ... </h3>
              }
            </div>
        </div>
    );
    
}


export default Home;
