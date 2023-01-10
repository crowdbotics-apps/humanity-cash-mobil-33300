import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import { ConfirmIcons } from '../icons'

type Props = {
    type: string;
}



const ModalAlerts = ({ type }: Props) => {


    return (
        <>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <ConfirmIcons />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Stack gap={2} className="col-md-5 mx-auto modal-button">
                    <h6>
                        Request Great
                    </h6>
                </Stack>

            </Modal.Footer>
        </>
    )

}

export default ModalAlerts;