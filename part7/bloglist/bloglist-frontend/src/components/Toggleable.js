import { useState, forwardRef, useImperativeHandle } from 'react'
import { Button, ThemeProvider, createTheme } from '@mui/material'
import PropTypes from 'prop-types'

const Toggleable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  const theme = createTheme({
    palette: {
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },
    },
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="contained" color="primary" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="neutral"
            onClick={toggleVisibility}
          >
            cancel
          </Button>
        </ThemeProvider>
      </div>
    </div>
  )
})

Toggleable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

Toggleable.displayName = 'Toggleable'

export default Toggleable
