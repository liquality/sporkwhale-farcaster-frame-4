const percentageStyle = {
  fontSize: '10px',
}

const Percentage = ({ percentage }: { percentage?: number }) => {
  return percentage ? <div style={percentageStyle}>({percentage}%)</div> : null
}

export default Percentage