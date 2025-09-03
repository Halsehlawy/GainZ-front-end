import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as programService from '../../services/programService';
import './ProgramList.css';

const ProgramList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const data = await programService.index();
      setPrograms(data);
      setError('');
    } catch (err) {
      setError('Failed to load programs');
      console.error('Error fetching programs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading programs...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="program-list">
      <div className="program-list-header">
        <h2>Programs</h2>
        <Link to="/programs/new">Create New Program</Link>
      </div>

      {programs.length === 0 ? (
        <div>
          <p>No programs found.</p>
          <Link to="/programs/new">Create Program</Link>
        </div>
      ) : (
        <div className="programs">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className="program-item"
              onClick={() => navigate(`/programs/${program.id}`)}
              role="link"
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  navigate(`/programs/${program.id}`);
                }
              }}
            >
              <div className="program-item-header">
                <h3>{program.name}</h3>
                <p className="program-type">{program.is_default ? '(Default)' : '(Custom)'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramList;
