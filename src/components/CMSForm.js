import { FormControl, Button, TextField, Modal, Box, Typography,CircularProgress} from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { helper } from "../utils/helper"

const { REACT_APP_DATABASE_URL = "http://localhost" } = process.env

export const CMSForm = () => {
  const [isVerified, setIsVerified] = useState(false)
  const [openModal, setModal] = useState(false)
  const [openLoader, setLoader]= useState(false)
  const [formDetails, setFormDetails] = useState({
    first_name: "",
    last_name: "",
    physical_address: "",
    billing_address: "",
    submit_attempt: false
  })

  const handleOnChange = (e) =>{
    setFormDetails((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }
  const handleModal = () =>{
    setModal(!openModal)
  }
  const handleSubmit = (e)=>{
    const form_answers = Object.values(formDetails)
    //checks if all answers are existing
    const isGood = form_answers.every(Boolean)

    e.preventDefault();
    setFormDetails((prevState)=>
    ({
      ...prevState,
      submit_attempt: true
    }))

    isGood && setLoader(true)

    //API CALL
    isGood && helper.APICALL.POST(`${REACT_APP_DATABASE_URL}/record`, {
      first_name: formDetails.first_name,
      last_name: formDetails.last_name,
      delivery_address: {
        physical_address: formDetails.physical_address,
        billing_address: formDetails.billing_address
      }
    }).then(data => {
      data.status === 200 && data.data.success ? setIsVerified(true) : (setIsVerified(false))
      // data.status !== 200 && data.data.success ? setModal(true) : setModal(false)
      console.log("DATA", data)
      setLoader(false)
    })
      .catch(error =>{
        setModal(true)
        setLoader(false)
        console.log("ERROR :", error)
      })
  }

  const handleReset = (e)=>{
    setFormDetails({
      first_name: "",
      last_name: "",
      physical_address: "",
      billing_address: "",
      submit_attempt: false
    })
  }
    return (
    <div style={{padding: '5px'}}>
     <FormControl sx={{ width: '35ch' }}>

    <label style={{fontSize: '40px'}}> CMS FORM</label>
    <TextField
      helperText="Please enter your first name"
      id="first_name"
      label="First Name"
      onChange={handleOnChange}
      value={formDetails.first_name || ""}
      error={!formDetails.first_name && formDetails.submit_attempt ? true : false}

    />

    <TextField
      helperText="Please enter your last name"
      id="last_name"
      label="Last Name"
      onChange={handleOnChange}
      value={formDetails.last_name || ""}
      error={!formDetails.last_name && formDetails.submit_attempt ? true : false}
    />
    <TextField
      helperText="Please enter your Physical Address"
      id="physical_address"
      label="Physical Address"
      onChange={handleOnChange}
      value={formDetails.physical_address || ""}
      error={!formDetails.physical_address && formDetails.submit_attempt ? true : false}

    />
    <TextField
      helperText="Please enter your Billing Address"
      id="billing_address"
      label="Billing Address"
      value={formDetails.billing_address || ""}
      onChange={handleOnChange}
      error={!formDetails.billing_address && formDetails.submit_attempt ? true : false}

    />
    <div >
     

    <Button
            type="submit"
            variant="contained"
            color="primary"
            // className={classes.submit}
            onClick={handleSubmit}
            disabled={openLoader}
          >
        Submit Form
       </Button>
       <Button
            type="submit"
            variant="contained"
            color="secondary"
            // className={classes.submit}
            onClick={handleReset}
            disabled={openLoader}
            >
        Reset Form
       </Button>
       <Box>
      {openLoader && <CircularProgress color="warning"/>}  
      </Box>
    </div>

    <div style={{padding: 60, position: "relative"}}> 
       { (formDetails.submit_attempt && isVerified )&& <Navigate replace to="/submitted"></Navigate> }
       <Modal
       sx={{ padding: 10, width: "50%", margin: "auto", border: "3px"  }}
        open={openModal}
        // onClose={handleM}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
    <Box sx={{ backgroundColor : "white", padding: "20px", width: "60%", border: "100 px"}}>
    <Typography id="modal-modal-title" variant="h6" component="h2">
    Something went wrong...
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
         Unable to process your request. Please check your internet connection. </Typography>
         <Button variant="text" color="primary" onClick={handleModal}> Close </Button>
        </Box>
      </Modal>
      </div>
    </FormControl>
    
    </div>
    )
}