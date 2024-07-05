import React, { useState } from 'react'
import useToast from '../../../hooks/useToast'
import TextField from '@mui/material/TextField'

const Calculators = () => {
  const [rawWeight, setRawWeight] = useState('')
  const [cookedWeight, setCookedWeight] = useState('')
  const [targetRawOz, setTargetRawOz] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState([])
  const showToast = useToast()

  const calculateChickenWeight = () => {
    const rawWeightNum = parseFloat(rawWeight)
    const cookedWeightNum = parseFloat(cookedWeight)
    const targetRawOzNum = parseFloat(targetRawOz)

    if (!rawWeightNum || !cookedWeightNum || !targetRawOzNum) {
      showToast('Please enter a valid number', 'error')
      return
    } else if (rawWeightNum < cookedWeightNum) {
      showToast('Cooked weight cannot be more than raw weight', 'error')
      return
    }

    const cookedPercentage = (cookedWeightNum / rawWeightNum) * 100
    const targetRawWeight = targetRawOzNum * 28.35
    const targetCookedWeight = (targetRawWeight * cookedPercentage) / 100

    const resultText = `For ${targetRawOzNum.toFixed(
      0
    )}oz of raw chicken, you should take ${targetCookedWeight.toFixed(
      1
    )}g of cooked chicken.`

    setResult(resultText)
    setHistory(prevHistory => [...prevHistory, targetCookedWeight.toFixed(1)])
    showToast(resultText, 'info')
  }

  return (
    <div>
      <h1>Chicken Calculator</h1>
      <div>
        <label>
          Raw Weight (g):
          <TextField
            id='outlined-basic'
            label='Outlined'
            variant='outlined'
            value={rawWeight}
            onChange={e => setRawWeight(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Cooked Weight (g):
          <input
            type='number'
            value={cookedWeight}
            onChange={e => setCookedWeight(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Target Raw Weight (oz):
          <input
            type='number'
            value={targetRawOz}
            onChange={e => setTargetRawOz(e.target.value)}
          />
        </label>
      </div>
      <button onClick={calculateChickenWeight}>Calculate</button>
      <div>
        <p>{result}</p>
        <ul>
          {history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Calculators
