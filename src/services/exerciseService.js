const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/programs/`

const index = async (programId,workoutId) => {
    try {
        const res = await fetch(`${BASE_URL}/${programId}/workouts/${workoutId}`)
        const data = await res.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

const show = async (programId,workoutId,exerciseId) => {
  try {
        const res = await fetch(`${BASE_URL}/${programId}/workouts/${workoutId}/exercises/${exerciseId}`)
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const create = async (formData,programId,workoutId) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(`${BASE_URL}/${programId}/workouts/${workoutId}`, {
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

const update = async (formData, programId, workoutId,exerciseId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${programId}/workouts/${workoutId}/exercises/${exerciseId}`, {
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

const deleteExercise = async (programId,workoutId,exerciseId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${programId}/workouts/${workoutId}/exercises/${exerciseId}`, {
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
    deleteExercise,
}