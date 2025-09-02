const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/programs`

const index = async (programId) => {
    try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${BASE_URL}/${programId}/workouts`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const data = await res.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

const show = async (programId,workoutId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${programId}/workouts/${workoutId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const create = async (formData,programId) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BASE_URL}/${programId}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })

    const data = await res.json()
    return data

  } catch (err) {
    console.log(err)
  }
}

const update = async (formData, programId, workoutId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${programId}/workouts/${workoutId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    return data
  } catch(err) {
    console.log(err)
  }
}

const deleteWorkout = async (programId,workoutId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${programId}/workouts/${workoutId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    return data
  } catch(err) {
    console.log(err)
  }
}

export{
    index,
    show,
    create,
    update,
    deleteWorkout,
}