import { useState } from 'react'

const Header = props => <h1>{props.name}</h1>

const Button = props => <button onClick={props.onClick}>{props.text}</button>

const StatisticLine = (props) => {
  if(props.text === "Positive"){
    return (
      <tr><td>{props.text}: {props.value}%</td></tr>
    )
  }
  return (
    <tr><td>{props.text}: {props.value}</td></tr>
  )
}
const Statistics = ({clicks}) => {
  const total = clicks.good + clicks.neutral + clicks.bad
  const average = (clicks.good * 1 + clicks.bad * -1) / total
  const positive = clicks.good * (100/total)

  if(total === 0){
    return (
      <div>
        <h2>
        There is no Feedback yet.
        </h2>
      </div>
    )
  }

  return (  
  <div>
    <table>
      <tbody>
      <StatisticLine text="good" value ={clicks.good} />
      <StatisticLine text="neutral" value ={clicks.neutral} />
      <StatisticLine text="bad" value ={clicks.bad} />
      <StatisticLine text="Total" value ={total} />
      <StatisticLine text="Average" value ={average} />
      <StatisticLine text="Positive" value ={positive} />
      </tbody>
    </table>
  </div>
  )
}

const App = () => {

  // save clicks of each button to its own state
  const [clicks, setClicks] = useState({
    good: 0, neutral: 0, bad: 0
  })
  const handleGoodClick = () => {
    setClicks({ ...clicks, good: clicks.good + 1})
  }
  const handleNeutralClick = () => {
    setClicks({ ...clicks, neutral: clicks.neutral + 1})
  }
  const handleBadClick = () => {
    setClicks({ ...clicks, bad: clicks.bad + 1})
  }

  return (
    <div>
      <Header name="Give Feedback" />

      <Button        
        onClick={handleGoodClick}        
        text='Good'      
      />      
      <Button        
        onClick={handleNeutralClick}        
        text='Neutral'      
      />           
      <Button        
        onClick={handleBadClick}        
        text='Bad'      
      />           

      <Header name="Statistics" />
      <Statistics clicks={clicks}/>

    </div>
  )
}

export default App