import {FaUser} from  'react-icons/fa'
import Admin from './Admin'


function Profile() {
    return (
        <>
            <section className="heading">
                <h1>
                    <FaUser /> Profile
                </h1>
            </section>
             
        {/*TODO: Hide Admin if not admin = false */}
        <Admin />


        </>
    )
}

export default Profile