import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faCopy } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';


const PasswordGenerator = () => {
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  const [passwordLength, setPasswordLength] = useState(8);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('Weak');
  const [keywords, setKeywords] = useState('');
  const [allowAmbiguous, setAllowAmbiguous] = useState(true);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [copyNotification, setCopyNotification] = useState(false); // Add this state variable
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const resetSettings = () => {
    setIncludeLowercase(true);
    setIncludeUppercase(true);
    setIncludeNumbers(true);
    setIncludeSpecialChars(true);
    setPasswordLength(8);
    setGeneratedPassword('');
    setPasswordStrength('Weak');
    setPasswordHistory([]);
  };

  const savePasswordToHistory = () => {
    const newPasswordHistory = [...passwordHistory, generatedPassword];
    setPasswordHistory(newPasswordHistory);
  };


  const toggleAmbiguousCharacters = () => {
    setAllowAmbiguous(!allowAmbiguous);
  };

  const toggleIncludeLowercase = () => {
    if (!includeLowercase && !allowAmbiguous) {
      setIncludeNumbers(false);
      setIncludeSpecialChars(false);
    }
    setIncludeLowercase(!includeLowercase);
  };

  const toggleIncludeUppercase = () => {
    if (!includeUppercase && !allowAmbiguous) {
      setIncludeNumbers(false);
      setIncludeSpecialChars(false);
    }
    setIncludeUppercase(!includeUppercase);
  };

  const toggleIncludeNumbers = () => {
    if (!includeNumbers) {
      setIncludeLowercase(true);
      setIncludeUppercase(true);
      setAllowAmbiguous(true);
    }
    setIncludeNumbers(!includeNumbers);
  };

  const toggleIncludeSpecialChars = () => {
    if (!includeSpecialChars) {
      setIncludeLowercase(true);
      setIncludeUppercase(true);
      setAllowAmbiguous(true);
    }
    setIncludeSpecialChars(!includeSpecialChars);
  };

  const handleKeywordsChange = (e) => {
    setKeywords(e.target.value);
  };

  const incorporateKeywords = (password, keywords) => {
    const keywordArray = keywords.split(',');
    let newPassword = password;

    keywordArray.forEach(keyword => {
      const keywordChars = keyword.split('');
      keywordChars.forEach(char => {
        const index = newPassword.indexOf(char);
        if (index !== -1) {
          newPassword = newPassword.slice(0, index) + newPassword.slice(index + 1);
        }
      });
      newPassword = `${keyword}${newPassword}`;
    });

    return newPassword;
  };

  const copyToClipboard = () => {
    const finalPassword = incorporateKeywords(generatedPassword, keywords);
    navigator.clipboard.writeText(finalPassword);
    setCopyNotification(true);
    setTimeout(() => {
      setCopyNotification(false);
    }, 2000); // Reset copy notification after 2 seconds
  };
  


  const evaluatePasswordStrength = () => {
    const length = passwordLength;

    if (length < 6) {
      setPasswordStrength('Very Weak');
    } else if (length < 10) {
      setPasswordStrength('Weak');
    } else if (length < 12) {
      setPasswordStrength('Medium');
    } else if (length < 14) {
      setPasswordStrength('Strong');
    } else {
      setPasswordStrength('Very Strong');
    }
  };

  const generatePassword = () => {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
    let validChars = '';

    if (includeLowercase) validChars += lowercaseChars;
    if (includeUppercase) validChars += uppercaseChars;
    if (includeNumbers) validChars += numberChars;
    if (includeSpecialChars) validChars += specialChars;

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * validChars.length);
      password += validChars[randomIndex];
    }

    const finalPassword = incorporateKeywords(password, keywords);

    setGeneratedPassword(finalPassword);
    evaluatePasswordStrength();
  };


   // Time-based Password Generation
   const generateTimeBasedPassword = () => {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    const timeBasedPassword = `${hours}${minutes}${seconds}`;
    setGeneratedPassword(timeBasedPassword);
    setPasswordStrength('Strong'); // You can adjust strength based on your criteria
  };

  // Geolocation-based Password Generation
  const generateGeoBasedPassword = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude.toFixed(4);
      const longitude = position.coords.longitude.toFixed(4);

      const geoBasedPassword = `${latitude}${longitude}`;
      setGeneratedPassword(geoBasedPassword);
      setPasswordStrength('Strong'); // You can adjust strength based on your criteria
    }, (error) => {
      alert(`Error getting geolocation: ${error.message}`);
    });
  };
  
  return (
    <div className="font-inter">
    <Navbar/>
    <div className="flex flex-wrap items-start mt-32 justify-center">
      {/* Geolocation-based Password Generation */}
      <div className="w-full md:w-1/4 px-4 mb-4 md:mb-0">
        <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center">
          {/* <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> */}
          Geolocation-based Password and Time based password
        </h2>
        <button
          onClick={generateGeoBasedPassword}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Generate Geo-based Password
        </button>

        <button
          onClick={generateTimeBasedPassword}
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Generate Time-based Password
        </button>

        {generatedPassword && (
          <div className="bg-gray-100 p-3 rounded flex items-center justify-between">
            <span className="text-sm">{generatedPassword}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedPassword);
                alert('Password copied to clipboard!');
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
            >
              <FontAwesomeIcon icon={faCopy} />
            </button>
          </div>
        )}
      </div>
      {/* Center Section */}
      <div className="w-full md:w-2/4  px-4 mb-4 md:mb-0">
        <div className="max-w-2xl mx-auto p-8 bg-white border border-gray-300 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Unique Password Generator</h1>
  
        <div className="mb-6">
          <label className="block font-bold mb-2">Password Length:</label>
          <select
            className="block w-full px-4 py-2 border rounded bg-gray-100 focus:outline-none focus:border-blue-500"
            value={passwordLength}
            onChange={(e) => setPasswordLength(Number(e.target.value))}
          >
            <option value={6}>6</option>
            <option value={8}>8</option>
            <option value={10}>10</option>
            <option value={12}>12</option>
            <option value={14}>14</option>
          </select>
        </div>
  
        <div className="mb-6">
          <label className="block font-bold mb-2">Include:</label>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={toggleIncludeLowercase}
              className="mr-2"
            />
            <span>Lowercase</span>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={toggleIncludeUppercase}
              className="mr-2"
            />
            <span>Uppercase</span>
          </div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={toggleIncludeNumbers}
              className="mr-2"
            />
            <span>Numbers</span>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={includeSpecialChars}
              onChange={toggleIncludeSpecialChars}
              className="mr-2"
            />
            <span>Special Characters</span>
          </div>
        </div>
  
        <div className="mb-6">
          <label className="block font-bold mb-2">Keywords (comma-separated):</label>
          <input
            type="text"
            value={keywords}
            onChange={handleKeywordsChange}
            className="w-full px-4 py-2 border rounded bg-gray-100 focus:outline-none focus:border-blue-500"
          />
        </div>
  
        <div className="mb-6">
          <input
            type="checkbox"
            checked={allowAmbiguous}
            onChange={toggleAmbiguousCharacters}
            className="mr-2"
          />
          <span className="font-bold">Allow Ambiguous Characters</span>
        </div>
  
        <div className="flex items-center mb-6">
          <button
            onClick={generatePassword}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
          >
            Generate Password
          </button>

          <button
  onClick={copyToClipboard}
  className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
    copyNotification ? 'cursor-not-allowed' : ''
  }`}
  disabled={copyNotification}
>
  {copyNotification ? 'Copied!' : 'Copy Password'}
</button>

        </div>

        {/* {copyNotification && (
        <div className="notification">Password copied to clipboard!</div>
      )} */}
  
        <div className="mb-4">
          <span className="font-bold">Password Strength:</span> {passwordStrength}
        </div>

        <div className="mb-6">
        <span className="font-bold">Generated Password:</span> {generatedPassword}
      </div>
  
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={togglePasswordVisibility}
            className="mr-2"
          />
          <span>Show Password</span>
        </div>
  
        <div className="flex items-center mb-4">
          <button
            onClick={savePasswordToHistory}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
            disabled={!generatedPassword}
          >
            Save Password
          </button>
          <button
            onClick={resetSettings}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Reset Settings
          </button>
        </div>
  
        {passwordHistory.length > 0 && (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Password History</h2>
            <ul>
              {passwordHistory.map((password, index) => (
                <li key={index}>{password}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      </div>
       
    </div>
    </div>
  );
};

export default PasswordGenerator;