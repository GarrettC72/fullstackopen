const QueryForm = ({ value, onChange }) => (
    <div>
        find countries <input 
            value={value}
            onChange={onChange}
        />
    </div>
)

export default QueryForm