import React, { useState } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  InputAdornment,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { countries, Country } from '../../utils/countries';

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  error = false,
  helperText,
  disabled = false,
  required = false,
  label = 'Phone Number',
}) => {
  // Extract country code and phone number from the full value
  const getCountryAndNumber = (fullValue: string) => {
    if (!fullValue) return { country: countries[0], phoneNumber: '' };
    
    // Find the country that matches the beginning of the value
    const matchedCountry = countries.find(country => 
      fullValue.startsWith(country.phoneCode)
    );
    
    if (matchedCountry) {
      const phoneNumber = fullValue.substring(matchedCountry.phoneCode.length);
      return { country: matchedCountry, phoneNumber };
    }
    
    return { country: countries[0], phoneNumber: fullValue };
  };

  const { country: selectedCountry, phoneNumber } = getCountryAndNumber(value);
  
  const handleCountryChange = (newCountry: Country | null) => {
    if (newCountry) {
      onChange(`${newCountry.phoneCode}${phoneNumber}`);
    }
  };

  const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = event.target.value.replace(/[^\d]/g, ''); // Only digits
    onChange(`${selectedCountry.phoneCode}${newPhoneNumber}`);
  };

  return (
    <FormControl fullWidth error={error} margin="normal">
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Country Code Selector */}
        <Autocomplete
          value={selectedCountry}
          onChange={(event, newValue) => handleCountryChange(newValue)}
          options={countries}
          getOptionLabel={(option) => `${option.flag} ${option.phoneCode}`}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: '1.2em' }}>{option.flag}</Typography>
              <Typography variant="body2" sx={{ minWidth: 60 }}>
                {option.phoneCode}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.name}
              </Typography>
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Country"
              variant="outlined"
              sx={{ minWidth: 140 }}
              disabled={disabled}
              InputProps={{
                ...params.InputProps,
              }}
            />
          )}
          disabled={disabled}
          filterOptions={(options, { inputValue }) =>
            options.filter(
              (option) =>
                option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                option.phoneCode.includes(inputValue) ||
                option.code.toLowerCase().includes(inputValue.toLowerCase())
            )
          }
        />

        {/* Phone Number Input */}
        <TextField
          label={label}
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          variant="outlined"
          type="tel"
          fullWidth
          disabled={disabled}
          required={required}
          error={error}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Typography variant="body2" color="text.secondary">
                  {selectedCountry.phoneCode}
                </Typography>
              </InputAdornment>
            ),
          }}
          inputProps={{
            pattern: '[0-9]*',
            inputMode: 'numeric',
          }}
        />
      </Box>
      {helperText && (
        <FormHelperText>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default PhoneNumberInput;
