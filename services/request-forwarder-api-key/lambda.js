import warmer from "lambda-warmer";

export const handler = async (event, context) => {

    // if a warming event
    if (await warmer(event)) return 'warmed'
    // else proceed with handler logic

    const url = 'https://api.tenderly.co/api/v1/account/boba/project/gnosis-multisig-frontend/simulate'
    const apiKey = process.env.ACCESS_TOKEN

    try {
        /*console.log('## ENVIRONMENT VARIABLES: ' + serialize(process.env))
        console.log('## CONTEXT: ' + serialize(context))
        console.log('## EVENT: ' + serialize(event))*/


        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': apiKey,
            },
            body: JSON.stringify(event),
        })

        return await response.json()

    } catch (error) {
        return {
            statusCode: 500,
            msg: 'Unable to send: ' + error,
        }
    }
};
