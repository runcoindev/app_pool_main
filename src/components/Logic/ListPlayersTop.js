import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { transformAddress } from '../utils/transformAddress';
import { Card, CardContent, CardHeader, Typography, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { getSeasonCurrent, getWinnersSeason } from '../services/server';
import { useLogin } from '../hooks/useLogin';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
    table: {
        [theme.breakpoints.up('xs')]: {
            minWidth: 150,
        },
        [theme.breakpoints.up('sm')]: {
            minWidth: 150,
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    }
}));

const ListPlayersTop = () => {
    const classes = useStyles();
    const [season, setSeason] = useState(0);
    const [cantSeason, setCantSeason] = useState(0);

    const handleChange = (event) => {
        setSeason(event.target.value);
    };

    const { user } = useLogin()
    const [top, setTop] = useState([])


    useEffect(
        () => {
            if (user.player != "") {
                let res = getWinnersSeason()
                    .then(
                        (res) => setTop(res)
                    )
                    .catch(
                        (error) => console.log(error)
                    )
            }
            getSeasonCurrent()
                .then(
                    (cant) => {
                        setCantSeason(cant)
                    }
                )
                .catch(
                    (error) => console.log(error)
                )
        }, [user]
    )

    const listMenu = () => {
        let menuItems = []
        menuItems.push(<MenuItem value=""><em>None</em></MenuItem>)
        for (let index = 0; index <= cantSeason; index++) {
            menuItems.push(<MenuItem value={index} key={index}>{index}</MenuItem>)
        }
        return menuItems
    }

    return (
        <Card>
            <CardHeader title={<Typography variant="h5">Top</Typography>} />
            <CardContent>
                <FormControl className={classes.formControl}>
                    <InputLabel id="demo-simple-select-label">Season</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={season}
                        onChange={handleChange}
                    >
                        {
                            listMenu()
                        }
                    </Select>
                </FormControl>
                <IconButton aria-label="delete" style={{ marginTop: '12px' }}>
                    <SearchIcon />
                </IconButton>
                <TableContainer component={Paper}>
                    <Table className={classes.table} size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>N</TableCell>
                                <TableCell>Player</TableCell>
                                <TableCell align="right">Amount of plays</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {top.map((row, index) => (
                                <TableRow key={row.player+index}>
                                    <TableCell component="th" scope="row">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="right">{transformAddress(row.address)}</TableCell>
                                    <TableCell align="right">{row.cantGame}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}

export default ListPlayersTop;