import { Link } from 'react-router-dom'
import { plants } from '../../data/plants'
const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <section>
        <p>
          This is going to be a series of things to demo in sandbox Things that
        </p>
        <p>I want to demo:</p>
        {/* <pre>{JSON.stringify(plants, null, 2)}</pre> */}
        <ul>
          <li>
            <Link to='/dashboard/2'>Queries</Link>
          </li>
          <li>
            <Link to='/dashboard/3'>3. React Hook Form</Link>
          </li>
          <li>
            <Link to='/dashboard/4'>Time and conversion</Link>
          </li>
        </ul>
      </section>
    </div>
  )
}
export default Dashboard
