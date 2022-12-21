import { useState } from 'react';
import { useEffect } from 'react';
import axios, { Axios } from 'axios'
import loadinglogo from "./loading.png"
import './App.css';


const validate = (values) => {
  const errors = {}
  if (values.firstName && values.firstName.length < 4) {
    errors.name = "username should have at least 4 characters"

  }
  if (values.lastName && values.lastName.length < 4) {
    errors.firstName = "surname should have at least 4 characters"
  }
  if (values.email && !values.email.includes("@gmail.com")) {
    errors.email = "email should include @gmail.com"
  }
  if (values.age && values.age < 18) {
    errors.age = "min 18 year"
  }
  if (!values.sex) {
    errors.gender = "gender is important"
  }

  return errors
}

function UserList({ data, setUserList, onEdituser, onDelteUser, showUser, showAllUsers, setShowAllUser, userList }) {

  return (
    <>
      <ul>
        {data.map((elem, index) => {
          return (<>

            <li key={elem._id}> {elem.firstName}
              {" "}{elem.lastName}  {" "}
              {elem.age} years old   {" "}
              {elem.sex}  {" "} id: {elem._id}
              <button onClick={() => onEdituser(elem)}>EDIT</button>
              <button onClick={() => onDelteUser(elem._id)}>DELETE</button>
            </li>

          </>


          )

        })}
        <button onClick={() => {
          console.log("shemodis")
          console.log(showUser)
          return (
            setShowAllUser(!showUser),

            showAllUsers(userList)





          )
        }}>{showUser == true ? "show " : " hide "}all users</button>

      </ul>
    </>
  )
}
function Errortext({ formErrors }) {
  return (
    <div>
      {formErrors.firstName && <p style={{ color: "red" }}>{formErrors.firstName}</p>}
      {formErrors.lastName && <p style={{ color: "red" }}>{formErrors.lastName} </p>}
      {formErrors.email && <p style={{ color: "red" }}>{formErrors.email}</p>}
      {formErrors.age && <p style={{ color: "red" }}>{formErrors.age}</p>}
      {formErrors.sex && <p style={{ color: "red" }}>{formErrors.sex}</p>}
    </div>

  )
}
function Inputdiv({ saveUser, formValue, formErrors, onFormChange, isFormValid, onChange }) {
  return (<form onSubmit={saveUser}>
    <label>userName</label> <br></br>
    <input type="text" name="firstName" placeholder='userName' value={formValue.firstName} onChange={onFormChange} className={`${formErrors.firstName ? "red" : "black"}`} /><br></br>

    <label>surName</label> <br></br>
    <input type="text" name="lastName" placeholder='surName' value={formValue.lastName} onChange={onFormChange} className={formErrors.lastName ? "red" : "black"} /><br></br>

    <label>mail</label> <br></br>
    <input type="text" name="email" placeholder='email' value={formValue.email} onChange={onFormChange} className={formErrors.email ? "red" : "black"} /><br></br>

    <label>age</label> <br></br>
    <input type="number" min="0" name="age" placeholder='age' value={formValue.age} onChange={onFormChange} className={formErrors.age ? "red" : "black"} /><br></br>

    {/* <label>gender</label> */}
    <select onChange={onFormChange} name="sex" value={formValue.gender} className={formErrors.sex ? "red" : "black"} >
      <option >choose gender</option>
      <option value="female">female</option>
      <option value="male">male</option>
    </select> <br></br>

    <button disabled={!isFormValid}>submit</button>


  </form>
  )
}

const instance = axios.create({
  baseURL: "http://localhost:3001",

})



function App() {


  const [formValue, setFormValue] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    sex: "",
    id: ""


  })
  const [formErrors, setFormErrors] = useState({})
  const [userList, setUserList] = useState([])
  const [isFormValid, setIsFormValid] = useState(false)
  const [isUserUpdate, setIsUserUpdate] = useState(false)
  const [showUser, setShowAllUser] = useState(true)
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState([])

  const onFormChange = (e) => {
    setFormValue((prev) => ({
      ...prev, [e.target.name]: e.target.value

    }))

  }
  const saveUser = (e) => {
    e.preventDefault()
    if (isUserUpdate) {
      //   setData(
      //     (prevUsersList) => {
      //     const updateUserList=prevUsersList.reduce((acc,curr)=>{
      //       if(curr.id===formValue.id){
      //         axios.put(`http://localhost:3001/users/${formValue.id}`,formValue)

      //         return [...acc,formValue]
      //       }else{

      //         return[...acc,curr]
      //       }
      //     },[])

      // return updateUserList
      //   }
      //   )

    } else {

      instance
        .post("/users", formValue)
    }

    setFormValue(

      {
        firstName: "",
        lastName: "",
        email: "",
        age: "",
        sex: ""

      }

    )

    setIsFormValid(false)


  }

  useEffect(() => {

    const timer = setTimeout(() => {
      const validationResult = validate(formValue)
      setFormErrors(validationResult);
      if (formValue.firstName &&
        !validationResult.firstName &&
        formValue.lastName &&
        !validationResult.lastName &&
        !validationResult.email &&
        formValue.age &&
        !validationResult.age

      ) {
        setIsFormValid(true)
      } else {
        setIsFormValid(false)

      }
    }, 500);
    return () => {
      clearTimeout(timer)
    }
  }, [formValue])

  const onEdituser = (userinfo) => {
    setFormValue(userinfo)
    setIsUserUpdate(true)
  }
  const showAllUsers = ({ data }) => {
    if (showUser == true) {
      instance.get("/users").then(({ data }) => {
        console.log(data.data)



        return setData(data.data)
      }).catch((error) => console.log("error", error))
    } else {
      setData([])
    }


  }
  const deleteUser = (ids) => {
    console.log(ids)
    axios.delete(`http://localhost:3001/users/${ids}`);
  };




  useEffect(() => {
    const userData = async () => {
      setLoading("loading");
      try {
        const { data } = await axios.get("http://localhost:3001/users");
        setData(data.data);
      } catch (error) {
        setFormErrors("ERROR");
      } finally {
        setLoading(false);
      }
    };
    userData();
  }, []);
  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const { data } = await instance.get("/users")
        console.log("dataa", data)
        setData(data.data)



      } catch (error) {
        setFormErrors(error)
        console.log("errprr", error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])


  return (
    <>
      {/* {loading && <img src={loadinglogo} className="loading"></img>
}
        {formErrors && <h1>{formErrors}</h1>} */}
      <div className='input_div'>

        <Inputdiv
          saveUser={saveUser}
          formValue={formValue}
          formErrors={formErrors}
          isFormValid={isFormValid}
          onFormChange={onFormChange}
        />

        <Errortext
          formErrors={formErrors} >

        </Errortext>

        <UserList
          data={data}
          setUserList={setUserList}
          onEdituser={onEdituser}
          onDelteUser={deleteUser}
          showUser={showUser}
          showAllUsers={showAllUsers}
          setShowAllUser={setShowAllUser}
          userList={userList}

        />




      </div>
    </>

  )
}

export default App;