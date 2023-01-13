const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ parts }) => {
  const total =  parts.reduce((a, b) => {
      return { exercises: a.exercises + b.exercises }
  });

  return(
      <strong>
          Total of {total.exercises} exercises 
      </strong>
  )
}

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = ({ parts }) => {
    const partElemns = parts.map(part =>
      <Part key={part.id} part={part}/>
    );
    return(
      <p>{partElemns}</p>
    )
  
  }
const Course = ({course}) => {
  return(
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course