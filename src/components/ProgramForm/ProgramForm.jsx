import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as programService from '../../services/programService';
import './ProgramForm.css';

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
    <div className="program-form">
      <h2>{programId ? 'Edit Program' : 'Create Program'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Program Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter program name"
          />
        </div>
        
        <div>
          <button type="submit">
            {programId ? 'Update' : 'Create'}
          </button>
          <button 
            type="button" 
            onClick={() => window.history.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramForm;

