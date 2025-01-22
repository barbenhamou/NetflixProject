const createField = (label, type, id, placeholder, value, onChange) => {
  return (
    <div className="form-group mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        type={type}
        className="form-control"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default createField;