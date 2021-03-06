﻿import React, { Component } from 'react';
import { adminService } from '../../services/admin.service';
import BootstrapTable from 'react-bootstrap-table-next';
import { authenticationService } from '../../services/authentication.service';
import { Role } from '../../helpers/role'
import AdminModal from './AdminModal';


export class AdminPage extends Component {
    displayName = AdminPage.name

    constructor(props) {
        super(props);


        this.state = {
            userData: [],
            selectedRow: {},
            currentuser: '',
            isAdmin: false,
            searchCriteria: ''
        };

    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ searchCriteria: value });
        adminService.searchUser(value).then(data => this.setState({ userData: data }));;
    }

    handleOnSelect = (row, isSelect) => {
        this.setState({ selectedRow: row })
        return true;
    }

    componentDidMount() {
        authenticationService.currentUser.subscribe(x => this.setState({
            currentUser: x,
            isAdmin: x && x.role === Role.Admin,
            isEdit: x && x.role === Role.Edit,
            isViewOnly: x && x.role === Role.ViewOnly
        }));
    }

    editUser = (e) => {
        this.refs.child.setUserState(this.state.selectedRow);
        e.preventDefault();
    }


    addUser = (e) => {
        this.refs.child.setUserState({});
        e.preventDefault();
    }

    refresh = () => {
        this.setState({ searchCriteria: '' });
        this.setState({ userData: [] });
    }

    render() {
        const columns = [
            {
                dataField: 'firstName',
                text: 'First Name'
            },
            {
                dataField: 'lastName',
                text: 'Last Name'
            },
            {
                dataField: 'username',
                text: 'UserName'
            },
            {
                dataField: 'role',
                text: 'Role'
            }
        ];



        const selectRow = {
            mode: 'radio',
            clickToSelect: true,
            onSelect: this.handleOnSelect

        };

        return (
            <div className="col-md-6 col-md-offset-9">
                <h2>Search User</h2>
                <form name="form" class="form-horizontal pt-10">
                    <div class="form-group">
                        <label class="col-sm-4 col-form-label " htmlFor="userSearch">UserName</label>
                        <div class="col-sm-8">
                            <input type="text" className="form-control" name="userSearch" value={this.state.searchCriteria} onChange={this.handleChange} />
                        </div>
                    </div>
                    <div class="form-group">
                        {
                            this.state.userData.length > 0 &&
                            <BootstrapTable keyField='id' data={this.state.userData} columns={columns} striped selectRow={selectRow}
                                hover
                                condensed
                            />
                        }
                    </div>
                    <div>
                        <div>

                            <div class="col-sm-3">
                                <button className="btn btn-primary" name="add" onClick={this.addUser}>Add</button>
                            </div>
                            <div class="col-sm-3">
                                <button className="btn btn-primary" name="edit" disabled={!this.state.selectedRow.id} onClick={this.editUser}>Edit</button>
                            </div>
                            <AdminModal ref="child" refreshSearch={this.refresh} />
                        </div>
                    </div>
                </form>
            </div>

        );
    }
}
