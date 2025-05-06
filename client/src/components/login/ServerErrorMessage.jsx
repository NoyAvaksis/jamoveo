function ServerErrorMessage({ message }) {
    if (!message) return null;
  
    return (
      <p className="text-sm text-red-200 mt-3 text-center">
        {message}
      </p>
    );
  }
  
  export default ServerErrorMessage;
  