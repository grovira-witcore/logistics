import React from 'react';
import { identity } from '../../utils/identity.js';
import { getWords } from '../../utils/get-words.js';

const LoginUserPassword = identity(function ({ defaultI18n, setMustChange }) {
  const [formData, setFormData] = React.useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = React.useState(null);

  const words = getWords(defaultI18n.code);

  const handleChange = function (e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleSubmit = async function (e) {
    e.preventDefault();
    const requiredFields = [];
    if (formData.username === null || formData.username === undefined || formData.username === '') {
      requiredFields.push(words.username);
    }
    if (formData.password === null || formData.password === undefined || formData.password === '') {
      requiredFields.push(words.password);
    }
    if (requiredFields.length > 0) {
      setErrorMessage(words.requiredFields + ': ' + requiredFields.join(', '));
      return;
    }
    const response = await fetch('/api/auth/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password
      })
    });
    if (response.ok) {
      const result = await response.json();
      if (result.mustChangePassword) {
        setMustChange({ username: formData.username });
      }
      else {
        sessionStorage.setItem('token', result.accessToken);
        window.location.href = '/';
      }
    }
    else {
      if (response.status === 404) {
        setErrorMessage(words.invalidUsernameOrPassword);
      }
      else {
        setErrorMessage(words.somethingWentWrong);
      }
    }
  }

  return (
    <div className="w-100" style={{ paddingBottom: '8px' }}>
      <div className="form-group">
        <div className="form-label">{words.username}</div>
        <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} />
      </div>
      <div className="form-group">
        <div className="form-label">{words.password}</div>
        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} />
      </div>
      <div className="px-2" style={{ paddingTop: '12px' }}>
        <button className="btn-primary w-100 text-center" onClick={handleSubmit}>
          {words.login}
        </button>
      </div>
      {errorMessage ?
        <div className="px-2" style={{ paddingTop: '18px' }}>
          <div className="bg-red p-2" style={{ fontSize: '12px', fontWeight: 'bold', color: "#FFFFFF" }}>
            {errorMessage}
          </div>
        </div> :
        null
      }
    </div>
  );
});

export default LoginUserPassword;