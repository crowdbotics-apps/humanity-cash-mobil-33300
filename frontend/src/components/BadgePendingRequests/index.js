import {useStores} from '../../models'
import {ReactComponent as Pending} from '../../assets/svg/pendiente.svg';
import './style.css'
import {observer} from "mobx-react";

const PendingRequestsNumber = () => {

  const {loginStore} = useStores()

  const requests = loginStore?.number_of_pending_requests

  return (
    <div style={{position: 'relative'}}>
      <Pending color="action"/>
      {(requests > 0) && (
        <p className='badge-notifications'>{requests}</p>
      )}
    </div>
  )
}

export default observer(PendingRequestsNumber)
