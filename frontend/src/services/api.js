const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.13.73:5000/api';

const getAuthHeaders = () => {
  const storedUser = localStorage.getItem('chatAppUser');
  if (storedUser) {
    try {
      const { token } = JSON.parse(storedUser);
      if (token) {
        return { 'Authorization': `Bearer ${token}` };
      }
    } catch (e) {
      console.error('Failed to parse stored user', e);
    }
  }
  return {};
};

export const fetchChatResponse = async (message, model, onChunk, onChatId = null, chatId = null) => {
  const url = chatId ? `${API_BASE_URL}/chats/${chatId}/stream` : `${API_BASE_URL}/chats/stream`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ message, model }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error('ReadableStream not yet supported in this browser.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    let boundary = buffer.indexOf('\n\n');
    
    while (boundary !== -1) {
      const eventStr = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      
      const lines = eventStr.split('\n');
      let isChatIdEvent = false;
      let data = '';
      
      for (const line of lines) {
        if (line.startsWith('event: chat_id')) {
          isChatIdEvent = true;
        } else if (line.startsWith('data: ')) {
          data += line.substring(6);
        }
      }
      
      if (isChatIdEvent && onChatId) {
        onChatId(parseInt(data, 10));
      } else if (data !== '') {
        try {
          const parsedChunk = JSON.parse(data);
          onChunk(parsedChunk);
        } catch (e) {
          onChunk(data);
        }
      }
      
      boundary = buffer.indexOf('\n\n');
    }
  }
};

export const fetchChats = async () => {
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const fetchChatMessages = async (chatId) => {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const fetchModelsApi = async () => {
  const response = await fetch(`${API_BASE_URL}/models`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const loginApi = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Login failed with status ${response.status}`);
  }
  
  return response.json();
};

export const signupApi = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Signup failed with status ${response.status}`);
  }

  return response.json();
};
