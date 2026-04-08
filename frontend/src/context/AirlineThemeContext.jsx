import React, { createContext, useState, useContext } from 'react';

const AirlineThemeContext = createContext();

export const useAirlineTheme = () => useContext(AirlineThemeContext);

export const AirlineThemeProvider = ({ children }) => {
  const [themeConfig, setThemeConfig] = useState({
    airline: null,
    colors: {
      primary: 'var(--tw-colors-india-saffron)', // default Saffron
      secondary: 'var(--tw-colors-india-blue)', // default Blue
    }
  });

  const setAirlineTheme = (airlineCode) => {
    const themes = {
      'AI': { name: 'Air India', primary: '#E31837', secondary: '#FDB615' },
      '6E': { name: 'IndiGo', primary: '#001B94', secondary: '#00D1FF' },
      'UK': { name: 'Vistara', primary: '#5C0931', secondary: '#B98D5B' },
      'SG': { name: 'SpiceJet', primary: '#E42823', secondary: '#FEE000' },
      'QP': { name: 'Akasa Air', primary: '#F95C03', secondary: '#FFFFFF' }
    };

    if (themes[airlineCode]) {
      setThemeConfig({
        airline: airlineCode,
        colors: themes[airlineCode]
      });
    } else {
      setThemeConfig({
        airline: null,
        colors: {
          primary: '#FF9933', // Revert to default
          secondary: '#000080',
        }
      });
    }
  };

  const setCustomAirlineTheme = ({ airlineName, primary, secondary }) => {
    if (primary && secondary) {
      setThemeConfig({
        airline: airlineName || 'CUSTOM',
        colors: { primary, secondary },
      })
    }
  }

  return (
    <AirlineThemeContext.Provider value={{ themeConfig, setAirlineTheme, setCustomAirlineTheme }}>
      {children}
    </AirlineThemeContext.Provider>
  );
};
