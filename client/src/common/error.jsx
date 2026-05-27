function Error({ message }) {
  return (
    <div className="alert alert-danger" role="alert">
      {message || "Something went wrong. Please try again."}
    </div>
  );
}

export default Error;