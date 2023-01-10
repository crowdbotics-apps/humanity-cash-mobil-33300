import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Eyes } from '../icons'
import Stack from 'react-bootstrap/Stack';
import ModalAlerts from './ModalAlerts'

type Props = {
    children: any;
}



const ModalVerific = ({ children }: Props) => {

    const [show, setShow] = useState(false);
    const [showData, setShowData] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(false);


    const handleClose = () => {
        if (confirmPassword) setShowData(true)
        setShow(false)
    };
    const handleShow = () => setShow(true);

    const getPassword = () => {

        setShow(false);
    }

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (password === '123') {
            setConfirmPassword(true)
        }
    }

    if (showData) return children

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Show
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                className={confirmPassword ? 'modal-content-alert' : ''}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                {
                    confirmPassword ?
                        <ModalAlerts type='confirm' />
                        :
                        <>
                            <Modal.Header closeButton>
                                <Modal.Title className='title-modal'>Privacy Requirement</Modal.Title>
                            </Modal.Header>
                            <form onSubmit={onSubmit}>
                                <Modal.Body>
                                    <div>
                                        <h6 className='title-h6'>Please enter your password to confirm</h6>
                                    </div>


                                    <Form.Group className="mb-3" >
                                        <Form.Label className='form-label'>PASSWORD</Form.Label>
                                        <InputGroup className="mb-3">
                                            <Form.Control
                                                type="password" name="password" className='input-large' onChange={(e) => setPassword(e.target.value)}
                                            />
                                            <Button variant="outline-secondary" id="button-addon2" className='eyes-buttons'>
                                                <Eyes />
                                            </Button>
                                        </InputGroup>
                                    </Form.Group>


                                </Modal.Body>
                                <Modal.Footer>
                                    <Stack gap={2} className="col-md-5 mx-auto modal-button">
                                        <Button variant="primary" type="submit" >
                                            Confirm
                                        </Button>
                                    </Stack>

                                </Modal.Footer>
                            </form>
                        </>

                }

            </Modal>
        </>
    );
};


export default ModalVerific;