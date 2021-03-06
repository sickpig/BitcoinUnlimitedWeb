'use strict';

import React from 'react';
import Axios from 'axios';
import ReactLoading from "react-loading";
import Log from './Log.jsx';
import { getLocalstorageKey } from '../../../../helpers/helpers.js';

class LogList extends React.Component {

    constructor(props) {
        super(props);
        this.showLogs = this.showLogs.bind(this);
        this.state = {
            fetching: false,
            logs: null
        }
    }

    getLogs() {
        let jwt = getLocalstorageKey('jwt');
        if (jwt) {
            Axios.get('/get/secure/Log', { headers: { Authorization: `Bearer ${jwt}`}}).then(res => {
                let { data: logs } = res;
                if (logs) {
                    this.setState({ logs });
                }
            }).catch(e => {
                console.log(e);
            });
        }
    }

    displayLogs(logs) {
        if (logs) {
            let results = Object.keys(logs).map(key => {
                let log = logs[key];
                return (<Log key={ key } item={ log } />);
            });
            return (
                <tbody>
                    { results }
                </tbody>
            );
        }
        return null;
    }

    showLogs(e) {
        e.preventDefault();
        this.setState({ fetching: true, logs: null });
        this.getLogs();
    }

    render() {
        let { fetching, logs } = this.state;
        if (!logs && !fetching) {
            return (
                <div className="log-list">
                    <h2>Database Logs</h2>
                    <div className="link underline basic-link" onClick={ this.showLogs }>Show Logs</div>
                </div>
            );
        } else if (!logs && fetching) {
            return (
                <div className="log-list">
                    <ReactLoading type="balls" color="#ccc" />
                </div>
            );
        }
        return (
            <div className="log-list">
                <h2>Database Logs</h2>
                <div className="link underline basic-link" onClick={ this.showLogs }>Refresh Logs</div>
                <table className="table table-bordered table-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Uid</th>
                            <th scope="col">Created</th>
                            <th scope="col">Status</th>
                            <th scope="col">Message</th>
                        </tr>
                    </thead>
                    { this.displayLogs(logs) }
                </table>
            </div>
        );
    }
}

export default LogList;
