import React from 'react';
import { identity } from '../../utils/identity.js';
import { getWords } from '../../utils/get-words.js';

const LoginUserPasswordChange = identity(function ({ defaultI18n, username, setMustChange }) {
  const [formData, setFormData] = React.useState({ password: '', newPassword: '', confirmNewPassword: '' });
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
    if (formData.password === null || formData.password === undefined || formData.password === '') {
      requiredFields.push(words.password);
    }
    if (formData.newPassword === null || formData.newPassword === undefined || formData.newPassword === '') {
      requiredFields.push(words.newPassword);
    }
    if (formData.confirmNewPassword === null || formData.confirmNewPassword === undefined || formData.confirmNewPassword === '') {
      requiredFields.push(words.confirmNewPassword);
    }
    if (requiredFields.length > 0) {
      setErrorMessage(words.requiredFields + ': ' + requiredFields.join(', '));
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setErrorMessage(words.passwordsDoNotMatch);
      return;
    }
    const response = await fetch('/api/auth/change-password', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: formData.password,
        newPassword: formData.newPassword
      })
    });
    if (response.ok) {
      setMustChange(null);
    }
    else {
      if (response.status === 400) {
        setErrorMessage(words.invalidPasswordComplexity);
      }
      else if (response.status === 404) {
        setErrorMessage(words.invalidUsernameOrPassword);
      }
      else {
        setErrorMessage(words.somethingWentWrong);
      }
    }
  }

  const handleCancel = async function (e) {
    e.preventDefault();
    setMustChange(null);
  }

  return (
    <div className="w-100" style={{ paddingBottom: '8px' }}>
      <div className="form-group">
        <div className="form-label">{words.username}</div>
        <input type="text" className="form-control text-gray" value={username} disabled={true} />
      </div>
      <div className="form-group">
        <div className="form-label">{words.password}</div>
        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} />
      </div>
      <div className="form-group">
        <div className="form-label">{words.newPassword}</div>
        <input type="password" className="form-control" name="newPassword" value={formData.newPassword} onChange={handleChange} />
      </div>
      <div className="form-group">
        <div className="form-label">{words.confirmNewPassword}</div>
        <input type="password" className="form-control" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} />
      </div>
      <div className="px-2 d-flex gap-2" style={{ paddingTop: '12px' }}>
        <button className="btn-primary w-100 text-center" onClick={handleSubmit}>
          {words.save}
        </button>
        <button className="btn-outline-primary w-100 text-center" onClick={handleCancel}>
          {words.cancel}
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

export default LoginUserPasswordChange;
