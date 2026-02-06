// utils/fetchData.js
export const fetchData = async (url, method = 'GET', body = null, token = null) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const config = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    };
    const res = await fetch(url, config);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || `HTTP error! status: ${res.status}`);
    }
    const text = await res.text();
    return text ? JSON.parse(text) : {};
};
