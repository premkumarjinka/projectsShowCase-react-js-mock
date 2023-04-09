import {Component} from 'react'
import Loader from 'react-loader-spinner'
import AppItem from './components/AppItem'

import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here

const constants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'loading',
}
class App extends Component {
  state = {
    category: categoriesList[0].id,
    categories: [],
    status: constants.initial,
  }

  componentDidMount() {
    this.getCategory()
  }

  onSuccess = categ => {
    const data = categ.map(eachItem => ({
      id: eachItem.id,
      name: eachItem.name,
      imageUrl: eachItem.image_url,
    }))
    this.setState({categories: data, status: constants.success})
  }

  failureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.getCategory}>
        Retry
      </button>
    </>
  )

  getCategory = async () => {
    const {category} = this.state
    this.setState({status: constants.loading})
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    console.log(url)
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSuccess(data.projects)
    } else {
      this.setState({status: constants.failure})
    }
  }

  onCategory = event => {
    this.setState({category: event.target.value}, this.getCategory)
  }

  loading = () => (
    <div data-testid="loader" className="load">
      <Loader type="ThreeDots" color="#00BFFF" height={50} width={50} />
    </div>
  )

  successView = () => {
    const {categories} = this.state
    console.log('prem in success')
    return (
      <ul>
        {categories.map(eachItem => (
          <AppItem details={eachItem} key={eachItem.id} />
        ))}
      </ul>
    )
  }

  renderFinal = () => {
    const {status} = this.state
    // console.log(status.initial)
    console.log('prem in renderfinal')

    switch (status) {
      case constants.success:
        return this.successView()
      case constants.failure:
        return this.failureView()
      case constants.loading:
        return this.loading()
      default:
        return null
    }
  }

  render() {
    const {category, status} = this.state
    console.log(status)
    return (
      <div>
        <nav className="nav-container">
          <img
            className="img"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div>
          <select value={category} onChange={this.onCategory}>
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderFinal()}
      </div>
    )
  }
}

export default App
