const percentageStyle = {
  fontSize: '10px',
}

const Percentage = ({ percentage }: { percentage?: number }) => {
  console.log({ percentage })
  return percentage ? <div style={percentageStyle}>({parseInt(`${percentage}`)}%)</div> : null
}

export default Percentage