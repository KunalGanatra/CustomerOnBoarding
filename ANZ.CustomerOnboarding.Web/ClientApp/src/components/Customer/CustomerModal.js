import React from 'react';
import { customerService } from '../../services/customer.service';
import { Modal } from 'react-bootstrap';
import Autocomplete from 'react-autocomplete';



export default class CustomerModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedParentCustomer: '',
            name: '',
            customerId: '',
            address: '',
            rmName: '',
            rmAddress: '',
            country: '',
            autocompleteData: [],
            customer: {},
            show: false,
            isSubmitted: false
        };

    }



    setCustomerState = (customerData) => {
        if (customerData != null) {
            this.setState({
                id: customerData.id,
                name: customerData.name,
                address: customerData.address,
                customerId: customerData.customerId,
                rmName: customerData.rmName,
                rmAddress: customerData.rmAddress,
                country: customerData.country,
                address: customerData.address,
                selectedParentCustomer: customerData.parent,
                show: true
            })
        }

    }


    onChange = (e) => {
        this.setState({
            selectedParentCustomer: e.target.value
        });

        this.retrieveDataAsynchronously(e.target.value);

    }

    closeDialog = (e) => {
        this.setState({
            selectedParentCustomer: '',
            id: '',
            name: '',
            customerId: '',
            address: '',
            rmName: '',
            rmAddress: '',
            country: '',
            autocompleteData: [],
            customer: {},
            show: false
        });


        e.preventDefault();
    }

    getItemValue = (item) => {
        return `${item.name}`;
    }

    renderItem = (item, isHighlighted) => {
        return (
            <div >
                {item.name}
            </div>
        );
    }

    onSelect = (val) => {
        this.setState({
            value: val
        });

    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    retrieveDataAsynchronously = (searchText) => {
        customerService.searchCustomerByName(searchText).then(data => this.setState({ autocompleteData: data }));
    }

    saveCustomer = (e) => {
        this.setState({ isSubmitted: true });
        e.preventDefault();
        // stop here if form is invalid
        if (!(this.state.customerId && this.state.address && this.state.rmName && this.state.rmAddress
            && this.state.address && this.state.name && this.state.country)) {
            return;
        }
        var customerData = {
            id: this.state.id,
            name: this.state.name,
            address: this.state.address,
            customerId: this.state.customerId,
            rmAddress: this.state.rmAddress,
            country: this.state.country,
            rmName: this.state.rmName,
            parent: this.state.selectedParentCustomer
        }

        if (customerData.id == '' || customerData.id == null) {
            customerService.addCustomer(customerData);
        }
        else {
            customerService.editCustomer(customerData);
        }
        this.setState({
            selectedParentCustomer: '',
            name: '',
            id: '',
            customerId: '',
            address: '',
            rmName: '',
            rmAddress: '',
            country: '',
            autocompleteData: [],
            customer: {},
            show: false,
            isSubmitted: false
        });
        this.props.refreshSearch();
    }


    render() {
        const props = this.props;


        return (

            <Modal show={this.state.show} >
                <Modal.Header>
                    <Modal.Title>{this.state.id != null ? 'Edit Customer' : 'Add Customer'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <form class="form-horizontal">
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.customerId ? ' has-error' : '')}>
                                <label class="control-label col-sm-3 justify-content-left" htmlFor="customerId">CustomerId</label>
                                <div class="col-sm-9">
                                    <input type="text" className="form-control" onChange={this.handleChange} name="customerId" value={this.state.customerId} />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="control-label col-sm-3" htmlFor="parent">Parent</label>
                                <div class="col-sm-9 ">
                                    <Autocomplete className="form-control"
                                        getItemValue={this.getItemValue}
                                        items={this.state.autocompleteData}
                                        renderItem={this.renderItem}
                                        value={this.state.selectedParentCustomer}
                                        onChange={this.onChange}
                                        onSelect={this.onSelect}
                                    />
                                </div>
                            </div>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.name ? ' has-error' : '')}>
                                <label class="control-label col-sm-3" htmlFor="customerName">CustomerName</label>
                                <div class="col-sm-9">
                                    <input type="text" className="form-control" name="name" onChange={this.handleChange} value={this.state.name} />
                                </div>
                            </div>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.address ? ' has-error' : '')}>
                                <label class="control-label col-sm-3" htmlFor="address">Address</label>
                                <div class="col-sm-9">
                                    <textarea type="text" className="form-control" name="address" onChange={this.handleChange} value={this.state.address} />
                                </div>
                            </div>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.rmName ? ' has-error' : '')}>
                                <label class="control-label col-sm-3" htmlFor="rmName">RM Name</label>
                                <div class="col-sm-9">
                                    <input type="text" className="form-control" name="rmName" onChange={this.handleChange} value={this.state.rmName} />
                                </div>
                            </div>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.rmAddress ? ' has-error' : '')}>
                                <label class="control-label col-sm-3" htmlFor="rmAddress">RM Address</label>
                                <div class="col-sm-9">
                                    <textarea type="text" className="form-control" name="rmAddress" onChange={this.handleChange} value={this.state.rmAddress} />
                                </div>
                            </div>
                            <div className={'form-group' + (this.state.isSubmitted && !this.state.country ? ' has-error' : '')}>
                                <label class="control-label col-sm-3" htmlFor="country">Country</label>
                                <div class="col-sm-9">
                                    <input type="text" className="form-control" name="country" onChange={this.handleChange} value={this.state.country} />
                                </div>
                            </div>



                        </form>
                        <div style={{ textAlign: 'center' }}>

                            <button onClick={this.saveCustomer} class="btn btn-primary">Submit</button>
                            &nbsp;
                            <button onClick={this.closeDialog} class="btn btn-default">Cancel</button>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

