type TableRows = {
    headerRows: any;
}

const RowHeaders = ({ headerRows }: TableRows) => {


    if (headerRows.length > 0) {
        return (
            <>
                {
                    headerRows.map((value: any) => {
                        return (<th className='table-head' id={value} key={value}>{value}</th>)
                    })
                }
            </>
        )

    } else {
        return <th className='table-head'>Data not found</th>
    }


}

export default RowHeaders;