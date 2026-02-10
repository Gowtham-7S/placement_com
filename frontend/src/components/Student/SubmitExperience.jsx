import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Common/Card';
import Button from '../Common/Button';
import Input from '../Common/Input';
import Alert from '../Common/Alert';
import { experienceAPI } from '../../api';
import './Student.css';

const SubmitExperience = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const [basicInfo, setBasicInfo] = useState({
    company_name: '',
    role_applied: '',
    drive_id: null,
  });

  const [interviewInfo, setInterviewInfo] = useState({
    result: 'pass',
    offer_received: false,
    ctc_offered: '',
    overall_difficulty: 'medium',
    confidence_level: 5,
    overall_feedback: '',
    interview_duration: '',
  });

  const [rounds, setRounds] = useState([
    {
      round_number: 1,
      round_type: 'Technical',
      duration_minutes: 45,
      result: 'pass',
      difficulty_level: 'medium',
      topics: [],
      questions: [],
      tips_and_insights: '',
    },
  ]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterviewChange = (e) => {
    const { name, value, type, checked } = e.target;
    setInterviewInfo((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : name === 'confidence_level' || name === 'interview_duration'
          ? parseInt(value)
          : value,
    }));
  };

  const handleRoundChange = (index, field, value) => {
    const newRounds = [...rounds];
    newRounds[index] = { ...newRounds[index], [field]: value };
    setRounds(newRounds);
  };

  const addRound = () => {
    const nextNumber = rounds.length + 1;
    setRounds([
      ...rounds,
      {
        round_number: nextNumber,
        round_type: 'Technical',
        duration_minutes: 45,
        result: 'pass',
        difficulty_level: 'medium',
        topics: [],
        questions: [],
        tips_and_insights: '',
      },
    ]);
  };

  const removeRound = (index) => {
    setRounds(rounds.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!basicInfo.company_name || !basicInfo.role_applied) {
      setAlert({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...basicInfo,
        ...interviewInfo,
        rounds,
      };

      await experienceAPI.submit(payload);
      setAlert({ type: 'success', message: 'Experience submitted successfully!' });
      setTimeout(() => navigate('/student/experiences'), 2000);
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Submission failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Submit Interview Experience</h1>
        <p>Step {step} of 3: {step === 1 ? 'Basic Info' : step === 2 ? 'Interview Details' : 'Round Details'}</p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <Card>
          <Card.Body>
            <h3 style={{ marginBottom: '20px' }}>Company & Position</h3>
            <Input
              label="Company Name"
              name="company_name"
              value={basicInfo.company_name}
              onChange={handleBasicChange}
              placeholder="e.g., Google, Microsoft"
              required
            />
            <Input
              label="Role Applied"
              name="role_applied"
              value={basicInfo.role_applied}
              onChange={handleBasicChange}
              placeholder="e.g., Software Engineer, Data Scientist"
              required
            />
            <Input
              label="Placement Drive (Optional)"
              name="drive_id"
              type="number"
              value={basicInfo.drive_id}
              onChange={handleBasicChange}
              placeholder="Drive ID if applicable"
            />
          </Card.Body>
          <Card.Footer>
            <Button label="Next" onClick={() => setStep(2)} variant="primary" />
          </Card.Footer>
        </Card>
      )}

      {/* Step 2: Interview Information */}
      {step === 2 && (
        <Card>
          <Card.Body>
            <h3 style={{ marginBottom: '20px' }}>Interview Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Result"
                name="result"
                type="select"
                value={interviewInfo.result}
                onChange={handleInterviewChange}
              >
                <option value="pass">Pass</option>
                <option value="fail">Fail</option>
                <option value="not_sure">Not Sure</option>
              </Input>
              <Input
                label="Overall Difficulty"
                name="overall_difficulty"
                type="select"
                value={interviewInfo.overall_difficulty}
                onChange={handleInterviewChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Input>
            </div>
            <Input
              label="Confidence Level (1-10)"
              name="confidence_level"
              type="range"
              min="1"
              max="10"
              value={interviewInfo.confidence_level}
              onChange={handleInterviewChange}
              style={{ width: '100%' }}
            />
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
              {interviewInfo.confidence_level}/10
            </p>
            <Input
              label="Interview Duration (minutes)"
              name="interview_duration"
              type="number"
              value={interviewInfo.interview_duration}
              onChange={handleInterviewChange}
            />
            <Input
              label="Overall Feedback"
              name="overall_feedback"
              type="textarea"
              value={interviewInfo.overall_feedback}
              onChange={handleInterviewChange}
              placeholder="Share your overall interview experience..."
            />
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="offer"
                name="offer_received"
                checked={interviewInfo.offer_received}
                onChange={handleInterviewChange}
              />
              <label htmlFor="offer">Offer Received</label>
            </div>
            {interviewInfo.offer_received && (
              <Input
                label="CTC Offered"
                name="ctc_offered"
                type="number"
                value={interviewInfo.ctc_offered}
                onChange={handleInterviewChange}
                placeholder="In LPA"
              />
            )}
          </Card.Body>
          <Card.Footer>
            <Button label="Back" onClick={() => setStep(1)} variant="outline" />
            <Button label="Next" onClick={() => setStep(3)} variant="primary" />
          </Card.Footer>
        </Card>
      )}

      {/* Step 3: Round Details */}
      {step === 3 && (
        <>
          <Card>
            <Card.Body>
              <h3 style={{ marginBottom: '20px' }}>Interview Rounds</h3>
              {rounds.map((round, index) => (
                <Card key={index} className="mt-3">
                  <Card.Header>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Round {round.round_number}</span>
                      {rounds.length > 1 && (
                        <Button
                          label="Remove"
                          onClick={() => removeRound(index)}
                          variant="danger"
                          size="small"
                        />
                      )}
                    </div>
                  </Card.Header>
                  <Card.Body>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <Input
                        label="Round Type"
                        value={round.round_type}
                        onChange={(e) => handleRoundChange(index, 'round_type', e.target.value)}
                      >
                        <option>HR</option>
                        <option>Technical</option>
                        <option>Coding</option>
                        <option>Managerial</option>
                        <option>Group_Discussion</option>
                      </Input>
                      <Input
                        label="Duration (minutes)"
                        type="number"
                        value={round.duration_minutes}
                        onChange={(e) => handleRoundChange(index, 'duration_minutes', parseInt(e.target.value))}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <Input
                        label="Result"
                        value={round.result}
                        onChange={(e) => handleRoundChange(index, 'result', e.target.value)}
                      >
                        <option>pass</option>
                        <option>fail</option>
                        <option>not_evaluated</option>
                      </Input>
                      <Input
                        label="Difficulty Level"
                        value={round.difficulty_level}
                        onChange={(e) => handleRoundChange(index, 'difficulty_level', e.target.value)}
                      >
                        <option>easy</option>
                        <option>medium</option>
                        <option>hard</option>
                      </Input>
                    </div>
                    <Input
                      label="Tips and Insights"
                      type="textarea"
                      value={round.tips_and_insights}
                      onChange={(e) => handleRoundChange(index, 'tips_and_insights', e.target.value)}
                      placeholder="What you learned from this round..."
                    />
                  </Card.Body>
                </Card>
              ))}
              <Button
                label="+ Add Another Round"
                onClick={addRound}
                variant="outline"
                fullWidth
                style={{ marginTop: '16px' }}
              />
            </Card.Body>
          </Card>

          <Card style={{ marginTop: '24px' }}>
            <Card.Footer>
              <Button label="Back" onClick={() => setStep(2)} variant="outline" />
              <Button label="Submit Experience" onClick={handleSubmit} variant="primary" loading={loading} />
            </Card.Footer>
          </Card>
        </>
      )}
    </div>
  );
};

export default SubmitExperience;
