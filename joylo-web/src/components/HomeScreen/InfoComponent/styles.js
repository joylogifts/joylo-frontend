import makeStyles from "@mui/styles/makeStyles";

const useStyle = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    height: "auto",
    marginTop: "80px",
    marginBottom: "80px",
    width: "80%",
    margin: "0 auto",
  },
  mainText: {
    fontWeight: "400",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "40px",
  },
  secondaryText: {
    fontSize: "20px",
    lineHeight: "25px",
    color: "#667085",
    marginBottom: "30px",
  },
  greenButton: {
    backgroundColor: "#36C75C",
    margin: "4px",
    border: "1px solid #36C75C",
    transition: "all 0.5s",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
  },
  yellowButton: {
    backgroundColor: "#FFA500",
    margin: "4px",
    border: "1px solid #FFA500",
    transition: "all 0.5s",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
  },
  blueButton: {
    backgroundColor: "#0074D9",
    margin: "4px",
    border: "1px solid #0074D9",
    transition: "all 0.5s",
    "&:hover": {
      backgroundColor: "white",
      color: "black",
    },
  },
}));

export default useStyle;
