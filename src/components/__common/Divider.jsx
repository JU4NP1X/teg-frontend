export default function Divider({ style }) {
  return (
    <div
      style={{
        width: '100%',
        height: 1,
        backgroundColor: '#c3c3c3',
        marginTop: 1,
        ...style,
      }}
    />
  )
}
