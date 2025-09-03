import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as programService from '../../services/programService';
import './ProgramForm.css';

const ProgramForm = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const data = await programService.show(programId);
        setFormData(data);
      } catch (err) {
        console.error('Error fetching program:', err);
      }
    };

    if (programId) {
      fetchProgram();
    }
  }, [programId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.is_default) return;
    try {
      if (programId) {
        await programService.update(formData, programId);
        navigate(`/programs/${programId}`);
      } else {
        await programService.create(formData);
        navigate('/programs');
      }
    } catch (err) {
      console.error('Error saving program:', err);
    }
  };

  if (formData.is_default) {
    return (
      <div className="form-container default-program-message">
        <div className="form-header">
          <h2>Cannot Edit Default Program</h2>
        </div>
        <p>Default programs are not editable. You can only use them as templates.</p>
        <div className="form-actions">
          <button onClick={() => navigate('/programs')} className="form-button secondary">
            Back to Programs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{programId ? 'Edit Program' : 'Create New Program'}</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Program Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="enter program name"
            className="form-input"
          />
        </div>
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(programId ? `/programs/${programId}` : '/programs')}
            className="form-button secondary"
          >
            Cancel
          </button>
          <button type="submit" className="form-button primary">
            {programId ? 'Save Changes' : 'Create Program'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramForm;

