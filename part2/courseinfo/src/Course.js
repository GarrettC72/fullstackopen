const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Header = ({ course }) => <h2>{course}</h2>

const Content = ({ parts }) => 
  <>
    {parts.map(part => <Part key={part.id} part={part} />)}
  </>

const Total = ({ sum }) => <strong>total of {sum} exercises</strong>

const Course = ({ course }) => {
  const parts = course.parts
  const initialValue = 0
  const total = parts.reduce((s, p) => s + p.exercises, initialValue)

  return (
    <div>
      <Header course={course.name} />
      <Content parts={parts} />
      <Total sum={total} />
    </div>
  )
}

export default Course