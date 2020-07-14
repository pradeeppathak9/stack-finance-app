import React, { useState, useEffect } from "react";
import Navbar from "../layouts/Navbar";
import axios from 'axios';
import socketIOClient from "socket.io-client";

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

// const ENDPOINT = "http://34.87.159.131:9999/";   
const useStyles = makeStyles({
    table: {
      minWidth: 300,
    },
  });

function ManagePortfolio(props)  {
    const [rows, setRows] = useState();
    const {token, user} = JSON.parse(localStorage.getItem("tokens"))
    // console.log(token, user);

    async function fetchStockData() {
        var rows = []
        var users_stocks = []

        await axios.get("api/users/my-stocks", {
            headers: { "x-auth-token": token}
        }).then(result => {
            var rows = []
            const stocks = result.data;
            console.log(stocks)
            for (var i = 0; i < stocks.length; i++) {
                var item = stocks[i];
                users_stocks.push(item._id)
            }
            console.log(users_stocks.length);
        }).catch(e => {
            if (e.response.status === 400) { localStorage.clear(); window.location.reload();}
        });


        axios.get("api/stock").then(result => {
            var rows = []
            const stocks = result.data;
            for (var i = 0; i < stocks.length; i++) {
                var item = stocks[i];
                var in_portfolio = users_stocks.includes(item._id)   
                rows.push({  
                    id: item._id, 
                    name: item.name, 
                    symbol: item.symbol,
                    in_portfolio: in_portfolio
                })
            }
            console.log(rows.length);
            setRows(rows)
            console.log(rows)
        }).catch(e => {
            if (e.response.status === 400) {
                if (e.response.status === 400) { localStorage.clear(); window.location.reload();}
            }
            setRows(null)
        });
    }

    useEffect(() => {
        fetchStockData()
    }, []);

    function handleClick(id, mode) {
        console.log(id, mode)
        var URL = "";
        if (mode == "delete") 
            URL = "api/users/remove-stock"
        else
            URL = "api/users/add-stock"
        
        axios.get(URL, {
            headers: { "x-auth-token": token},
            params: { id: id}
        }).then(result => {  
            fetchStockData()
        }).catch(e => {
            if (e.response.status === 400) {
                localStorage.clear();
                window.location.reload();
            }
        });
    }

    const classes = useStyles();
    return (
        <div className="App">
            <Navbar/>
            {rows ?
                <div container className="stock-prices">
                <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="center">Symbol</TableCell>
                        <TableCell align="right">Add/Remove</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name} style={{height: 5}}>
                        <TableCell component="th" scope="row">{row.name}</TableCell>
                        <TableCell align="center">{row.symbol}</TableCell>
                        <TableCell align="right">
                        { row.in_portfolio ?
                            <IconButton onClick={() => { handleClick(row.id, "delete") }}>
                                <DeleteIcon color="secondary" />
                            </IconButton>
                            :
                            <IconButton onClick={() => { handleClick(row.id, "add") }}>
                                <AddIcon color="primary" />
                            </IconButton>  
                        }
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>      
            </div>
            :    
            <div className="auth-wrapper">
              <div className="loading">
                  <h3>Loading Portfolio ...</h3>
              </div>
            </div>
            }
        </div>
    );
    
}


export default ManagePortfolio;
