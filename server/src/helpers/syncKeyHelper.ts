let activeKey:boolean =false 
export async function syncKey(){
    try{
        const response = await fetch(`https://triage-managment.netlify.app/keys/${process.env.APP_KEY}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-secret': process.env.MANAGER_SECRET || 'default'
            }
        })
        const data = await response.json();
        activeKey = data;
    }catch(err){
        console.error('Error:', err);
    }
}

export default activeKey;