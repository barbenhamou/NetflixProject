export function StandAloneField({ label, type, id, placeholder, value, onChange }) {
  return (
    <div className="col-mb-12">
      <label for={id} className="form-label">{label}</label>
      <input type={type} className="form-control" id={id} value={value} placeholder={placeholder} onChange={onChange} required></input>
    </div>
  );
}

export function SideBySideField({ label, type, id, placeholder, value, onChange }) {
  return (
    <div className="col-md-6">
      <label for={id} className="form-label">{label}</label>
      <input type={type} className="form-control" id={id} value={value} placeholder={placeholder} onChange={onChange} required></input>
    </div>
  );
}

export default StandAloneField
