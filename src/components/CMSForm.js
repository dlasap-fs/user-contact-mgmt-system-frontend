import { FormControl, Button, TextField} from "@mui/material";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { helper } from "../utils/helper"

const { REACT_APP_DATABASE_URL = "http://localhost" } = process.env

export const CMSForm = () => {
  const [isVerified, setIsVerified] = useState(false)
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
  const handleSubmit = (e)=>{
    e.preventDefault();
    setFormDetails((prevState)=>
    ({
      ...prevState,
      submit_attempt: true
    }))

    const form_answers = Object.values(formDetails)
    //checks if all answers are existing
    const isGood = form_answers.every(Boolean)

    //API CALL
    isGood && helper.APICALL.POST(`${REACT_APP_DATABASE_URL}/record`, {
      first_name: formDetails.first_name,
      last_name: formDetails.last_name,
      delivery_address: {
        physical_address: formDetails.physical_address,
        billing_address: formDetails.billing_address
      }
    }).then(data => {
      data.status === 200 && data.data.success ? setIsVerified(true) : setIsVerified(false)
      console.log("DATA", data)})
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
      helperText="Please enter your second name"
      id="last_name"
      label="Second Name"
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
          
        <Button
            type="submit"
            variant="contained"
            color="primary"
            // className={classes.submit}
            onClick={handleSubmit}
          >
        Submit Form
       </Button>

       <Button
            type="submit"
            variant="contained"
            color="secondary"
            // className={classes.submit}
            onClick={handleReset}
          >
        Reset Form
       </Button>

       { (formDetails.submit_attempt && isVerified )&& <Navigate replace to="/submitted"></Navigate> }
    </FormControl>
    </div>
    )
}