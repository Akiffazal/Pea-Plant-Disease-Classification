import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress, Fade, Box } from "@material-ui/core";
import image from "./bg.png";
import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@material-ui/core/colors';
import Clear from '@material-ui/icons/Clear';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from 'axios';

const ColorButton = withStyles((theme) => ({
  root: {
    color: '#fff',
    background: 'linear-gradient(45deg, #be6a77 30%, #e57373 90%)',
    borderRadius: '12px',
    padding: '15px 40px',
    fontSize: '16px',
    fontWeight: 700,
    boxShadow: '0 4px 20px rgba(190, 106, 119, 0.3)',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(45deg, #a85d6a 30%, #d16666 90%)',
      boxShadow: '0 6px 25px rgba(190, 106, 119, 0.4)',
      transform: 'translateY(-2px)',
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  clearButton: {
    width: "-webkit-fill-available",
    borderRadius: "12px",
    padding: "15px 22px",
    color: "#000000a6",
    fontSize: "20px",
    fontWeight: 900,
  },
  root: { 
    maxWidth: 400, 
    flexGrow: 1,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  media: { 
    height: 350,
    borderRadius: '12px 12px 0 0',
  },
  paper: { 
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: { 
    justifyContent: "center",
    padding: "2em 1em 0 1em",
    minHeight: '90vh',
  },
  mainContainer: {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    minHeight: "100vh",
    marginTop: "8px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  },
  imageCardEmpty: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  tableContainer: {
    backgroundColor: 'transparent !important',
    boxShadow: 'none !important',
    padding: theme.spacing(2),
  },
  table: {
    backgroundColor: 'transparent !important',
    borderCollapse: 'separate',
    borderSpacing: '0 10px',
  },
  tableHead: {
    backgroundColor: 'transparent !important',
  },
  tableRow: {
    backgroundColor: 'rgba(190, 106, 119, 0.05) !important',
    borderRadius: '8px',
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: 'rgba(190, 106, 119, 0.1) !important',
    },
  },
  tableCell: {
    fontSize: '19px',
    backgroundColor: 'transparent !important',
    border: 'none',
    color: '#2c3e50 !important',
    fontWeight: '600',
    padding: '12px 20px',
    borderBottom: 'none !important',
  },
  tableCell1: {
    fontSize: '14px',
    backgroundColor: 'transparent !important',
    border: 'none',
    color: '#7f8c8d !important',
    fontWeight: '700',
    padding: '8px 20px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: 'none !important',
  },
  tableBody: { backgroundColor: 'transparent !important' },
  text: { color: 'white !important', textAlign: 'center' },
  buttonGrid: {
    maxWidth: "400px",
    width: "100%",
    marginTop: theme.spacing(2),
  },
  detail: {
    backgroundColor: 'transparent',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  appbar: {
    background: 'rgba(190, 106, 119, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  loader: {
    color: '#be6a77 !important',
    marginBottom: theme.spacing(2),
  },
  dropzone: {
    minHeight: '250px',
    borderRadius: '12px',
    border: '2px dashed #be6a77',
    backgroundColor: 'rgba(190, 106, 119, 0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(190, 106, 119, 0.1)',
      borderColor: '#a85d6a',
    },
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [image, setImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendFile = async () => {
    if (!image || !selectedFile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const res = await axios.post(
        process.env.REACT_APP_API_URL,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 30000,
        }
      );
      
      if (res.status === 200) setData(res.data);
    } catch (err) {
      console.error("API Error:", err);
      setError(err.message || "Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) return;
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  const confidence = data ? (parseFloat(data.confidence) * 100).toFixed(2) : 0;

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography style={{ fontWeight: 700, fontSize: '1.2rem' }} className={classes.title} variant="h6" noWrap>
            🌱 Pea Plant Disease Detection
          </Typography>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
      
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid className={classes.gridContainer} container direction="row" justifyContent="center" alignItems="center" spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card className={`${classes.root} ${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              <Fade in={true} timeout={500}>
                <div>
                  {image && (
                    <CardActionArea>
                      <CardMedia className={classes.media} image={preview} component="img" />
                    </CardActionArea>
                  )}
                  
                  {!image && (
                    <CardContent className={classes.content}>
                      <DropzoneArea
                        acceptedFiles={['image/*']}
                        dropzoneText={"Drag & drop a pea leaf image here"}
                        onChange={onSelectFile}
                        maxFileSize={5000000}
                        dropzoneClass={classes.dropzone}
                        showPreviews={false}
                        showFileNames={false}
                        Icon={CloudUploadIcon}
                      />
                    </CardContent>
                  )}
                  
                  {error && (
                    <CardContent className={classes.detail}>
                      <Box color="error.main" fontWeight="fontWeightBold" textAlign="center">
                        ⚠️ Error: {error}
                      </Box>
                    </CardContent>
                  )}
                  
                  {data && !error && (
                    <CardContent className={classes.detail}>
                      <TableContainer component={Paper} className={classes.tableContainer}>
                        <Table className={classes.table}>
                          <TableHead className={classes.tableHead}>
                            <TableRow className={classes.tableRow}>
                              <TableCell className={classes.tableCell1}>Label</TableCell>
                              <TableCell align="right" className={classes.tableCell1}>Confidence</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody className={classes.tableBody}>
                            <TableRow className={classes.tableRow}>
                              <TableCell component="th" scope="row" className={classes.tableCell}>
                                {data.class.replace(/_/g, ' ')}
                              </TableCell>
                              <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  )}
                  
                  {isLoading && (
                    <CardContent className={classes.detail}>
                      <CircularProgress size={50} className={classes.loader} />
                      <Typography style={{ marginTop: 16, color: '#be6a77', fontWeight: 600 }}>
                        Analyzing your image...
                      </Typography>
                    </CardContent>
                  )}
                </div>
              </Fade>
            </Card>
          </Grid>
          
          {data && !error && (
            <Grid item className={classes.buttonGrid}>
              <ColorButton variant="contained" fullWidth onClick={clearData} startIcon={<Clear fontSize="large" />}>
                Clear Results
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};









// 1 ----------------------------------------------------------------------------------------
// import { useState, useEffect } from "react";
// import { makeStyles, withStyles } from "@material-ui/core/styles";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
// import Avatar from "@material-ui/core/Avatar";
// import Container from "@material-ui/core/Container";
// import React from "react";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
// import image from "./bg.png";
// import { DropzoneArea } from 'material-ui-dropzone';
// import { common } from '@material-ui/core/colors';
// import Clear from '@material-ui/icons/Clear';
// import axios from 'axios';

// const ColorButton = withStyles((theme) => ({
//   root: {
//     color: theme.palette.getContrastText(common.white),
//     backgroundColor: common.white,
//     '&:hover': {
//       backgroundColor: '#ffffff7a',
//     },
//   },
// }))(Button);

// const useStyles = makeStyles((theme) => ({
//   grow: { flexGrow: 1 },
//   clearButton: {
//     width: "-webkit-fill-available",
//     borderRadius: "15px",
//     padding: "15px 22px",
//     color: "#000000a6",
//     fontSize: "20px",
//     fontWeight: 900,
//   },
//   root: { maxWidth: 345, flexGrow: 1 },
//   media: { height: 400 },
//   paper: { padding: theme.spacing(2), margin: 'auto', maxWidth: 500 },
//   gridContainer: { justifyContent: "center", padding: "4em 1em 0 1em" },
//   mainContainer: {
//     backgroundImage: `url(${image})`,
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center',
//     backgroundSize: 'cover',
//     height: "93vh",
//     marginTop: "8px",
//   },
//   imageCard: {
//     margin: "auto",
//     maxWidth: 400,
//     height: 500,
//     backgroundColor: 'transparent',
//     boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
//     borderRadius: '15px',
//   },
//   imageCardEmpty: { height: 'auto' },
//   noImage: { margin: "auto", width: 400, height: "400 !important" },
//   input: { display: 'none' },
//   uploadIcon: { background: 'white' },
//   tableContainer: { backgroundColor: 'transparent !important', boxShadow: 'none !important' },
//   table: { backgroundColor: 'transparent !important' },
//   tableHead: { backgroundColor: 'transparent !important' },
//   tableRow: {
//     backgroundColor: 'transparent !important',
//     height: '40px',
//   },
//   tableCell: {
//     fontSize: '18px',
//     backgroundColor: 'transparent !important',
//     borderColor: 'transparent !important',
//     color: '#000000a6 !important',
//     fontWeight: 'bolder',
//     padding: '1px 16px 1px 12px',
//   },
//   tableCell1: {
//     fontSize: '13px',
//     backgroundColor: 'transparent !important',
//     borderColor: 'transparent !important',
//     color: '#000000a6 !important',
//     fontWeight: 'bolder',
//     padding: '1px 16px 1px 12px',
//   },
//   tableBody: { backgroundColor: 'transparent !important' },
//   text: { color: 'white !important', textAlign: 'center' },
//   buttonGrid: { maxWidth: "416px", width: "100%" },
//   detail: {
//     backgroundColor: 'white',
//     display: 'flex',
//     justifyContent: 'center',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   appbar: {
//     background: '#be6a77',
//     boxShadow: 'none',
//     color: 'white'
//   },
//   loader: { color: '#be6a77 !important' }
// }));

// export const ImageUpload = () => {
//   const classes = useStyles();
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [data, setData] = useState(null);
//   const [image, setImage] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const sendFile = async () => {
//     if (!image || !selectedFile) return;
    
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const formData = new FormData();
//       formData.append("file", selectedFile);
      
//       const res = await axios.post(
//         process.env.REACT_APP_API_URL,
//         formData,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           timeout: 30000,
//         }
//       );
      
//       if (res.status === 200) setData(res.data);
//     } catch (err) {
//       console.error("API Error:", err);
//       setError(err.message || "Network error occurred");
//       alert(`Error: ${err.message}\n\nIs the backend server running on port 8002?`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const clearData = () => {
//     setData(null);
//     setImage(false);
//     setSelectedFile(null);
//     setPreview(null);
//     setError(null);
//   };

//   useEffect(() => {
//     if (!selectedFile) {
//       setPreview(undefined);
//       return;
//     }
//     const objectUrl = URL.createObjectURL(selectedFile);
//     setPreview(objectUrl);
//     return () => URL.revokeObjectURL(objectUrl);
//   }, [selectedFile]);

//   useEffect(() => {
//     if (!preview) return;
//     sendFile();
//   }, [preview]);

//   const onSelectFile = (files) => {
//     if (!files || files.length === 0) {
//       setSelectedFile(undefined);
//       setImage(false);
//       setData(undefined);
//       return;
//     }
//     setSelectedFile(files[0]);
//     setData(undefined);
//     setImage(true);
//   };

//   const confidence = data ? (parseFloat(data.confidence) * 100).toFixed(2) : 0;

//   return (
//     <React.Fragment>
//       <AppBar position="static" className={classes.appbar}>
//         <Toolbar>
//           <Typography className={classes.title} variant="h6" noWrap>
//             Pea Plant Disease Detection
//           </Typography>
//           <div className={classes.grow} />
//         </Toolbar>
//       </AppBar>
//       <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
//         <Grid className={classes.gridContainer} container direction="row" justifyContent="center" alignItems="center" spacing={2}>
//           <Grid item xs={12}>
//             <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
//               {image && (
//                 <CardActionArea>
//                   <CardMedia className={classes.media} image={preview} component="img" title="Pea Leaf" />
//                 </CardActionArea>
//               )}
//               {!image && (
//                 <CardContent className={classes.content}>
//                   <DropzoneArea
//                     acceptedFiles={['image/*']}
//                     dropzoneText={"Drag and drop an image of a pea plant leaf to process"}
//                     onChange={onSelectFile}
//                     maxFileSize={5000000}
//                   />
//                 </CardContent>
//               )}
              
//               {error && (
//                 <CardContent className={classes.detail}>
//                   <Typography color="error" variant="h6">
//                     Error: {error}
//                   </Typography>
//                 </CardContent>
//               )}
              
//               {data && !error && (
//                 <CardContent className={classes.detail}>
//                   <TableContainer component={Paper} className={classes.tableContainer}>
//                     <Table className={classes.table} size="small">
//                       <TableHead className={classes.tableHead}>
//                         <TableRow className={classes.tableRow}>
//                           <TableCell className={classes.tableCell1}>Label:</TableCell>
//                           <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody className={classes.tableBody}>
//                         <TableRow className={classes.tableRow}>
//                           <TableCell component="th" scope="row" className={classes.tableCell}>
//                             {data.class}
//                           </TableCell>
//                           <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
//                         </TableRow>
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                 </CardContent>
//               )}
              
//               {isLoading && (
//                 <CardContent className={classes.detail}>
//                   <CircularProgress color="secondary" className={classes.loader} />
//                   <Typography className={classes.title} variant="h6" noWrap>
//                     Processing
//                   </Typography>
//                 </CardContent>
//               )}
//             </Card>
//           </Grid>
//           {data && !error && (
//             <Grid item className={classes.buttonGrid}>
//               <ColorButton variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" />}>
//                 Clear
//               </ColorButton>
//             </Grid>
//           )}
//         </Grid>
//       </Container>
//     </React.Fragment>
//   );
// };












// 2 ----------------------------------------------------------------------------------------

// import { useState, useEffect } from "react";
// import { makeStyles, withStyles } from "@material-ui/core/styles";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
// import Avatar from "@material-ui/core/Avatar";
// import Container from "@material-ui/core/Container";
// import React from "react";
// import Card from "@material-ui/core/Card";
// import CardContent from "@material-ui/core/CardContent";
// import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
// import cblogo from "./cblogo.PNG";
// import image from "./bg.png";
// import { DropzoneArea } from 'material-ui-dropzone';
// import { common } from '@material-ui/core/colors';
// import Clear from '@material-ui/icons/Clear';




// const ColorButton = withStyles((theme) => ({
//   root: {
//     color: theme.palette.getContrastText(common.white),
//     backgroundColor: common.white,
//     '&:hover': {
//       backgroundColor: '#ffffff7a',
//     },
//   },
// }))(Button);
// const axios = require("axios").default;

// const useStyles = makeStyles((theme) => ({
//   grow: {
//     flexGrow: 1,
//   },
//   clearButton: {
//     width: "-webkit-fill-available",
//     borderRadius: "15px",
//     padding: "15px 22px",
//     color: "#000000a6",
//     fontSize: "20px",
//     fontWeight: 900,
//   },
//   root: {
//     maxWidth: 345,
//     flexGrow: 1,
//   },
//   media: {
//     height: 400,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     margin: 'auto',
//     maxWidth: 500,
//   },
//   gridContainer: {
//     justifyContent: "center",
//     padding: "4em 1em 0 1em",
//   },
//   mainContainer: {
//     backgroundImage: `url(${image})`,
//     backgroundRepeat: 'no-repeat',
//     backgroundPosition: 'center',
//     backgroundSize: 'cover',
//     height: "93vh",
//     marginTop: "8px",
//   },
//   imageCard: {
//     margin: "auto",
//     maxWidth: 400,
//     height: 500,
//     backgroundColor: 'transparent',
//     boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
//     borderRadius: '15px',
//   },
//   imageCardEmpty: {
//     height: 'auto',
//   },
//   noImage: {
//     margin: "auto",
//     width: 400,
//     height: "400 !important",
//   },
//   input: {
//     display: 'none',
//   },
//   uploadIcon: {
//     background: 'white',
//   },
//   tableContainer: {
//     backgroundColor: 'transparent !important',
//     boxShadow: 'none !important',
//   },
//   table: {
//     backgroundColor: 'transparent !important',
//   },
//   tableHead: {
//     backgroundColor: 'transparent !important',
//   },
//   tableRow: {
//     backgroundColor: 'transparent !important',
//   },
//   tableCell: {
//     fontSize: '22px',
//     backgroundColor: 'transparent !important',
//     borderColor: 'transparent !important',
//     color: '#000000a6 !important',
//     fontWeight: 'bolder',
//     padding: '1px 24px 1px 16px',
//   },
//   tableCell1: {
//     fontSize: '14px',
//     backgroundColor: 'transparent !important',
//     borderColor: 'transparent !important',
//     color: '#000000a6 !important',
//     fontWeight: 'bolder',
//     padding: '1px 24px 1px 16px',
//   },
//   tableBody: {
//     backgroundColor: 'transparent !important',
//   },
//   text: {
//     color: 'white !important',
//     textAlign: 'center',
//   },
//   buttonGrid: {
//     maxWidth: "416px",
//     width: "100%",
//   },
//   detail: {
//     backgroundColor: 'white',
//     display: 'flex',
//     justifyContent: 'center',
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   appbar: {
//     background: '#be6a77',
//     boxShadow: 'none',
//     color: 'white'
//   },
//   loader: {
//     color: '#be6a77 !important',
//   }
// }));
// export const ImageUpload = () => {
//   const classes = useStyles();
//   const [selectedFile, setSelectedFile] = useState();
//   const [preview, setPreview] = useState();
//   const [data, setData] = useState();
//   const [image, setImage] = useState(false);
//   const [isLoading, setIsloading] = useState(false);
//   let confidence = 0;

//   const sendFile = async () => {
//     if (image) {
//       let formData = new FormData();
//       formData.append("file", selectedFile);
//       let res = await axios({
//         method: "post",
//         url: process.env.REACT_APP_API_URL,
//         data: formData,
//       });
//       if (res.status === 200) {
//         setData(res.data);
//       }
//       setIsloading(false);
//     }
//   }

//   const clearData = () => {
//     setData(null);
//     setImage(false);
//     setSelectedFile(null);
//     setPreview(null);
//   };

//   useEffect(() => {
//     if (!selectedFile) {
//       setPreview(undefined);
//       return;
//     }
//     const objectUrl = URL.createObjectURL(selectedFile);
//     setPreview(objectUrl);
//   }, [selectedFile]);

//   useEffect(() => {
//     if (!preview) {
//       return;
//     }
//     setIsloading(true);
//     sendFile();
//   }, [preview]);

//   const onSelectFile = (files) => {
//     if (!files || files.length === 0) {
//       setSelectedFile(undefined);
//       setImage(false);
//       setData(undefined);
//       return;
//     }
//     setSelectedFile(files[0]);
//     setData(undefined);
//     setImage(true);
//   };

//   if (data) {
//     confidence = (parseFloat(data.confidence) * 100).toFixed(2);
//   }

//   return (
//     <React.Fragment>
//       <AppBar position="static" className={classes.appbar}>
//         <Toolbar>
//           <Typography className={classes.title} variant="h6" noWrap>
//             Pea Plant disease Detection
//           </Typography>
//           <div className={classes.grow} />
//           <Avatar src={cblogo}></Avatar>
//         </Toolbar>
//       </AppBar>
//       <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
//         <Grid
//           className={classes.gridContainer}
//           container
//           direction="row"
//           justifyContent="center"
//           alignItems="center"
//           spacing={2}
//         >
//           <Grid item xs={12}>
//             <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
//               {image && <CardActionArea>
//                 <CardMedia
//                   className={classes.media}
//                   image={preview}
//                   component="img"
//                   title="Contemplative Reptile"
//                 />
//               </CardActionArea>
//               }
//               {!image && <CardContent className={classes.content}>
//                 <DropzoneArea
//                   acceptedFiles={['image/*']}
//                   dropzoneText={"Drag and drop an image of a potato plant leaf to process"}
//                   onChange={onSelectFile}
//                 />
//               </CardContent>}
//               {data && <CardContent className={classes.detail}>
//                 <TableContainer component={Paper} className={classes.tableContainer}>
//                   <Table className={classes.table} size="small" aria-label="simple table">
//                     <TableHead className={classes.tableHead}>
//                       <TableRow className={classes.tableRow}>
//                         <TableCell className={classes.tableCell1}>Label:</TableCell>
//                         <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
//                       </TableRow>
//                     </TableHead>
//                     <TableBody className={classes.tableBody}>
//                       <TableRow className={classes.tableRow}>
//                         <TableCell component="th" scope="row" className={classes.tableCell}>
//                           {data.class}
//                         </TableCell>
//                         <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
//                       </TableRow>
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </CardContent>}
//               {isLoading && <CardContent className={classes.detail}>
//                 <CircularProgress color="secondary" className={classes.loader} />
//                 <Typography className={classes.title} variant="h6" noWrap>
//                   Processing
//                 </Typography>
//               </CardContent>}
//             </Card>
//           </Grid>
//           {data &&
//             <Grid item className={classes.buttonGrid} >

//               <ColorButton variant="contained" className={classes.clearButton} color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" />}>
//                 Clear
//               </ColorButton>
//             </Grid>}
//         </Grid >
//       </Container >
//     </React.Fragment >
//   );
// };