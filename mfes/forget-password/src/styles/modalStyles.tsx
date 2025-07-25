export const modalStyles = (theme: any, width?: string) => ({
  width: width ?? '85%',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  borderRadius: '8px',
  zIndex: '9999',
  outline: 'none',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  '@media (min-width: 600px)': {
    width: '450px',
  },
});
