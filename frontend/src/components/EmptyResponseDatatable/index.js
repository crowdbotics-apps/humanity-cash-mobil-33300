
export const EmptyResponseDatatable = ({text = 'No items found', loading, loadingText}) => {
  return (
    <p style={{display: 'flex', height: '55vh', justifyContent: 'center', alignItems: 'center', fontSize: 20}}>
      {loading ? loadingText : text}
    </p>
  )
}
