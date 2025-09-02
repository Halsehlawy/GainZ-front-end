const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api`

const index = async (programId, workoutId) => {
    try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${BASE_URL}/programs/${programId}/workouts/${workoutId}/exercises`, {
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

const getAllExercises = async () => {
    try {
        const res = await fetch(`${BASE_URL}/exercises`)
        const data = await res.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

const show = async (exerciseId) => {
  try {
        const res = await fetch(`${BASE_URL}/exercises/${exerciseId}`)
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const create = async (formData) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BASE_URL}/exercises`, {
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

const update = async (formData, exerciseId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/exercises/${exerciseId}`, {
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

const deleteExercise = async (exerciseId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/exercises/${exerciseId}`, {
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
    getAllExercises,
    show,
    create,
    update,
    deleteExercise,
}