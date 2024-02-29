const percentageStyle = {
  fontSize: '10px',
}

const Percentage = ({ correct, total }: { correct?: number, total?: number }) => {
  console.log({ correct, total })
  return (correct && total) ? <div style={percentageStyle}>({correct}/{total})</div> : null
}

export default Percentage