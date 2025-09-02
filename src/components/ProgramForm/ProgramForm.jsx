import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as programService from '../../services/programService';

const ProgramForm = (props) => {

  const {programId} = useParams()
  const  initialState = {
    name:'',
  }
  const [formData, setFormData] = useState(initialState)

  useEffect(()=>{
    const fetchProgram = async()=>{
      const data = await programService.show(programId)
      setFormData(data)
    }
    if(programId) fetchProgram()
  },[programId])

  const handleChange = (evt) => {
		setFormData({ ...formData, [evt.target.name]: evt.target.value })
	}

  const handleSubmit = (event) => {
    event.preventDefault();
    if (programId) {
      props.handleUpdateProgram(formData, programId);
    } else {
      props.handleAddProgram(formData);
    }
  };
    return(
    <>
        <form onSubmit={handleSubmit}>
            <Form.Label>Program Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter program name"
              />
            
        </form>
    </>
  )
}

export default ProgramForm;

