export const servertapRequest = async (path: string) => {
    return new Promise<false | any>(async (resolve, reject) => {
        setTimeout(() => {
            resolve(false);
        }, 1000 * 3);

        try {
            const response = await fetch(`${process.env.URL}/v1/${path}`, {
                headers: {
                    'key': process.env.KEY || '',
                }
            });

            if (response.status.toString().startsWith('2'))
                return resolve(await response.json());
            else
                return resolve(false);
        } catch (e) {
            return resolve(false);
        }
    })
};