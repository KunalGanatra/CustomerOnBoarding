import React from 'react';
import { customerService } from '../../services/customer.service';
import { Modal } from 'react-bootstrap';
import CustomerHierarchyTemplate  from './CustomerHierarchyTemplate'

export default class CustomerViewModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            customerName: '',
            show: false,
            customerData: []
        };

    }

    viewCustomerHierarchy = (custname) => {
        if (custname != null) {
            this.setState({
                name: custname,
                show: true
            })
        }

        customerService.viewCustomer(custname).then(data => this.setState({ customerData: data }));;
    }


    closeDialog = (e) => {
        this.setState({
            customerName: '',
            customerData: [],
            show: false
        });
        e.preventDefault();
    }


    render() {
        const props = this.props;
        return (

            <Modal show={this.state.show} >
                <Modal.Header>
                    <Modal.Title>View Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <form class="form-horizontal">
                                {
                                    this.state.customerData.map((customer) =>
                                        <CustomerHierarchyTemplate item={customer}  />
                                        )
                                }
                        </form>
                        <div style={{ textAlign: 'center' }}>
                            <button onClick={this.closeDialog} class="btn btn-default">Close</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}

