import ModalVerific from '../Modal/ModalVerific';

type badgeProps = {
    title: any;
}

const moveToUppercase = (data: Array<string>) => data.map((v: String) => v.toUpperCase());

const deleteItems = (info: any, delete_items: boolean) => {
    let deleteItems = ['id', 'user_name', 'status'];
    if (delete_items) {
        if (deleteItems.includes(info)) return false
        else return true
    } else {
        return true
    }

    // let value;
    // if (data) {
    //     if (data.length > 0) {
    //         value = data.filter((item) => {
    //             if (deleteItems.includes(item)) return true
    //         })
    //     }
    // }

    // console.log(data, 'debia eliminar', value)
    // if (value) return value
    // else return data

}

const DateForment = ({ title }: any) => {
    let destructure = title.split('-')
    return (
        <div className="d-flex flex-column bd-highlight">
            <div className="bd-highlight td-date-date">{destructure[0]}</div>
            <div className="bd-highlight td-date-hours">{destructure[1]}</div>
        </div>
    )
}

const TableBadge = ({ title }: badgeProps) => {
    if (title === 'Deposit') return <span className='deposit-badge'>{title}</span>
    if (title === 'complete') return <span className='status-complete-badge'>{title}</span>
    return <span className='withdrawal-badge'>{title}</span>
}


const modifyTdItem = (info: any, data: any, title: any) => {

    let span;

    switch (info) {
        case ('type' || 'status'):
            span = <TableBadge title={title} />
            break;
        case ('amount'):
            span = <span className={data.type === 'Deposit' ? 'deposit-text' : 'withdrawal-text'}>{title}</span>
            break;
        case ('created_at' || 'confirmed_at'):
            span = <span>
                <DateForment title={title} />
            </span>
            break;
        case ('user_name'):
            span = <span>
                <ModalVerific>
                    {title}
                </ModalVerific>
            </span>
            break;
        default:
            span = title;
    }

    return span
}

export {
    moveToUppercase,
    deleteItems,
    modifyTdItem
}