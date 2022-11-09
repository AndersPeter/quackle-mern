import {FaUser} from  'react-icons/fa'
import Admin from './Admin'


function Profile() {
    return (
        <>
            <section className="heading">
                <h1>
                    <FaUser /> Profile
                    <p>Your Qaucking so far</p>
                </h1>
            </section>
            <section className="answers">
                <div className="answears_list">
                    {/* TODO List of personal quacks from DB */}
                    <p>List of quacks</p>
                </div>
        
            </section>
             
        {/*TODO: Hide Admin if not admin = false */}
        <Admin />


        </>
    )
}

export default Profile