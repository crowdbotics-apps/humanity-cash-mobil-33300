
export const EmptyResponseDatatable = ({text = 'No items found', loading}) => {
  return (
    <p style={{display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>
      {loading ? 'Loading...': text}
    </p>
  )
}
