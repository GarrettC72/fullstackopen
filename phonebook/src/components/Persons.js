const Person = ({ person }) => (
    <p>
        {person.name} {person.number}
    </p>
)

const Persons = ({ persons }) => (
    <div>
        {persons.map((person) => (
            <Person key={person.id} person={person} />
        ))}
    </div>
)

export default Persons