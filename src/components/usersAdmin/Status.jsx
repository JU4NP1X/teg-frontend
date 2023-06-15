const Status = (prop) => {
    if (prop.usrStatus == 1) {
      return (
        <span
          style={{
            backgroundColor: "#f6ffed",
            padding: "2px",
            border: "0.5px solid",
            borderColor: "#52c41a",
            color: "#52c41a",
          }}
          key={prop.usrStatus}
        >
          ACTIVO
        </span>
      );
    } else {
      return (
        <span
          style={{
            backgroundColor: "#fff1f0",
            padding: "2px",
            border: "0.5px solid",
            borderColor: "#ffa39e",
            color: "#f5222d",
          }}
          key={prop.usrStatus}
        >
          INACTIVO
        </span>
      );
    }
  };

  export default Status