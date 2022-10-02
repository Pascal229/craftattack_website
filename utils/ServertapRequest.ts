export const servertapRequest = async (path: string) => {
    const timeout = setTimeout(() => {
        return false
    }, 5000)

    const response = await fetch(`${process.env.URL}/v1/${path}`, {
        headers: {
            'key': process.env.KEY || '',
        }
    });

    clearTimeout(timeout)
    if (response.status.toString().startsWith('2'))
        return await response.json();
    else
        return false;
};