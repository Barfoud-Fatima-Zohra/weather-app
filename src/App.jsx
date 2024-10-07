import {createTheme, ThemeProvider} from '@mui/material/styles';
import './App.css';
import Weather from './components/Weather';

function App() {

  const theme = createTheme({
    typography: {
      fontFamily : ["ROBOTO"]
    }
  })

  return (
    <ThemeProvider theme={theme} >
      <Weather />
    </ThemeProvider>
  )
}

export default App
