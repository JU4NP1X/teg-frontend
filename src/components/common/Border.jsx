const Border = ({ children, style = {} }) => {
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 4, ...style }}>
      {children}
    </div>
  )
}

export default Border
