const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/api/programs`

const index = async () => {
    try {
        const res = await fetch(BASE_URL)
        const data = await res.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

const show = async (programId) => {
  try {
    const res = await fetch(`${BASE_URL}/${programId}`)
    const data = await res.json()
    return data
  } catch (err) {
    console.log(err)
  }
}

const create = async (formData) => {
  try {
    const token = localStorage.getItem('token')

    const res = await fetch(BASE_URL, {
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

const update = async (formData, programId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${programId}`, {
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

const deleteProgram = async (programId) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/${programId}`, {
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
    deleteProgram,
}