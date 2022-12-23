import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const instance = axios.create({
  baseURL: "http://localhost:3001"
}
)
const defaultVelues = {
  firstName: "",
  lastName: "",
  age: "",
  email: "",
  sex: "femail"
}
function App() {
  const [userList, setUserList] = useState([])
  const [isUserUpdating, setIsUserUpdating] = useState(false)
  const [values, setValues] = useState(defaultVelues)


  const onInfutChange = (e) => {
    const { value, name } = e.target
    setValues({ ...values, [name]: value })
  }

  const getUser = async () => {
    const { data } = await instance.get("/users")
    setUserList(data.data)
    console.log("data", data)
  }
  useEffect(() => {
    getUser()
  }, [])

  const onDeleteUser = async (id) => {
    await instance.delete(`/users/${id}`)
    getUser()
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    if (isUserUpdating) {
      await instance.put(`/users/${values.id}`,values)

    } else {
      await instance.post("/users", values)
    }
    await getUser()
    setValues(defaultVelues)
    setIsUserUpdating(false)

  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input name="firstName" value={values.firstName} placeholder="firstName" onChange={onInfutChange} /> <br />
        <input name="lastName" value={values.lastName} placeholder="lastName" onChange={onInfutChange} /><br />
        <input type="number" name="age" value={values.age} placeholder="age" onChange={onInfutChange} /><br />
        <input name="email" value={values.email} placeholder="email" onChange={onInfutChange} /><br />
        <button>Save</button>

      </form>
      {userList.map((user) => (
        <React.Fragment key={user._id}>
          <h1>{user.firstName}</h1>
          <h1>{user.lastName}</h1>
          <h1>{user.age}</h1>
          <button onClick={() => {
            setIsUserUpdating(true)
            setValues({
              firstName: user.firstName,
              lastName:user.lastName,
              age: user.age,
              email: user.email,
              sex: user.sex,
              id:user._id
            })
          }}>EDIT</button>
          <button onClick={() => { onDeleteUser(user._id) }}>DELETE</button>

          <hr />
        </React.Fragment>
      ))}


    </div>
  )

}

export default App;
