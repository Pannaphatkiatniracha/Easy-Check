const API_BASE = 'http://localhost:5000'

export const getToken = () => localStorage.getItem('token')

export const saveTokenToStorage = (token) => {
  if (token) {
    localStorage.setItem('token', token)
  }
}

export const saveUserToStorage = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export const clearAuthStorage = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getUserFromStorage = () => {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    const user = JSON.parse(raw)
    return normalizeUser(user)
  } catch (error) {
    console.error('Error parsing user from storage:', error)
    return null
  }
}

export const normalizeUser = (data) => {
  if (!data) return null

  const fullName = data.full_name || data.fullName || `${data.firstname || ''} ${data.lastname || ''}`.trim()
  const role = data.role
    || (data.role_id === 4 ? 'superadmin' : data.role_id === 3 ? 'admin' : null)
    || (typeof data.position === 'string' && data.position.toLowerCase().includes('super') ? 'superadmin' : null)
    || (typeof data.position === 'string' && data.position.toLowerCase().includes('admin') ? 'admin' : 'user')
  const profileImage = data.profileImage || data.avatar || data.avatarUrl || data.avatar_url || null
  const employeeCode = data.id_employee || data.employeeCode || data.employee_id || data.employeeId || ''
  const joinDate = data.joindate || data.joinDate || data.created_at || ''

  return {
    id: data.id,
    id_employee: employeeCode,
    fullName: fullName || 'Admin Panel',
    email: data.email || data.Email || '',
    phone: data.phone || data.Phone || '',
    username: data.username || data.username || employeeCode || '',
    department: data.department || '',
    position: data.position || '',
    role,
    joinDate,
    profileImage,
    raw: data
  }
}

export const fetchCurrentUser = async () => {
  const token = getToken()
  if (!token) {
    throw new Error('No authentication token available')
  }

  const response = await fetch(`${API_BASE}/admin/me`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    const responseText = await response.text()
    throw new Error(`Failed to fetch current user: ${response.status} ${responseText}`)
  }

  const data = await response.json()
  const normalized = normalizeUser(data)
  saveUserToStorage(normalized)
  return normalized
}
