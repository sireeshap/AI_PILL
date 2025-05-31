import React, { useState } from 'react';

function AgentUploadForm() {
  const [agentName, setAgentName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [agentFile, setAgentFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: agentName,
      description,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag), // Create an array of tags
      githubLink,
      agentFile: agentFile ? agentFile.name : null, // Just logging filename for now
    };
    console.log('Submitting Agent Data (simulated API call):', formData);
    // In a real app, you would use FormData to send this to the backend
    // e.g., const data = new FormData();
    // data.append('name', agentName); ... etc.
    // data.append('agentFile', agentFile);
    // agentService.upload(data);

    // Reset form after submission (optional)
    setAgentName('');
    setDescription('');
    setTags('');
    setGithubLink('');
    setAgentFile(null);
    if (e.target.elements.agentFile) {
      e.target.elements.agentFile.value = null; // Reset file input
    }
  };

  return (
    <div
      style={{ border: '1px solid #eee', padding: '15px', marginBlock: '20px' }}
    >
      <h3>Upload New Agent</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="agentName">Agent Name:</label>
          <br />
          <input
            type="text"
            id="agentName"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            required
            style={{ width: '95%', marginBottom: '10px', padding: '8px' }}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <br />
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            style={{ width: '95%', marginBottom: '10px', padding: '8px' }}
          />
        </div>
        <div>
          <label htmlFor="tags">Tags (comma-separated):</label>
          <br />
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            style={{ width: '95%', marginBottom: '10px', padding: '8px' }}
          />
        </div>
        <div>
          <label htmlFor="githubLink">GitHub Link (optional):</label>
          <br />
          <input
            type="url"
            id="githubLink"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            style={{ width: '95%', marginBottom: '10px', padding: '8px' }}
          />
        </div>
        <div>
          <label htmlFor="agentFile">Agent File (e.g., .zip, .py):</label>
          <br />
          <input
            type="file"
            id="agentFile"
            name="agentFile" // Important for FormData if used later
            onChange={(e) => setAgentFile(e.target.files[0])}
            style={{ marginBottom: '15px' }}
          />
          <p style={{ fontSize: '0.8em', color: 'gray' }}>
            Note: Actual file upload functionality will be implemented later.
            For now, only the filename will be logged.
          </p>
        </div>
        <button type="submit">Upload Agent</button>
      </form>
    </div>
  );
}

export default AgentUploadForm;
