import React, { useState, useEffect } from 'react';
import { observer } from "mobx-react-lite";
import SimpleTable from '../../components/Table'
import { useParams } from "react-router-dom";
import { dataCompleted, blockchainData } from './constants';


const AchTransactionsDetail: React.FC = observer(() => {
    let { id } = useParams();
    const [dataDetail, setDataDetail] = useState<any>([]);


    useEffect(() => {
        let data = dataCompleted.find((value: any) => {
            return value.id == id
        })
        let detailData = []
        detailData.push(data)
        setDataDetail(detailData)
    }, [dataCompleted]);

    return (
        <div>
            <div>
                <h4 className='title-h4'>ACH Transaction data</h4>
            </div>
            <div>
                <SimpleTable rows={dataDetail} disabledPaginate={true} delete_items={false} />
            </div>
            <div>
                <h4 className='title-h4'>Blockchain data</h4>
            </div>
            <div>
                <SimpleTable rows={blockchainData} disabledPaginate={true} delete_items={false} />
            </div>
        </div>
    )

})

export default AchTransactionsDetail;
